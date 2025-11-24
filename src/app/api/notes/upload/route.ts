import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This route receives a multipart/form-data file upload and forwards to Convex
// via a client-side Convex mutation call, but since Convex client is not
// available in route handlers, we will accept the file and store as bytes in
// a Convex mutation via a serverless function (or use Convex HTTP client here).

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
// Use deployment from env var
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
const convex = new ConvexHttpClient(convexUrl || 'https://example.convex.cloud');

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
  
    return NextResponse.json({ error: 'Only multipart/form-data supported' }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'File not provided' }, { status: 400 });
  }

  // Generate a short-lived upload URL from Convex, POST the file directly there,
  // then call saveDocument with the returned storageId to persist metadata.
  try {
    const genFn = (api as any).mutations.generateUploadUrl?.default ?? api.mutations.generateUploadUrl;
    const uploadUrl = await convex.mutation(genFn);

    // POST the file bytes to the uploadUrl returned by Convex
    const uploadResp = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!uploadResp.ok) {
      console.error('Upload to Convex storage failed', uploadResp.statusText);
      return NextResponse.json({ error: 'Failed to post file to Convex storage' }, { status: 500 });
    }

    const json = await uploadResp.json();
    const storageId = json?.storageId || json?.id || json?._id;
    if (!storageId) {
      console.error('Convex upload response missing storageId', json);
      return NextResponse.json({ error: 'Invalid Convex upload response' }, { status: 500 });
    }

    // Persist metadata in Convex DB (documents table) using saveDocument mutation
    const saveFn = (api as any).mutations.saveDocument?.default ?? api.mutations.saveDocument;
    const result = await convex.mutation(saveFn, {
      storageId,
      fileName: file.name,
      fileType: file.type,
      fileSize: Number(file.size),
    });

    return NextResponse.json(result || null);
  } catch (error) {
    console.error('Error uploading to Convex flow:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
