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
} 


export const colors: typeof _colors = toVars(_colors)