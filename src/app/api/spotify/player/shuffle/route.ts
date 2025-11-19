
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify-auth-server";

export async function PUT(request: NextRequest) {
  try {
    const { accessToken } = await getSpotifyAccessToken(request);
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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
       const errorText = await apiResponse.text();
       let error = { message: errorText };
       try {
         error = JSON.parse(errorText);
       } catch (e) {
         // Not a JSON response
       }
       return NextResponse.json({ error: "Failed to set shuffle", details: error }, { status: apiResponse.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
