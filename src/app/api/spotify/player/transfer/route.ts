
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

export async function PUT(request: NextRequest) {
  try {
    const { accessToken } = await getSpotifyAccessToken(request);
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { device_id } = body;

    if (!device_id) {
      return NextResponse.json({ error: "device_id is required" }, { status: 400 });
    }

    const apiResponse = await fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ device_ids: [device_id], play: true }),
    });

    if (!apiResponse.ok) {
       const error = await apiResponse.text();
       return NextResponse.json({ error: "Failed to transfer playback", details: error }, { status: apiResponse.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
