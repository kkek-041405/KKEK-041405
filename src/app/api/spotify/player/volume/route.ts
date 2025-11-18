
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth";

export async function PUT(request: NextRequest) {
  try {
    const accessToken = await getSpotifyAccessToken(request);
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const volume_percent = searchParams.get("volume_percent");

    if (volume_percent === null) {
      return NextResponse.json({ error: "volume_percent is required" }, { status: 400 });
    }
    const volume = parseInt(volume_percent, 10);
     if (isNaN(volume) || volume < 0 || volume > 100) {
      return NextResponse.json({ error: "volume_percent must be between 0 and 100" }, { status: 400 });
    }


    const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
       const error = await response.text();
       return NextResponse.json({ error: "Failed to set volume", details: error }, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
