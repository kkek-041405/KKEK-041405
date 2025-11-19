
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth";

export async function PUT(request: NextRequest) {
  let response: NextResponse;
  try {
    const { accessToken, applyCookies } = await getSpotifyAccessToken(request);
    if (!accessToken) {
      response = NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      applyCookies(response);
      return response;
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


    const apiResponse = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
       const error = await apiResponse.text();
       response = NextResponse.json({ error: "Failed to set volume", details: error }, { status: apiResponse.status });
       applyCookies(response);
       return response;
    }

    response = new NextResponse(null, { status: 204 });
    applyCookies(response);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
