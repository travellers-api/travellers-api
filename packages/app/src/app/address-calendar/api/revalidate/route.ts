import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const revalidateKey = url.searchParams.get('revalidate-key');

  if (revalidateKey !== process.env.REVALIDATE_KEY) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  revalidatePath('/address-calendar');
  return NextResponse.json({ revalidated: true });
}
