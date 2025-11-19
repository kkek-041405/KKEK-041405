
/**
 * Spotify Auth Initialization API Route
 *
 * GET /api/spotify/auth
 * Generates and returns the Spotify authorization URL for OAuth flow
 *
 * @module api/spotify/auth
 */

import { NextRequest, NextResponse } from "next/server";
import { createSpotifyService } from "@/services/spotify-service";

/**
 * GET handler - Generates Spotify authorization URL
 *
 * @param request - Next.js request object
 * @returns Redirect to Spotify authorization page or JSON response with auth URL
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const spotifyService = createSpotifyService();

    // Generate auth URL with state for CSRF protection
    const { url, state } = spotifyService.generateAuthUrl();

    // Store state in cookie for verification in callback
    const response = NextResponse.redirect(url);
    response.cookies.set("spotify_auth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error("Error generating Spotify auth URL:", error);

    return NextResponse.json(
      {
        error: "Failed to initialize Spotify authentication",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
