
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth";

const PLAYER_API_ENDPOINT = "https://api.spotify.com/v1/me/player";

export async function GET(request: NextRequest) {
  let response: NextResponse;
  try {
    const { accessToken, applyCookies } = await getSpotifyAccessToken(request);

    if (!accessToken) {
      response = NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      applyCookies(response); // Apply cookie clearing if refresh failed
      return response;
    }

    const apiResponse = await fetch(PLAYER_API_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (apiResponse.status === 204) {
      // Nothing is playing
      response = NextResponse.json(null);
      applyCookies(response); // Apply new cookies if refreshed
      return response;
    }

    if (!apiResponse.ok) {
      const error = await apiResponse.json();
      response = NextResponse.json(
        { error: "Failed to fetch player state", details: error },
        { status: apiResponse.status }
      );
      applyCookies(response);
      return response;
    }

    const data = await apiResponse.json();
    response = NextResponse.json(data);
    applyCookies(response);
    return response;

  } catch (error) {
    console.error("Error fetching player state:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
