
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth";

export async function POST(request: NextRequest) {
  let response: NextResponse;
  try {
    const { accessToken, applyCookies } = await getSpotifyAccessToken(request);
    if (!accessToken) {
      response = NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      applyCookies(response);
      return response;
    }

    const apiResponse = await fetch("https://api.spotify.com/v1/me/player/previous", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
       const error = await apiResponse.text();
       response = NextResponse.json({ error: "Failed to skip to previous track", details: error }, { status: apiResponse.status });
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
