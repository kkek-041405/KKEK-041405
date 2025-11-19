
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

    // Generate auth URL without state for CSRF protection
    const { url } = spotifyService.generateAuthUrl();

    // Redirect to the authorization URL
    const response = NextResponse.redirect(url);

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
