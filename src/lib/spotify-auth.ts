
import { NextRequest, NextResponse } from "next/server";
import { createSpotifyService } from "@/services/spotify-service";

const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minute buffer

/**
 * Retrieves a valid Spotify access token, refreshing it if necessary.
 *
 * This function is designed to be called from within your API routes.
 * It returns the valid token and a function to apply new cookies to the response if a refresh occurred.
 *
 * @param request - The incoming NextRequest, used to access cookies.
 * @returns A promise that resolves to an object containing the access token and a cookie-setting function.
 */
export async function getSpotifyAccessToken(
  request: NextRequest,
): Promise<{ accessToken: string | null; applyCookies: (res: NextResponse) => void }> {
  let accessToken = request.cookies.get("spotify_access_token")?.value;
  const refreshToken = request.cookies.get("spotify_refresh_token")?.value;
  const expiresAtStr = request.cookies.get("spotify_token_expires_at")?.value;

  // No-op function by default
  let applyCookies = (res: NextResponse) => {};

  if (!refreshToken) {
    // If there's no refresh token, the user is not authenticated.
    return { accessToken: null, applyCookies };
  }

  const expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : 0;
  const isExpired = Date.now() >= expiresAt - TOKEN_REFRESH_BUFFER;

  if (accessToken && !isExpired) {
    // If we have a valid, non-expired access token, use it.
    return { accessToken, applyCookies };
  }

  // If the token is expired or missing, we must refresh it.
  try {
    const spotifyService = createSpotifyService();
    const tokenData = await spotifyService.refreshAccessToken(refreshToken);

    // The new token is the one we should use now.
    accessToken = tokenData.accessToken;

    // Prepare a function to set the new cookies on the actual response
    applyCookies = (response: NextResponse) => {
      response.cookies.set("spotify_access_token", tokenData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });
      if (tokenData.refreshToken !== refreshToken) {
          response.cookies.set("spotify_refresh_token", tokenData.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
          });
      }
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
    };

    return { accessToken, applyCookies };

  } catch (error) {
    console.error("Failed to refresh Spotify token in helper:", error);
    // If refresh fails, the user is likely unauthorized.
    // We'll also define a function to clear the invalid cookies.
    applyCookies = (response: NextResponse) => {
        response.cookies.delete('spotify_access_token');
        response.cookies.delete('spotify_refresh_token');
        response.cookies.delete('spotify_token_expires_at');
    }
    return { accessToken: null, applyCookies };
  }
}
