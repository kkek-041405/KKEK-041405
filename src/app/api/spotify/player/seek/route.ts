
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth";

export async function PUT(request: NextRequest) {
  try {
    const accessToken = await getSpotifyAccessToken(request);
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const position_ms = searchParams.get("position_ms");

    if (!position_ms) {
      return NextResponse.json({ error: "position_ms is required" }, { status: 400 });
    }

    const response = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
       const error = await response.text();
       return NextResponse.json({ error: "Failed to seek", details: error }, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
