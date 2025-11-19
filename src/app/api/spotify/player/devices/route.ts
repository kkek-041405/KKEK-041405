
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth";

export async function GET(request: NextRequest) {
  let response: NextResponse;
  try {
    console.log("GET /api/spotify/devices");
    const { accessToken, applyCookies } = await getSpotifyAccessToken(request);

    if (!accessToken) {
      response = NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      applyCookies(response);
      return response;
    }

    const apiResponse = await fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Response:", apiResponse)

    if (!apiResponse.ok) {
      const error = await apiResponse.json();
      response = NextResponse.json(
        { error: "Failed to fetch devices", details: error },
        { status: apiResponse.status }
      );
      applyCookies(response);
      return response;
    }

    const data = await apiResponse.json();
    response = NextResponse.json(data);
    applyCookies(response);
    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
