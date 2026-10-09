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

export async function GET(
    request: NextRequest,
    { params }: { params: { locale: string; device: string } }
) {
    const device = params.device === 'phone' ? 'phone' : 'desktop'
    const source = new URL(`/${params.locale}/robot-view/${device}`, request.nextUrl.origin)

    const res = await fetch(source, {
        headers: { [ROBOT_FETCH_HEADER]: '1', 'user-agent': request.headers.get('user-agent') ?? '' },
        cache: 'no-store',
    })
    if (!res.ok) return new Response(null, { status: res.status })

    const html = await inlineStylesheets(stripScripts(await res.text()), request.nextUrl.origin)
    return new Response(html, {
        headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': `public, max-age=0, s-maxage=${CONTENT_REVALIDATE}, stale-while-revalidate=86400`,
        },
    })
}
