
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

    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");

    if (state === null || (state !== 'true' && state !== 'false')) {
      return NextResponse.json({ error: "state (true/false) is required" }, { status: 400 });
    }

    const apiResponse = await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
       const error = await apiResponse.text();
       response = NextResponse.json({ error: "Failed to set shuffle", details: error }, { status: apiResponse.status });
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
