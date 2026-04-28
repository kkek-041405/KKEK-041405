
import { NextResponse, type NextRequest } from 'next/server';
import { rtdb } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';

const PROXY_IP_PATH = 'proxy/ip';

/**
 * GET handler for fetching the proxy IP.
 */
export async function GET(request: NextRequest) {
  try {
    const proxyIpRef = ref(rtdb, PROXY_IP_PATH);
    const snapshot = await get(proxyIpRef);

    if (snapshot.exists()) {
      const proxyIp = snapshot.val();
      return NextResponse.json({ proxy_ip: proxyIp });
    } else {
      return NextResponse.json({ proxy_ip: null }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching proxy IP from Realtime Database:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST handler for updating the proxy IP.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proxy_ip } = body;

    if (!proxy_ip || typeof proxy_ip !== 'string') {
      return NextResponse.json({ error: 'proxy_ip is required and must be a string.' }, { status: 400 });
    }

    const proxyIpRef = ref(rtdb, PROXY_IP_PATH);
    await set(proxyIpRef, proxy_ip);

    return NextResponse.json({ success: true, message: 'Proxy IP updated successfully.' });
  } catch (error) {
    console.error("Error updating proxy IP in Realtime Database:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
