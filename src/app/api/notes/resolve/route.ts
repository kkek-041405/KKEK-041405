import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
if (!convexUrl) {
  console.error('[resolve route] CONVEX_URL not set. Set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL to your Convex deployment URL.');
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
    console.log('[resolve route] resolving storageId', { storageId, convexUrl });
    const getDocFn = (api as any).queries?.getDocument?.default ?? api.queries.getDocument;
    const result = await convex.query(getDocFn, { storageId });
    console.log('[resolve route] convex.query result', { storageId, result });
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Return the Convex metadata/result directly as JSON so clients can open the
    // serving URL directly (useful for previewing in a new tab without being
    // redirected through the app server).
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[resolve route] Error resolving file from Convex:', err?.message ?? err, err);
    return NextResponse.json({ error: 'Failed to fetch file', detail: err?.message ?? String(err) }, { status: 500 });
  }
}
