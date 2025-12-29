import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { sleep } from "../../../../utils/sleep";

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

async function handler(request: NextRequest) {
  const key = request.headers.get("X-REVALIDATE-KEY");

  if (key !== process.env.REVALIDATE_KEY) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  await fetch(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/address-calendar`);
  revalidatePath("/address-calendar");
  await sleep(1000);
  await fetch(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/address-calendar`);

  return NextResponse.json({ revalidated: true });
}
