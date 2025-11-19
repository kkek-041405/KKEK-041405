
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

const PLAYER_API_ENDPOINT = "https://api.spotify.com/v1/me/player";

export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getSpotifyAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const apiResponse = await fetch(PLAYER_API_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (apiResponse.status === 204) {
      // Nothing is playing
      return NextResponse.json(null);
    }

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      let error = { message: errorText };
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        // Not a JSON response
      }
      return NextResponse.json(
        { error: "Failed to fetch player state", details: error },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error fetching player state:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
