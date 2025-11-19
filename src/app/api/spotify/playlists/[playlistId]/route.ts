
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
  let response: NextResponse;
  try {
    const playlistId = params.playlistId;
    if (!playlistId) {
      return NextResponse.json({ error: "Playlist ID is required" }, { status: 400 });
    }

    const { accessToken, applyCookies } = await getSpotifyAccessToken(request);

    if (!accessToken) {
      response = NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      applyCookies(response);
      return response;
    }

    const apiResponse = await fetch(`${PLAYLIST_API_ENDPOINT}${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.json();
      response = NextResponse.json(
        { error: `Failed to fetch playlist ${playlistId}`, details: error },
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
    console.error("Error fetching playlist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
