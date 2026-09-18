import { toVars } from "./utils"

export const _colors = {
    white100: '#FFFFFF',
    black100: '#000000',
    background: 'rgba(255, 255, 255, 0.9)',
    blue: '#0040DD',
    red: '#FF0021',
    gray: '#6F7685',
    blue90: '#99B3F1',
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