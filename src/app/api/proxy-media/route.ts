import { NextRequest, NextResponse } from 'next/server';

// Hosts this proxy is allowed to fetch from. An open proxy here is an SSRF
// hole: anyone could make this server fetch arbitrary internal URLs.
const ALLOWED_HOSTS = new Set(
  [
    process.env.NEXT_PUBLIC_IMAGE_URL,
    process.env.API_URL,
    'http://153.92.1.45:1337',
    'https://admin.streetbarbell.com',
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => {
      try {
        return new URL(value).host;
      } catch {
        return '';
      }
    })
    .filter(Boolean),
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get('url');

    if (!mediaUrl) {
      return new NextResponse('Missing URL parameter', { status: 400 });
    }

    let target: URL;
    try {
      target = new URL(mediaUrl);
    } catch {
      return new NextResponse('Invalid URL parameter', { status: 400 });
    }

    if (!ALLOWED_HOSTS.has(target.host)) {
      return new NextResponse('Host not allowed', { status: 403 });
    }

    // Forward Range so videos can start playing before the whole file has
    // downloaded and the player can seek (Strapi answers with 206).
    const range = request.headers.get('range');
    const response = await fetch(target, {
      headers: range ? { Range: range } : undefined,
    });

    if (!response.ok && response.status !== 206) {
      return new NextResponse('Media not found', { status: 404 });
    }

    // Stream the upstream body through instead of buffering it: the old
    // arrayBuffer() version held entire videos (50MB+) in memory per request
    // and only started responding after the last upstream byte arrived.
    // One day, not `immutable`: Strapi's "Replace media" keeps the same URL,
    // so a long immutable cache would pin the old file (ADR-0118).
    const headers = new Headers({
      'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      'Cache-Control': 'public, max-age=86400',
    });
    for (const name of ['content-length', 'content-range', 'accept-ranges']) {
      const value = response.headers.get(name);
      if (value) headers.set(name, value);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Media proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
