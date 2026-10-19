import { NextRequest } from 'next/server'
import { ROBOT_FETCH_HEADER, inlineStylesheets, stripScripts } from '@/utils/robotDocument'

/**
 * Serves the robot form of the home page as a document **without scripts**
 * (ADR-0121). The middleware rewrites a bot's `/[locale]` request here; this
 * fetches the at-rest render from `/[locale]/robot-view/[device]` and strips
 * every script but JSON-LD. Robots read the same content and layout; they
 * don't download, parse or hydrate the client runtime.
 *
 * The finished document is kept in memory for an hour and refreshed in the
 * background after that, so a robot never waits for a render: PageSpeed lands
 * on cold CDN edges (Hostinger's answers DYNAMIC), and a render plus the
 * self-fetch cost it 2–3 s of Speed Index.
 *
 * The response must NEVER be shared-cacheable. It answers the same URL as the
 * people's home page (`/en`, via a middleware rewrite), and Hostinger's CDN
 * keys on the URL alone — with `s-maxage` it stored the robot form and served
 * it to visitors: no scripts, so no hero text, logo or images until a scroll
 * (2026-10-19, ADR-0122). `private, no-store` + `Vary: User-Agent`.
 */
export const dynamic = 'force-dynamic'

const FETCH_TIMEOUT_MS = 8000
/** The local port either answers at once or not at all. */
const LOCAL_TIMEOUT_MS = 1500
/** Robots may read a document up to an hour old; content changes are rare. */
const ROBOT_CACHE_SECONDS = 3600

interface CachedDocument {
    html: string
    origin: string
    at: number
}

/** Per process: `/en/robot-view/phone` → its finished document. */
const documents = new Map<string, CachedDocument>()
/** Background refreshes in flight, so a burst of robots renders once. */
const refreshing = new Map<string, Promise<CachedDocument>>()

/**
 * The origin that answered last time, tried first. On Hostinger the request
 * origin (`0.0.0.0:3000`) and the local port don't answer; each miss used to
 * retry both (~1 s each).
 */
let workingOrigin: string | null = null

/**
 * Where this server can reach itself. Behind Vercel the request's own origin
 * is the deployment. Behind Hostinger's proxy it is `0.0.0.0` and the local
 * port refuses too, so the public base URL — the route the Strapi proxy
 * self-calls already take there — comes before the local port.
 */
const candidateOrigins = (request: NextRequest) => {
    const own = request.nextUrl.hostname === '0.0.0.0' ? null : request.nextUrl.origin
    return Array.from(
        new Set(
            [
                workingOrigin,
                own,
                process.env.NEXT_PUBLIC_BASEURL,
                process.env.NEXT_PUBLIC_BASE_URL,
                `http://127.0.0.1:${process.env.PORT || 3000}`,
            ].filter((o): o is string => Boolean(o))
        )
    )
}

const render = async (path: string, request: NextRequest, timings: string[]): Promise<CachedDocument> => {
    const errors: string[] = []
    const origins = candidateOrigins(request)
    for (let i = 0; i < origins.length; i++) {
        const origin = origins[i]
        const host = new URL(origin).host
        const started = Date.now()
        const timeout = origin.includes('127.0.0.1') ? LOCAL_TIMEOUT_MS : FETCH_TIMEOUT_MS
        try {
            const res = await fetch(new URL(path, origin), {
                headers: { [ROBOT_FETCH_HEADER]: '1', 'user-agent': request.headers.get('user-agent') ?? '' },
                cache: 'no-store',
                signal: AbortSignal.timeout(timeout),
            })
            if (!res.ok) {
                errors.push(`${host}: ${res.status}`)
                timings.push(`try${i};dur=${Date.now() - started};desc="${host} ${res.status}"`)
                continue
            }
            workingOrigin = origin
            const html = await inlineStylesheets(stripScripts(await res.text()), origin)
            timings.push(`try${i};dur=${Date.now() - started};desc="${host} ok"`)
            return { html, origin: host, at: Date.now() }
        } catch (error) {
            if (origin === workingOrigin) workingOrigin = null
            const name = error instanceof Error ? error.name : 'error'
            errors.push(`${host}: ${name}`)
            timings.push(`try${i};dur=${Date.now() - started};desc="${host} ${name}"`)
        }
    }
    throw new Error(errors.join('; '))
}

/** One render per path at a time; the result replaces the cached document. */
const refresh = (path: string, request: NextRequest, timings: string[]) => {
    let pending = refreshing.get(path)
    if (!pending) {
        pending = render(path, request, timings)
            .then((doc) => {
                documents.set(path, doc)
                return doc
            })
            .finally(() => refreshing.delete(path))
        refreshing.set(path, pending)
    }
    return pending
}

const respond = (doc: CachedDocument, cache: string, timings: string[]) =>
    new Response(doc.html, {
        headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'private, no-store, max-age=0',
            vary: 'User-Agent',
            'x-robot-origin': doc.origin,
            'x-robot-cache': cache,
            ...(timings.length ? { 'server-timing': timings.join(', ') } : {}),
        },
    })

export async function GET(
    request: NextRequest,
    { params }: { params: { locale: string; device: string } }
) {
    const device = params.device === 'phone' ? 'phone' : 'desktop'
    const path = `/${params.locale}/robot-view/${device}`
    const timings: string[] = []

    const cached = documents.get(path)
    if (cached) {
        // Stale after an hour: serve it now, re-render behind the response.
        if (Date.now() - cached.at > ROBOT_CACHE_SECONDS * 1000) {
            refresh(path, request, []).catch((error) => console.error('[robot-doc] refresh failed:', error))
            return respond(cached, 'stale', timings)
        }
        return respond(cached, 'hit', timings)
    }

    try {
        return respond(await refresh(path, request, timings), 'miss', timings)
    } catch (error) {
        // Never a 500 for a robot: the at-rest page with its scripts is still
        // the right content (the middleware lets bots through to it).
        const message = error instanceof Error ? error.message : String(error)
        console.error('[robot-doc] self-fetch failed:', message)
        return new Response(null, {
            status: 307,
            headers: { location: path, 'cache-control': 'no-store', 'x-robot-doc-error': message.slice(0, 300) },
        })
    }
}
