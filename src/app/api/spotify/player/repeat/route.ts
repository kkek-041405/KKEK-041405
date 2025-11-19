
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

export async function PUT(request: NextRequest) {
  try {
    const { accessToken } = await getSpotifyAccessToken(request);
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");

    if (!state || !['track', 'context', 'off'].includes(state)) {
      return NextResponse.json({ error: "state (track, context, or off) is required" }, { status: 400 });
    }

    const apiResponse = await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${state}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
       const error = await apiResponse.text();
       return NextResponse.json({ error: "Failed to set repeat mode", details: error }, { status: apiResponse.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
