
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

const PLAYLIST_API_ENDPOINT = "https://api.spotify.com/v1/playlists/";

/**
 * GET handler for fetching a specific playlist by its ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { playlistId: string } }
) {
  try {
    const playlistId = params.playlistId;
    if (!playlistId) {
      return NextResponse.json({ error: "Playlist ID is required" }, { status: 400 });
    }

    const { accessToken } = await getSpotifyAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const apiResponse = await fetch(`${PLAYLIST_API_ENDPOINT}${playlistId}`, {
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
        { error: `Failed to fetch playlist ${playlistId}`, details: error },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json(
      { error: "Error fetching playlist:" + error },
      { status: 500 }
    );
  }
}
