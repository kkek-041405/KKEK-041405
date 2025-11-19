
// This file is no longer used for the primary refresh flow,
// as token management is now handled directly in the `useSpotify` hook
// and through direct Firestore interactions.
// It is kept for potential future use or for other server-side scenarios.

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    return NextResponse.json({ message: "This endpoint is not actively used. Token refresh is handled via the useSpotify hook." }, { status: 404 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    return NextResponse.json({ message: "This endpoint is not actively used. Token refresh is handled via the useSpotify hook." }, { status: 404 });
}
