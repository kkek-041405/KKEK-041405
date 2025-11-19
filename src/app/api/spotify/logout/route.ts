
/**
 * Spotify Logout API Route
 *
 * POST /api/spotify/logout
 * Clears the Spotify authentication tokens from Firestore.
 *
 * @module api/spotify/logout
 */

import { NextResponse } from 'next/server';
import { deleteTokensFromFirestore } from '@/services/spotify-token-service';

/**
 * POST handler - Clears Spotify tokens from Firestore.
 *
 * @returns A JSON response indicating successful logout.
 */
export async function POST(): Promise<NextResponse> {
  try {
    await deleteTokensFromFirestore();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during Spotify logout:', error);
    return NextResponse.json(
      { error: 'Logout failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
