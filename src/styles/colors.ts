import { toVars } from "./utils"

export const _colors = {
    white100: '#FFFFFF',
    black100: '#000000',
    background: 'rgba(255, 255, 255, 0.9)',
    blue: '#0040DD',
    red: '#FF0021',
    gray: '#6F7685',
    blue90: '#99B3F1',
    // Text roles for blue90/gray where they sit on a surface they can't read
    // on at AA (4.5:1): blue90 on blue is 3.6:1, gray on the light form panel
    // 4.3:1. Same hue, nudged to pass — the shared tokens stay as they are.
    blue90OnBlue: '#BACBF6',
    grayText: '#646B7A',
    bgGray: '#E9EDF1',
    gray90: '#868D9C',
    gray700: '#B7BCCA',
    // Media placeholders — the shade a slot holds until its image or video
    // arrives. Deliberately faint: it should read as "this is about to be
    // something", not as a grey box. See ADR-0110.
    mediaPlaceholder: '#F2F4F8',
    mediaPlaceholderShimmer: 'rgba(23, 28, 40, 0.06)',
    mediaPlaceholderDark: '#1C1F26',
} 


export const colors: typeof _colors = toVars(_colors)