/**
 * One place that decides what "this device" means for every 3D scene.
 *
 * Read once, at scene construction — a device does not change tier mid-session
 * and rebuilding renderer state on resize costs more than the mismatch is worth.
 * Every scene reads DPR and renderer flags from here so the values can never
 * drift apart between the four canvases.
 */

import { breakpoints } from '@/styles/grid/breakpoints'

export type DeviceTier = 'mobile' | 'tablet' | 'desktop'


/** Clamped device pixel ratios — a 3x phone otherwise renders 9x the fragments. */
const DPR_BY_TIER: Record<DeviceTier, [number, number]> = {
    mobile: [0.75, 1],
    tablet: [0.75, 1.25],
    desktop: [0.75, 1.5],
}

export const getDeviceTier = (): DeviceTier => {
    if (typeof window === 'undefined') return 'desktop'

    const coarsePointer =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(hover: none) and (pointer: coarse)').matches

    // Same thresholds the CSS grid switches on, so a scene never clamps DPR at
    // a different width than the layout changes at.
    if (window.innerWidth < breakpoints.md || coarsePointer) return 'mobile'
    if (window.innerWidth < breakpoints.lg) return 'tablet'
    return 'desktop'
}

export const getSceneDpr = (tier: DeviceTier = getDeviceTier()): [number, number] => DPR_BY_TIER[tier]

/**
 * Renderer flags per tier. MSAA is expensive on a phone and the DPR clamp plus
 * soft edges hide its absence; `powerPreference` only earns its keep on desktop.
 */
export const getSceneGlFlags = (tier: DeviceTier = getDeviceTier()) => ({
    antialias: tier !== 'mobile',
    powerPreference: (tier === 'desktop' ? 'high-performance' : 'default') as WebGLPowerPreference,
})

export const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
