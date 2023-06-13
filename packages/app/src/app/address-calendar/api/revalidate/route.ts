import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  handler(request);
}

export async function POST(request: Request) {
  handler(request);
}

async function handler(request: Request) {
  const key = request.headers.get('X-REVALIDATE-KEY');

  if (key !== process.env.REVALIDATE_KEY) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  revalidatePath('/address-calendar');
  return NextResponse.json({ revalidated: true });
}
