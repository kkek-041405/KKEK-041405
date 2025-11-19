/**
 * Spotify OAuth Callback API Route
 *
 * GET /api/spotify/callback
 * Handles the OAuth callback from Spotify, exchanges code for tokens,
 * and stores them securely
 *
 * @module api/spotify/callback
 */

import { NextRequest, NextResponse } from "next/server";
import { createSpotifyService } from "@/services/spotify-service";

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
          `/auth/error?message=${encodeURIComponent("Spotify authentication was denied or failed")}`,
          request.url
        )
      );
    }

    // Validate code parameter
    if (!code) {
      return NextResponse.redirect(
        new URL(
          `/auth/error?message=${encodeURIComponent("No authorization code received")}`,
          request.url
        )
      );
    }

    // Verify state parameter for CSRF protection
    const storedState = request.cookies.get("spotify_auth_state")?.value;
    if (!state || !storedState || storedState !== state) {
      console.error("State mismatch - possible CSRF attack", { storedState, state });
      return NextResponse.redirect(
        new URL(
          `/auth/error?message=${encodeURIComponent("Invalid state parameter. Please try logging in again.")}`,
          request.url
        )
      );
    }
    
    // Exchange code for tokens
    const spotifyService = createSpotifyService();
    const tokenData = await spotifyService.exchangeCodeForToken(code);
    
    // Create response with redirect to the notes content page
    const response = NextResponse.redirect(
      new URL("/notes/content", request.url)
    );

    // Store tokens in secure HTTP-only cookies
    response.cookies.set("spotify_access_token", tokenData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    response.cookies.set("spotify_refresh_token", tokenData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    response.cookies.set(
      "spotify_token_expires_at",
      tokenData.expiresAt.toString(),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      }
    );

    // Clear the auth state cookie
    response.cookies.delete("spotify_auth_state");

    return response;
  } catch (error) {
    console.error("Error in Spotify callback:", error);

    return NextResponse.redirect(
      new URL(
        `/auth/error?message=${encodeURIComponent("Failed to complete authentication")}`,
        request.url
      )
    );
  }
}
