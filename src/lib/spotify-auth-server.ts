
import { NextRequest, NextResponse } from "next/server";
import { createSpotifyService } from "@/services/spotify-service";
import { getTokensFromFirestore, saveTokensToFirestore, deleteTokensFromFirestore } from "@/services/spotify-token-service";

const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minute buffer

/**
 * Retrieves a valid Spotify access token from Firestore, refreshing it if necessary.
 * This function is intended for use in server-side API routes.
 *
 * @param request - The incoming NextRequest.
 * @returns A promise that resolves to an object containing the access token and a cookie-setting function.
 */
export async function getSpotifyAccessToken(
  request: NextRequest,
): Promise<{ accessToken: string | null; applyCookies: (res: NextResponse) => void }> {
  const tokens = await getTokensFromFirestore();
  const noOp = (res: NextResponse) => {};

  if (!tokens?.refreshToken) {
    // If there's no refresh token, the user is not authenticated.
    return { accessToken: null, applyCookies: noOp };
  }

  const isExpired = Date.now() >= tokens.expiresAt - TOKEN_REFRESH_BUFFER;

  if (tokens.accessToken && !isExpired) {
    // If we have a valid, non-expired access token, use it.
    return { accessToken: tokens.accessToken, applyCookies: noOp };
  }

  // If the token is expired or missing, we must refresh it.
  try {
    const spotifyService = createSpotifyService();
    const refreshedTokenData = await spotifyService.refreshAccessToken(tokens.refreshToken);

    // Save the new tokens back to Firestore
    await saveTokensToFirestore(refreshedTokenData);

    // The new token is the one we should use now.
    return { accessToken: refreshedTokenData.accessToken, applyCookies: noOp };

  } catch (error) {
    console.error("Failed to refresh Spotify token in server helper:", error);
    // If refresh fails, delete the tokens to force re-authentication.
    await deleteTokensFromFirestore();
    return { accessToken: null, applyCookies: noOp };
  }
}
