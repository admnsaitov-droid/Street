import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { timingSafeEqual } from 'crypto';
import { CONTENT_CACHE_TAG } from '@/config/cache';

/**
 * On-demand cache purge for Strapi content (ADR-0117).
 *
 * Strapi → Settings → Webhooks → POST https://www.streetbarbell.com/api/revalidate
 * with header `x-revalidate-secret: <REVALIDATE_SECRET>`, on entry
 * publish/unpublish/update/delete and media events. Every Strapi-derived
 * fetch carries CONTENT_CACHE_TAG, so one call refreshes pages, the
 * `/api/get-*` routes and the sitemap. Without the webhook, content still
 * refreshes within CONTENT_REVALIDATE seconds.
 *
 * The secret travels in a header, not the query string, so it never lands in
 * access logs. Unset secret → the endpoint is disabled.
 */

export const dynamic = 'force-dynamic';

function secretMatches(given: string | null, expected: string): boolean {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json({ error: 'Revalidation is not configured' }, { status: 503 });
  }

  if (!secretMatches(request.headers.get('x-revalidate-secret'), expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidateTag(CONTENT_CACHE_TAG);
  return NextResponse.json({ data: { revalidated: true, tag: CONTENT_CACHE_TAG } });
}
