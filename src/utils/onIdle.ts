/**
 * Run work once the browser is idle, with a hard deadline.
 *
 * For data a component will need *eventually* but not to paint — the header's
 * mega-menu contents are the case this exists for. Those four menus are always
 * mounted but closed, and each fetched on mount, which put ~2s of requests on
 * the critical path of every page load for panels nobody had opened yet.
 *
 * Returns a cancel function, so an effect can clean up on unmount.
 */
export const onIdle = (run: () => void, timeout = 2500): (() => void) => {
    if (typeof window === 'undefined') return () => {}

    const requestIdle = (window as unknown as {
        requestIdleCallback?: (cb: IdleRequestCallback, opts?: { timeout: number }) => number
    }).requestIdleCallback

    if (typeof requestIdle === 'function') {
        const handle = requestIdle(() => run(), { timeout })
        return () => (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(handle)
    }

    // Safari has no requestIdleCallback; a short timeout is close enough to
    // "after the page has painted".
    const handle = setTimeout(run, 300)
    return () => clearTimeout(handle)
}
