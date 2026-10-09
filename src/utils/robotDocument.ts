/**
 * Shared by the middleware and `/robot-doc` (ADR-0121): the robot form of the
 * home page, served as a document without scripts.
 */

/** Marks the internal fetch of the at-rest render, so the middleware lets it through. */
export const ROBOT_FETCH_HEADER = 'x-robot-fetch'

const SCRIPT = /<script\b([^>]*)>[\s\S]*?<\/script>/gi
const SCRIPT_PRELOAD = /<link\b[^>]*\b(?:rel="modulepreload"|as="script")[^>]*>/gi

/** Every `<script>` (and script preload) goes, except JSON-LD. */
export const stripScripts = (html: string) =>
    html
        .replace(SCRIPT, (tag, attrs: string) => (/type="application\/ld\+json"/i.test(attrs) ? tag : ''))
        .replace(SCRIPT_PRELOAD, '')

/** A phone user agent gets the phone layout of the robot form. */
export const robotDevice = (ua: string | null | undefined): 'phone' | 'desktop' =>
    /mobile|android|iphone/i.test(ua ?? '') ? 'phone' : 'desktop'

const STYLESHEET = /<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>/gi

/**
 * The page's own stylesheets, inlined. On a document with no scripts they are
 * the only render-blocking requests left, and they are small (a few KB).
 */
export const inlineStylesheets = async (html: string, origin: string) => {
    const links = Array.from(html.matchAll(STYLESHEET))
    const css = await Promise.all(
        links.map(async ([, href]) => {
            try {
                const res = await fetch(new URL(href, origin))
                return res.ok ? await res.text() : null
            } catch {
                return null
            }
        })
    )
    return links.reduce(
        (out, [tag], i) => (css[i] === null ? out : out.replace(tag, `<style>${css[i]}</style>`)),
        html
    )
}
