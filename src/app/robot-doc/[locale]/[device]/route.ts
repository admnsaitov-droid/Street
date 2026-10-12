import { NextRequest } from 'next/server'
import { CONTENT_REVALIDATE } from '@/config/cache'
import { ROBOT_FETCH_HEADER, inlineStylesheets, stripScripts } from '@/utils/robotDocument'

/**
 * Serves the robot form of the home page as a document **without scripts**
 * (ADR-0121). The middleware rewrites a bot's `/[locale]` request here; this
 * fetches the at-rest render from `/[locale]/robot-view/[device]` and strips
 * every script but JSON-LD. Robots read the same content and layout; they
 * don't download, parse or hydrate the client runtime.
 *
 * The response is CDN-cacheable for as long as the content cache
 * (`CONTENT_REVALIDATE`), so a robot's request is a cache hit, not a render.
 */
export const dynamic = 'force-dynamic'

const FETCH_TIMEOUT_MS = 8000

/**
 * Where this server can reach itself. Behind Vercel the request's own origin
 * is the deployment; behind Hostinger's proxy it is not reachable from the
 * server (the self-fetch failed and every robot got a 500), so fall back to the
 * local port and then the public base URL — the same route the Strapi proxy
 * self-calls already take there.
 */
const candidateOrigins = (request: NextRequest) =>
    Array.from(
        new Set(
            [
                request.nextUrl.origin,
                `http://127.0.0.1:${process.env.PORT || 3000}`,
                process.env.NEXT_PUBLIC_BASEURL,
                process.env.NEXT_PUBLIC_BASE_URL,
            ].filter((o): o is string => Boolean(o))
        )
    )

export async function GET(
    request: NextRequest,
    { params }: { params: { locale: string; device: string } }
) {
    const device = params.device === 'phone' ? 'phone' : 'desktop'
    const path = `/${params.locale}/robot-view/${device}`
    const errors: string[] = []

    for (const origin of candidateOrigins(request)) {
        try {
            const res = await fetch(new URL(path, origin), {
                headers: { [ROBOT_FETCH_HEADER]: '1', 'user-agent': request.headers.get('user-agent') ?? '' },
                cache: 'no-store',
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            })
            if (!res.ok) {
                errors.push(`${new URL(origin).host}: ${res.status}`)
                continue
            }
            const html = await inlineStylesheets(stripScripts(await res.text()), origin)
            return new Response(html, {
                headers: {
                    'content-type': 'text/html; charset=utf-8',
                    'cache-control': `public, max-age=0, s-maxage=${CONTENT_REVALIDATE}, stale-while-revalidate=86400`,
                    'x-robot-origin': new URL(origin).host,
                },
            })
        } catch (error) {
            errors.push(`${new URL(origin).host}: ${error instanceof Error ? error.name : 'error'}`)
        }
    }

    // Never a 500 for a robot: the at-rest page with its scripts is still the
    // right content (the middleware lets bots through to it).
    console.error('[robot-doc] self-fetch failed:', errors.join('; '))
    return new Response(null, {
        status: 307,
        headers: { location: path, 'cache-control': 'no-store', 'x-robot-doc-error': errors.join('; ').slice(0, 300) },
    })
}
