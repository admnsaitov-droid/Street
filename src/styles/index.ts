'use client'

import { createGlobalStyle } from "styled-components"
import { printVars } from "./utils"
import { _colors, colors } from "./colors"
import { fontOnest } from "./fonts"

import { initSmartCSSGrid } from "@/styles/grid/grid"

const {
    SmartCSSGrid,
    media,
    rm,
    em
} = initSmartCSSGrid({
    fontBase: 16,
    scaleUpCoeff: 0.6666,
    grid: {
        xlg: 1920,
        lg: 1440,
        md: 768,
        xsm: 576,
    },
    related: {
        xsm: 360
    }
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

    /* Cookie */
    .cookieContainer {
        position: fixed;
        right: ${rm(32)} !important;
        bottom: ${rm(32)} !important;
        max-width: ${rm(550)};
        width: 100%;
        z-index: 900;
        background: #000;
        border-radius: ${rm(10)};
        padding: ${rm(56)};
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        border: 1px solid #2A2A2A;
        opacity: 0;
        transition: opacity 2s ease;
        &.visible {
            opacity: 1;
        }
        > div {
            width: 100%;
        }

        ${media.xsm`
            right: ${rm(0)} !important;
            bottom: ${rm(0)} !important;
            max-width: 100%;
            border-radius: 0;
            padding: ${rm(24)} ${rm(16)};
        `}

        h5 {
            font-size: ${rm(32)};
            margin-bottom: ${rm(24)};
            color: white;
            ${media.xsm`
                margin-bottom: ${rm(16)};
                font-size: ${rm(24)};
            `}
        }

        p {
            font-size: ${rm(16)};
            color: white;

            * {
                display: inline;
            }

            a {
                position: relative;
                margin-left: ${rm(4)};
                cursor: pointer;
                &:hover::before {
                    background-color: white;
                }
                &::before {
                    position: absolute;
                    content: '';
                    left: 0; top: calc(100% - ${rm(2)});
                    width: 100%;
                    height: 1px;
                    background-color: rgb(118, 118, 118);
                }
            }
        }
    }

    .cookieButton {
        display: none !important;
    }
`

// Exports
export default GlobalStyles
export { colors } from './colors'
export { fonts } from './fonts'
export { SmartCSSGrid, media, rm, em }