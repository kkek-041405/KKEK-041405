
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

export async function PUT(request: NextRequest) {
  let response: NextResponse;
  try {
    const { accessToken, applyCookies } = await getSpotifyAccessToken(request);
    if (!accessToken) {
      response = NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      applyCookies(response);
      return response;
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
        const error = await apiResponse.text();
        response = NextResponse.json({ error: "Failed to start playback", details: error }, { status: apiResponse.status });
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
