
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

const TRACKS_API_ENDPOINT = "https://api.spotify.com/v1/me/tracks";

/**
 * GET handler for fetching the current user's saved ("liked") tracks.
 */
export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getSpotifyAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || '50'; // Liked songs can be many, default to 50
    const offset = searchParams.get("offset") || '0';

    const apiResponse = await fetch(`${TRACKS_API_ENDPOINT}?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      let error = { message: errorText };
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        // Not a JSON response
      }
      return NextResponse.json(
        { error: "Failed to fetch liked songs", details: error },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error fetching liked songs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" + error },
      { status: 500 }
    );
  }
}
