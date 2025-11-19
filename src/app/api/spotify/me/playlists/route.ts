
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

const PLAYLISTS_API_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

/**
 * GET handler for fetching the current user's playlists.
 */
export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getSpotifyAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || '20';
    const offset = searchParams.get("offset") || '0';

    const apiResponse = await fetch(`${PLAYLISTS_API_ENDPOINT}?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.json();
      return NextResponse.json(
        { error: "Failed to fetch playlists", details: error },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
