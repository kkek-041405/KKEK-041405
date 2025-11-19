
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

const TRACKS_API_ENDPOINT = "https://api.spotify.com/v1/me/tracks";

/**
 * GET handler for fetching all of the current user's saved ("liked") tracks.
 * This route handles pagination automatically.
 */
export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getSpotifyAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    let allTracks: any[] = [];
    let nextUrl: string | null = `${TRACKS_API_ENDPOINT}?limit=50`;

    while (nextUrl) {
      const apiResponse = await fetch(nextUrl, {
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
      allTracks = allTracks.concat(data.items);
      nextUrl = data.next; // Get the URL for the next page of results
    }

    // The final response contains all tracks from all pages
    return NextResponse.json({ items: allTracks });

  } catch (error) {
    console.error("Error fetching liked songs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" + error },
      { status: 500 }
    );
  }
}
