
/**
 * Spotify OAuth Callback API Route
 *
 * GET /api/spotify/callback
 * Handles the OAuth callback from Spotify, exchanges code for tokens,
 * and stores them securely in Firestore.
 *
 * @module api/spotify/callback
 */

import { NextRequest, NextResponse } from "next/server";
import { createSpotifyService } from "@/services/spotify-service";
import { saveTokensToFirestore } from "@/services/spotify-token-service";

/**
 * GET handler - Processes Spotify OAuth callback
 *
 * @param request - Next.js request object
 * @returns Redirect to success page or error response
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Check for OAuth errors
    if (error) {
      console.error("Spotify OAuth error:", error);
      return NextResponse.redirect(
        new URL(
          `/notes?error=${encodeURIComponent("Spotify authentication was denied or failed")}`,
          request.url
        )
      );
    }

    // Validate code parameter
    if (!code) {
      return NextResponse.redirect(
        new URL(
          `/notes?error=${encodeURIComponent("No authorization code received")}`,
          request.url
        )
      );
    }

    // Verify state parameter for CSRF protection
    const storedState = request.cookies.get("spotify_auth_state")?.value;
    if (!state || !storedState || storedState !== state) {
      console.error("State mismatch - possible CSRF attack", { storedState, state });
      const response = NextResponse.redirect(
        new URL(
          `/notes?error=${encodeURIComponent("Invalid state parameter. Please try logging in again.")}`,
          request.url
        )
      );
      // Clear the invalid state cookie to allow for a clean retry
      response.cookies.delete("spotify_auth_state");
      return response;
    }
    
    // Exchange code for tokens
    const spotifyService = createSpotifyService();
    const tokenData = await spotifyService.exchangeCodeForToken(code);
    
    // Save tokens to Firestore
    await saveTokensToFirestore({
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresAt: tokenData.expiresAt,
    });
    
    // Create response with redirect to the notes content page
    const response = NextResponse.redirect(
      new URL("/notes/content?view=spotify", request.url)
    );

    // Clear the auth state cookie AFTER successful token storage
    response.cookies.delete("spotify_auth_state");

    return response;
  } catch (error) {
    console.error("Error in Spotify callback:", error);

    const response = NextResponse.redirect(
        new URL(
            `/notes?error=${encodeURIComponent("Failed to complete authentication")}`,
            request.url
        )
    );
    // Also clear the state cookie on failure to prevent it from being stuck
    response.cookies.delete('spotify_auth_state');
    return response;
  }
}
