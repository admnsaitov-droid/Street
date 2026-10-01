/**
 * Content cache settings shared by every server-side Strapi read: the
 * `/api/get-*` proxy routes (via `fetchStrapi`), page-level `getStrapiData`
 * calls and the sitemap. One TTL and one tag, so a single
 * `revalidateTag(CONTENT_CACHE_TAG)` from `/api/revalidate` refreshes all of
 * them at once (ADR-0117).
 */

/** Seconds a cached Strapi response may be served before a background refresh. */
export const CONTENT_REVALIDATE = 300;

/** Cache tag on every Strapi-derived fetch. */
export const CONTENT_CACHE_TAG = 'strapi';
