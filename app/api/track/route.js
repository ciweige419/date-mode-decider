import { NextResponse } from 'next/server';

const ALLOWED_EVENTS = new Set(['page_view', 'start_click', 'result_view']);

export async function POST(request) {
  try {
    const body = await request.json();
    const event = body?.event;

    if (!ALLOWED_EVENTS.has(event)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    console.info('[track]', {
      event,
      ts: body?.ts || Date.now(),
      path: body?.path || '/',
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
