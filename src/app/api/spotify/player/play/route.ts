
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

export async function PUT(request: NextRequest) {
  try {
    const { accessToken } = await getSpotifyAccessToken(request);
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let body = null;
    try {
        body = await request.json();
    } catch(e) {
        // No body provided, which is fine for just resuming playback
    }

    const apiResponse = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        let error = { message: errorText };
        try {
            error = JSON.parse(errorText);
        } catch (e) {
            // Not a JSON response
        }
        return NextResponse.json({ error: "Failed to start playback", details: error }, { status: apiResponse.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
