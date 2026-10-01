import { CONTENT_CACHE_TAG, CONTENT_REVALIDATE } from '@/config/cache';

/**
 * The one way the `/api/get-*` proxy routes talk to Strapi. Server-only:
 * import it from route handlers under `src/app/api`, never from a component.
 *
 * Before this, every route called Strapi with axios, which bypasses Next's
 * data cache — so every page view and every Header/Footer/menu fetch from the
 * browser went all the way to Strapi. Going through `fetch` with `revalidate`
 * lets Next serve repeat requests from its data cache and refresh them in the
 * background.
 *
 * Freshness: entries refresh at most every CONTENT_REVALIDATE seconds, and a
 * Strapi publish webhook hitting `/api/revalidate` purges CONTENT_CACHE_TAG
 * immediately (ADR-0117). Only 200 responses are cached, so a Strapi error
 * is never stuck in the cache.
 */

export class StrapiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** GET `${API_URL}${path}` through the Next data cache; resolves to parsed JSON. */
export async function fetchStrapi<T = unknown>(path: string): Promise<T> {
  const response = await fetch(`${process.env.API_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
    next: { revalidate: CONTENT_REVALIDATE, tags: [CONTENT_CACHE_TAG] },
  });

  if (!response.ok) {
    throw new StrapiError(`Strapi ${path} -> ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}
