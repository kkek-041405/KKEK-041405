
/**
 * Spotify Logout API Route
 *
 * POST /api/spotify/logout
 * Clears the Spotify authentication cookies.
 *
 * @module api/spotify/logout
 */

import { NextResponse } from 'next/server';

/**
 * POST handler - Clears Spotify authentication cookies.
 *
 * @returns A JSON response indicating successful logout.
 */
export async function POST(): Promise<NextResponse> {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear the cookies by setting their maxAge to 0
    response.cookies.set('spotify_access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    response.cookies.set('spotify_refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    response.cookies.set('spotify_token_expires_at', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during Spotify logout:', error);
    return NextResponse.json(
      { error: 'Logout failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
