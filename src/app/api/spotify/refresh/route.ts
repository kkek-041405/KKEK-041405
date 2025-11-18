/**
 * Spotify Token Refresh API Route
 *
 * POST /api/spotify/refresh
 * Refreshes the Spotify access token using the stored refresh token
 *
 * @module api/spotify/refresh
 */

import { NextRequest, NextResponse } from "next/server";
import { createSpotifyService } from "@/services/spotify-service";

/**
 * POST handler - Refreshes Spotify access token
 *
 * @param request - Next.js request object
 * @returns JSON response with new token data or error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get("spotify_refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          error: "No refresh token available",
          message: "Please authenticate with Spotify first",
        },
        { status: 401 }
      );
    }

    // Refresh the access token
    const spotifyService = createSpotifyService();
    const tokenData = await spotifyService.refreshAccessToken(refreshToken);

    // Create response with updated token data
    const response = NextResponse.json({
      success: true,
      expiresAt: tokenData.expiresAt,
      expiresIn: Math.floor((tokenData.expiresAt - Date.now()) / 1000),
    });

    // Update tokens in cookies
    response.cookies.set("spotify_access_token", tokenData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    // Update refresh token if a new one was provided
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

    return response;
  } catch (error) {
    console.error("Error refreshing Spotify token:", error);

    return NextResponse.json(
      {
        error: "Failed to refresh token",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Check token status and refresh if needed
 *
 * @param request - Next.js request object
 * @returns JSON response with token status
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accessToken = request.cookies.get("spotify_access_token")?.value;
    const expiresAtStr = request.cookies.get("spotify_token_expires_at")?.value;

    if (!accessToken || !expiresAtStr) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "No active session",
        },
        { status: 401 }
      );
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    const isExpired = Date.now() >= expiresAt - 5 * 60 * 1000; // 5 minute buffer

    if (isExpired) {
      // Token is expired or about to expire, trigger refresh
      return POST(request);
    }

    return NextResponse.json({
      authenticated: true,
      expiresAt,
      expiresIn: Math.floor((expiresAt - Date.now()) / 1000),
    });
  } catch (error) {
    console.error("Error checking token status:", error);

    return NextResponse.json(
      {
        error: "Failed to check token status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
