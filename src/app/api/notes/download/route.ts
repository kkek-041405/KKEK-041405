
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ConvexHttpClient } from 'convex/server';
import { api } from '../../../../../convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
if (!convexUrl) {
  console.error('[download route] CONVEX_URL not set. Set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL to your Convex deployment URL.');
}
const convex = new ConvexHttpClient(convexUrl || 'https://example.convex.cloud');

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const storageId = url.searchParams.get('storageId');
  if (!storageId) {
    return NextResponse.json({ error: 'storageId is required' }, { status: 400 });
  }

  try {
    if (!convexUrl) {
      return NextResponse.json({ error: 'Convex URL not configured on server. Set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL.' }, { status: 500 });
    }
    console.log('[download route] resolving storageId', { storageId, convexUrl });
    const getDocFn = (api as any).queries?.getDocument?.default ?? api.queries.getDocument;
    const result = await convex.query(getDocFn, { storageId });
    console.log('[download route] convex.query result', { storageId, result });
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // If Convex returned a direct serving URL, redirect the client there (fast)
    const { url, fileType, fileName, fileSize } = result as any;
    if (url) {
      // Redirecting here keeps the app server from proxying bytes and lets Convex serve the file.
      return NextResponse.redirect(url);
    }

    // If there's no URL (e.g., storage missing), return not found
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  } catch (err: any) {
    console.error('[download route] Error fetching file from Convex:', err?.message ?? err, err);
    // Return the error details in dev to help debugging (safe in dev). In prod you may want
    // to hide internal details and just return a generic error.
    return NextResponse.json({ error: 'Failed to fetch file', detail: err?.message ?? String(err) }, { status: 500 });
  }
}
