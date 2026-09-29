'use client'

import { useEffect } from 'react'
import useAnimationStore from '@/animationStore/animationStore'

/**
 * Declares that a piece of above-the-fold media must be on screen before the
 * loader curtain lifts, and reports when it is.
 *
 * Only `priority` media registers. Everything below the fold keeps its
 * placeholder and loads in its own time — holding the curtain for it would
 * trade one blank wait for a longer one.
 *
 * @param id       stable identity for the slot (its source URL)
 * @param enabled  false for non-priority media
 * @param isReady  true once the image has decoded or the video can play
 */
export const useRequireMedia = (id: string | undefined, enabled: boolean, isReady: boolean) => {
    const requireMedia = useAnimationStore((state) => state.requireMedia)
    const releaseMedia = useAnimationStore((state) => state.releaseMedia)
    const markMediaReady = useAnimationStore((state) => state.markMediaReady)

    useEffect(() => {
        if (!enabled || !id) return

        requireMedia(id)
        return () => releaseMedia(id)
    }, [enabled, id, requireMedia, releaseMedia])

    useEffect(() => {
        if (!enabled || !id || !isReady) return

        markMediaReady(id)
    }, [enabled, id, isReady, markMediaReady])
}
