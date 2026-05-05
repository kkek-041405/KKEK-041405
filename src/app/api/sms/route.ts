import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(req: NextRequest) {
  if (!convexUrl) {
    console.error('[sms route] NEXT_PUBLIC_CONVEX_URL not set.');
    return NextResponse.json({ error: 'Convex URL not configured on server.' }, { status: 500 });
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Expected application/json body' }, { status: 400 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (error: any) {
    return NextResponse.json({ error: 'Invalid JSON body', detail: error?.message ?? String(error) }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Request body must be a JSON object' }, { status: 400 });
  }

  const smsPayload = {
    deviceId: typeof body.deviceId === 'string' ? body.deviceId : undefined,
    messageId: typeof body.messageId === 'string' ? body.messageId : undefined,
    threadId: typeof body.threadId === 'string' ? body.threadId : undefined,
    address: typeof body.address === 'string' ? body.address : undefined,
    body: typeof body.body === 'string' ? body.body : undefined,
    type: typeof body.type === 'string' ? body.type : undefined,
    direction: typeof body.direction === 'string' ? body.direction : undefined,
    dateMillis: typeof body.dateMillis === 'number' ? body.dateMillis : undefined,
    readAt: typeof body.readAt === 'number' ? body.readAt : undefined,
    payload: JSON.stringify(body),
  };

  if (!smsPayload.address && !smsPayload.messageId && !smsPayload.body) {
    return NextResponse.json({ error: 'Request must include at least one of address, messageId, or body' }, { status: 400 });
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);
    const saveFn =
      (api.mutations as any).saveSms?.default ??
      api.mutations.saveSms ??
      "saveSms";
    const result = await convex.mutation(saveFn, smsPayload);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[sms route] Error saving SMS:', error?.message ?? error, error);
    return NextResponse.json({ error: 'Failed to save SMS', detail: error?.message ?? String(error) }, { status: 500 });
  }
}
