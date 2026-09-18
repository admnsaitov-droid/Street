'use client'

import { useState } from 'react'

/**
 * Is this a real touch device, as opposed to a narrow window on a laptop?
 *
 * Deliberately **not** a width check. Someone opening the mobile layout on a
 * desktop browser still has a mouse and should keep dragging the scene with it;
 * only a device whose primary input is a finger needs the two-finger rules.
 * `(hover: none) and (pointer: coarse)` is the pair that separates them.
 *
 * Read once at mount: a device does not grow a mouse mid-session, and
 * re-deciding on resize would tear down the scene's controls.
 */
export const useTouchDevice = (): boolean => {
    const [isTouch] = useState(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches
    })

    return isTouch
}
