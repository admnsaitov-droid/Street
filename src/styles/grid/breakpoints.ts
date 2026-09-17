/**
 * The SmartCSSGrid breakpoints, in one place.
 *
 * `src/styles/index.ts` feeds them to `initSmartCSSGrid` (so `media.md` and
 * friends derive from them), and non-styling code that has to make the same
 * mobile/tablet/desktop call — `src/utils/deviceTier.ts` — reads them here
 * rather than repeating the numbers. A scene that clamps DPR at a different
 * width than the CSS switches layout at is a bug waiting to happen.
 */
export const breakpoints = {
    xlg: 1920,
    lg: 1440,
    md: 768,
    xsm: 576,
}

export const relatedBreakpoints = {
    xsm: 360,
}
