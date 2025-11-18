
import { NextRequest, NextResponse } from "next/server";
import { createSpotifyService } from "@/services/spotify-service";

const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minute buffer

/**
 * Retrieves a valid Spotify access token, refreshing it if necessary.
 *
 * @param request - The incoming NextRequest, used to access cookies.
 * @returns A promise that resolves to the access token, or null if unauthorized.
 */
export async function getSpotifyAccessToken(
  request: NextRequest,
): Promise<string | null> {
  const accessToken = request.cookies.get("spotify_access_token")?.value;
  const refreshToken = request.cookies.get("spotify_refresh_token")?.value;
  const expiresAtStr = request.cookies.get("spotify_token_expires_at")?.value;

  if (!refreshToken) {
    // If there's no refresh token, the user is not authenticated.
    return null;
  }

  const expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : 0;
  const isExpired = Date.now() >= expiresAt - TOKEN_REFRESH_BUFFER;

  if (accessToken && !isExpired) {
    // If we have a valid, non-expired access token, use it.
    return accessToken;
  }

  // If the token is expired or missing, we must refresh it.
  try {
    const spotifyService = createSpotifyService();
    const tokenData = await spotifyService.refreshAccessToken(refreshToken);

    // After a successful refresh, we need to return a response that sets the new cookies.
    // However, since this is a utility function, we can't directly manipulate the response.
    // The calling API route must handle setting the cookies. For now, we'll just return
    // the new token and rely on the next full auth check to update cookies,
    // or expect the calling function to handle it.
    
    // This is a limitation of this helper. A better approach might be middleware,
    // but for now, we'll return the new token. The cookies will be outdated until the next
    // call to an auth-checking endpoint that *does* set cookies.
    return tokenData.accessToken;

  } catch (error) {
    console.error("Failed to refresh Spotify token in helper:", error);
    // If refresh fails, the user is likely unauthorized.
    return null;
  }
}
