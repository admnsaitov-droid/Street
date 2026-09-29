'use client'

import { useEffect, useState } from 'react'

/**
 * False on the server and during the first client render, true afterwards.
 *
 * The guard for anything whose value the server cannot know — viewport width
 * above all. `useWindowWidth()` reports 0 on the server but the real width on
 * the client's first paint, so `width > 576 ? a : b` renders two different
 * trees and React reports a hydration mismatch. Gate the branch on this and
 * the first render matches the server; the correct branch appears immediately
 * after.
 */
export const useMounted = (): boolean => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    return mounted
}
