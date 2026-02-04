
import { NextResponse, type NextRequest } from 'next/server';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
    }
    
    const linkRef = doc(db, 'sharedNoteLinks', token);
    
    // Atomically increment the view count. This "uses" the link.
    // The getNoteFromShareToken function will then correctly assess if the link is used up on subsequent loads.
    await updateDoc(linkRef, {
        viewCount: increment(1),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error consuming share token:', error);
    // Log server error, but don't fail the client's flow.
    return NextResponse.json({ success: false, message: 'Failed to update token on server.' }, { status: 500 });
  }
}
