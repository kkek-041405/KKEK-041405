
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function GET(req: NextRequest) {
  if (!convexUrl) {
    console.error('[download route] CONVEX_URL not set. Set NEXT_PUBLIC_CONVEX_URL in your environment variables.');
    return NextResponse.json({ error: 'Convex URL not configured on server.' }, { status: 500 });
  }
  
  const url = new URL(req.url);
  const storageId = url.searchParams.get('storageId');
  const desiredFilename = url.searchParams.get('filename');

  if (!storageId) {
    return NextResponse.json({ error: 'storageId is required' }, { status: 400 });
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);
    const getDocFn = (api.queries as any).getDocument?.default ?? api.queries.getDocument;
    const result = await convex.query(getDocFn, { storageId });

    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { url: fileUrl, fileType } = result as any;
    
    if (!fileUrl) {
      return NextResponse.json({ error: 'Not available' }, { status: 404 });
    }

    if (desiredFilename) {
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok || !fileResponse.body) {
        return new NextResponse('Failed to fetch file from storage', { status: 500 });
      }

      const headers = new Headers();
      // The 'filename*' part is for non-ASCII characters in filenames.
      headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(desiredFilename)}"; filename*=UTF-8''${encodeURIComponent(desiredFilename)}`);
      headers.set('Content-Type', fileType || 'application/octet-stream');
      
      return new NextResponse(fileResponse.body, { headers });

    } else {
      // Original behavior: redirect to let Convex serve the file.
      return NextResponse.redirect(fileUrl);
    }
  } catch (err: any) {
    console.error('[download route] Error fetching file from Convex:', err?.message ?? err, err);
    return NextResponse.json({ error: 'Failed to fetch file', detail: err?.message ?? String(err) }, { status: 500 });
  }
}
