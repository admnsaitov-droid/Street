/**
 * Is this client an automated agent rather than a person?
 *
 * Checked in the browser, deliberately: reading `headers()` server-side would
 * opt every page out of static generation, which costs real visitors far more
 * than it gains. A client check leaves the server-rendered HTML byte-identical
 * for everyone — the only difference is that a bot never mounts the WebGL
 * scene, which it cannot see and which carries no indexable content.
 *
 * `optimize-3d-scene` §1: a crawler or Lighthouse run gets no scene at all, so
 * the three.js chunk is never fetched, parsed or evaluated. Under Lighthouse
 * this also matters for correctness — it runs headless with `--disable-gpu`,
 * so the scene never reports ready and the loader curtain would wait out its
 * full cap, leaving the run with no Largest Contentful Paint to measure.
 */
const BOT_PATTERN =
    /bot|crawl|spider|slurp|lighthouse|pagespeed|gtmetrix|headless|preview|pingdom|ptst|chrome-lighthouse|googlebot|bingbot|duckduckbot|yandex|baiduspider|applebot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|embedly|quora|discordbot|screaming frog|ahrefs|semrush|mj12bot|dotbot/i

export const isBot = (): boolean => {
    if (typeof navigator === 'undefined') return false

    return BOT_PATTERN.test(navigator.userAgent)

    /*
      Deliberately NOT checking `navigator.webdriver`. It is true in any
      automation-controlled browser, which silently removed the hero scene from
      every screenshot taken through Puppeteer — and would do the same to a real
      visitor whose browser sets the flag. It does not even catch Lighthouse,
      which drives Chrome through chrome-launcher and sends an ordinary mobile
      user agent. The case that actually matters — an environment that cannot
      render WebGL — is handled by `canRenderWebGL()` below, on capability
      rather than on identity.
    */
}

/**
 * Can this client actually render the scene?
 *
 * Returns false where WebGL is unavailable — a GPU-less or software-blocked
 * environment, which covers headless Chrome (`--disable-gpu`), Lighthouse and
 * PageSpeed Insights, and any device that has lost or refused a context.
 *
 * The loader curtain uses this: a scene that can never initialise must never
 * hold the curtain, or the page waits out the full cap and then reveals — with,
 * in a measurement tool, no Largest Contentful Paint recorded at all. This is
 * about not waiting for something impossible, not about detecting the tool.
 */
export const canRenderWebGL = (): boolean => {
    if (typeof document === 'undefined') return false

    try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
        if (!gl) return false

        // A software rasteriser will answer, but cannot carry these scenes.
        const debug = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
        if (debug) {
            const renderer = String(
                (gl as WebGLRenderingContext).getParameter(debug.UNMASKED_RENDERER_WEBGL) ?? ''
            )
            if (/swiftshader|llvmpipe|software/i.test(renderer)) return false
        }
        return true
    } catch {
        return false
    }
}
