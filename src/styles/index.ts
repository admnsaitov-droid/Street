'use client'

import { createGlobalStyle } from "styled-components"
import { printVars } from "./utils"
import { _colors, colors } from "./colors"
import { fontOnest } from "./fonts"

import { initSmartCSSGrid, type Grid } from "@/styles/grid/grid"
import { breakpoints, relatedBreakpoints } from "@/styles/grid/breakpoints"

const {
    SmartCSSGrid,
    media,
    rm,
    em
// <Grid> is pinned explicitly: `grid` and `related` share one type parameter, so
// letting it infer from the narrower `related` would drop `media.lg` and friends.
} = initSmartCSSGrid<Grid>({
    fontBase: 16,
    scaleUpCoeff: 0.6666,
    grid: { ...breakpoints },
    related: { ...relatedBreakpoints }
})

// Global css
const GlobalStyles = createGlobalStyle`
    // Variables 
    :root {
        ${printVars(_colors, 'color')}
    }

    // Normalize
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        outline: none;
        border: none;
        text-decoration: none;
        color: inherit;
    }

    img {
        user-select: none;
    }

    span, a {
        display: inline-block;
    }

    button {
        background: none;
    }

    html {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: ${colors.white100};
        color: ${colors.black100};
        ${fontOnest(400)}
    }

    html, body {
        -webkit-overflow-scrolling: touch;
        position: relative;
        overscroll-behavior-y: none;
    }
    body::-webkit-scrollbar { width: 0; }

    #__next {
        height: 100%;
    }

    body {
        display: flex;
        flex-direction: column;
    }


    /* Lenis */

    html.lenis, html.lenis body {
        height: auto;
    }

    .lenis.lenis-smooth {
        scroll-behavior: auto !important;
    }

    .lenis.lenis-smooth [data-lenis-prevent] {
        overscroll-behavior: contain;
    }

    .lenis.lenis-stopped {
        overflow: hidden;
    }

    .lenis.lenis-smooth iframe {
        pointer-events: none;
    }
`

// Exports
export default GlobalStyles
export { colors } from './colors'
export { fonts } from './fonts'
export { SmartCSSGrid, media, rm, em }