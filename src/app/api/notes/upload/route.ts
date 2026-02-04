
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(req: NextRequest) {
  if (!convexUrl) {
    console.error('[upload route] CONVEX_URL not set. Set NEXT_PUBLIC_CONVEX_URL in your environment variables.');
    return NextResponse.json({ error: 'Convex URL not configured on server.' }, { status: 500 });
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Only multipart/form-data supported' }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'File not provided' }, { status: 400 });
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);
    const genFn = (api.mutations as any).generateUploadUrl?.default ?? api.mutations.generateUploadUrl;
    const uploadUrl = await convex.mutation(genFn);

    const uploadResp = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!uploadResp.ok) {
      console.error('Upload to Convex storage failed', uploadResp.status, await uploadResp.text());
      return NextResponse.json({ error: 'Failed to post file to Convex storage' }, { status: 500 });
    }

    const json = await uploadResp.json();
    const storageId = json?.storageId;
    if (!storageId) {
      console.error('Convex upload response missing storageId', json);
      return NextResponse.json({ error: 'Invalid Convex upload response' }, { status: 500 });
    }

    const saveFn = (api.mutations as any).saveDocument?.default ?? api.mutations.saveDocument;
    const result = await convex.mutation(saveFn, {
      storageId,
      fileName: file.name,
      fileType: file.type,
      fileSize: Number(file.size),
    });

    return NextResponse.json(result || null);
  } catch (error: any) {
    console.error('Error in Convex upload flow:', error?.message ?? error);
    return NextResponse.json({ error: 'Failed to upload file', detail: error?.message ?? String(error) }, { status: 500 });
  }
}
