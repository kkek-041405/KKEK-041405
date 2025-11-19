
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
    const position_ms = searchParams.get("position_ms");

    if (!position_ms) {
      return NextResponse.json({ error: "position_ms is required" }, { status: 400 });
    }

    const apiResponse = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
       const error = await apiResponse.text();
       response = NextResponse.json({ error: "Failed to seek", details: error }, { status: apiResponse.status });
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
