
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getSpotifyAccessToken(request);

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const apiResponse = await fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      let error = { message: errorText };
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        // Not a JSON response
      }
      return NextResponse.json(
        { error: "Failed to fetch devices", details: error },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch devices", details: error },
      { status: 500 }
    );
  }
}
