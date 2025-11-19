
/**
 * Spotify Token Refresh API Route
 *
 * POST /api/spotify/refresh
 * Securely refreshes the Spotify access token using the refresh token stored in Firestore.
 *
 * @module api/spotify/refresh
 */

import { NextResponse } from "next/server";
import { createSpotifyService } from "@/services/spotify-service";
import {
  getTokensFromFirestore,
  saveTokensToFirestore,
  deleteTokensFromFirestore,
  type SpotifyTokenData
} from "@/services/spotify-token-service";

/**
 * POST handler - Refreshes the Spotify access token.
 *
 * @returns A JSON response indicating success or failure.
 */
export async function POST(): Promise<NextResponse> {
  try {
    const currentTokens = await getTokensFromFirestore();

    if (!currentTokens?.refreshToken) {
      return NextResponse.json(
        { error: "Not authenticated. No refresh token found." },
        { status: 401 }
      );
    }

    const spotifyService = createSpotifyService();
    const refreshedTokens = await spotifyService.refreshAccessToken(
      currentTokens.refreshToken
    );

    const newTokens: SpotifyTokenData = {
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken, // Spotify might return a new refresh token
      expiresAt: refreshedTokens.expiresAt,
    };

    await saveTokensToFirestore(newTokens);

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully.",
      tokens: newTokens, // Send back the new tokens so the client can update its state
    });

  } catch (error) {
    console.error("Error in /api/spotify/refresh:", error);
    // If refresh fails, it's a critical auth issue.
    // We clear the tokens from Firestore to force a re-login.
    await deleteTokensFromFirestore();

    return NextResponse.json(
      {
        error: "Failed to refresh token",
        message:
          error instanceof Error ? error.message : "Session expired or invalid.",
      },
      { status: 500 }
    );
  }
}
