'use client'

import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { colors as tokens, media, rm } from '@/styles'
import { fontGolosText } from '@/styles/fonts'
import { useColorStore } from '@/store/store'

interface ColorPaletreCompactProps {
    mainColors: { name: string; color: string }[]
    accentColors: { name: string; color: string }[]
    className?: string
}

/**
 * The colour picker for touch layouts, collapsed into a single control.
 *
 * On desktop the palette lives open in the corner of the configurator, which
 * does not fit a phone or a tablet in portrait — so there it was simply absent
 * from the configurator. This is the same store and the same selection, shown
 * as one button that opens a sheet; picking a colour applies it and closes.
 */
export const ColorPaletreCompact = ({ mainColors, accentColors, className }: ColorPaletreCompactProps) => {
    const {
        activeMainColor,
        activeAccentColor,
        colorMode,
        materialAccentColor,
        setActiveMainColor,
        setActiveAccentColor,
        setColorMode,
    } = useColorStore()

    const [isOpen, setIsOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

    const hasAccentColor = Boolean(materialAccentColor && materialAccentColor.color)

    useEffect(() => {
        if (!hasAccentColor && colorMode === 'accent') setColorMode('main')
    }, [hasAccentColor, colorMode, setColorMode])

    // Close on an outside tap or Escape — a sheet that traps the page is worse
    // than no sheet.
    useEffect(() => {
        if (!isOpen) return

        const onPointerDown = (event: PointerEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) setIsOpen(false)
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false)
        }

        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [isOpen])

    const currentColors = colorMode === 'main' ? mainColors : accentColors
    const activeColor = colorMode === 'main' ? activeMainColor : activeAccentColor
    const setActiveColor = colorMode === 'main' ? setActiveMainColor : setActiveAccentColor

    if (!currentColors?.length) return null

    const select = (color: { name: string; color: string }) => {
        setActiveColor(color)
        setIsOpen(false)
    }

    return (
        <StyledCompact ref={rootRef} className={className}>
            <StyledTrigger
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label={`${hasAccentColor ? (colorMode === 'main' ? 'Main colour' : 'Accent colour') : 'Colour'}: ${activeColor?.name || 'choose a colour'}`}
            >
                <span className="swatch" style={{ backgroundColor: activeColor?.color || 'transparent' }} />
                {/*
                  When a product has both palettes the label carries the mode.
                  Several products return the *same* colour list for main and
                  accent and name both defaults "Material Color", so without
                  this the only sign that the switch did anything is the tab
                  highlight — which reads as the switch being broken.
                */}
                <span className="label">
                    {hasAccentColor ? `${colorMode === 'main' ? 'Main' : 'Accent'} · ` : ''}
                    {activeColor?.name || 'Choose colour'}
                </span>
                <span className={`chevron${isOpen ? ' -open' : ''}`} aria-hidden="true" />
            </StyledTrigger>

            {isOpen && (
                <StyledSheet role="listbox" aria-label="Colours">
                    {hasAccentColor && (
                        <StyledModes>
                            <button
                                type="button"
                                className={colorMode === 'main' ? '-active' : ''}
                                onClick={() => setColorMode('main')}
                            >
                                Main
                            </button>
                            <button
                                type="button"
                                className={colorMode === 'accent' ? '-active' : ''}
                                onClick={() => setColorMode('accent')}
                            >
                                Accent
                            </button>
                        </StyledModes>
                    )}
                    <StyledOptions>
                        {currentColors.map((color, index) => (
                            <li key={`${colorMode}-${color.color}-${index}`}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={activeColor?.name === color.name}
                                    aria-label={color.name}
                                    title={color.name}
                                    className={activeColor?.name === color.name ? '-active' : ''}
                                    onClick={() => select(color)}
                                >
                                    <span className="swatch" style={{ backgroundColor: color.color }} />
                                    {/*
                                      The name is a raw hex for most products, which
                                      reads as noise next to the colour it describes.
                                      It stays as the accessible name and the tooltip;
                                      the grid shows the colour itself.
                                    */}
                                    <span className="name">{color.name}</span>
                                </button>
                            </li>
                        ))}
                    </StyledOptions>
                </StyledSheet>
            )}
        </StyledCompact>
    )
}

const StyledCompact = styled.div`
    position: relative;
    width: fit-content;
    flex-shrink: 0;
`

/*
  Shaped to sit in the scene's glassy toolbar beside the zoom buttons: the same
  44px box, the same white fill and radius. On a phone the label and chevron
  drop away and it becomes exactly what it needs to be — a rectangle of the
  colour currently picked.
*/
const StyledTrigger = styled.button`
    display: flex;
    align-items: center;
    gap: ${rm(10)};
    height: ${rm(44)};
    padding: 0 ${rm(12)};
    border: 0;
    border-radius: ${rm(4)};
    background-color: ${tokens.white100};
    cursor: pointer;
    ${fontGolosText(500)};
    font-size: ${rm(14)};
    color: ${tokens.black100};
    text-transform: uppercase;
    white-space: nowrap;
    transition: color 0.3s ease;

    &:hover { color: ${tokens.blue}; }

    .swatch {
        width: ${rm(24)};
        height: ${rm(24)};
        border-radius: ${rm(3)};
        border: 1px solid ${tokens.gray700};
        flex-shrink: 0;
    }

    .chevron {
        width: ${rm(8)};
        height: ${rm(8)};
        border-right: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
        transform: rotate(45deg) translate(-2px, -2px);
        transition: transform 0.3s ease;

        &.-open { transform: rotate(-135deg) translate(-2px, -2px); }
    }

    ${media.xsm`
        width: ${rm(44)};
        padding: 0;
        justify-content: center;

        .label, .chevron { display: none; }

        .swatch {
            width: ${rm(28)};
            height: ${rm(28)};
        }
    `}
`

const StyledSheet = styled.div`
    position: absolute;
    /* within the toolbar's stacking context; the toolbar outranks the rail */
    z-index: 2;
    /* opens upward from a trigger that sits low in the configurator; the
       height cap is what keeps it clear of the header on a phone */
    bottom: calc(100% + ${rm(10)});
    left: 0;

    /*
      On touch the trigger sits at the left end of a centred toolbar, and the
      sheet's positioning context is the trigger itself — so centring on it
      still ran off the left edge of the screen. Anchor to the viewport
      instead: fixed, centred, clear of the toolbar.
    */
    ${media.md`
        position: fixed;
        left: 50%;
        right: auto;
        bottom: ${rm(110)};
        transform: translateX(-50%);
        width: min(${rm(340)}, calc(100vw - ${rm(32)}));
        min-width: unset;
        max-width: none;
    `}

    ${media.xsm`
        bottom: ${rm(72)};
    `}
    min-width: ${rm(220)};
    max-width: min(${rm(320)}, calc(100vw - ${rm(32)}));
    padding: ${rm(8)};
    border-radius: ${rm(10)};
    background-color: ${tokens.white100};
    border: 1px solid ${tokens.gray700};
    box-shadow: 0 ${rm(12)} ${rm(32)} rgba(23, 28, 40, 0.16);
    max-height: min(${rm(320)}, 42vh);
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
`

const StyledModes = styled.div`
    display: flex;
    gap: ${rm(4)};
    padding-bottom: ${rm(8)};
    margin-bottom: ${rm(4)};
    border-bottom: 1px solid ${tokens.gray700};

    button {
        flex: 1;
        padding: ${rm(8)};
        border: 0;
        border-radius: ${rm(6)};
        background-color: transparent;
        ${fontGolosText(500)};
        font-size: ${rm(12)};
        text-transform: uppercase;
        color: ${tokens.gray90};
        cursor: pointer;
        min-height: ${rm(36)};
        transition: background-color 0.3s ease, color 0.3s ease;

        &.-active {
            background-color: ${tokens.bgGray};
            color: ${tokens.black100};
        }
    }
`

const StyledOptions = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: ${rm(2)};

    button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: ${rm(10)};
        padding: ${rm(8)} ${rm(10)};
        border: 0;
        border-radius: ${rm(6)};
        background-color: transparent;
        cursor: pointer;
        text-align: left;
        min-height: ${rm(44)};
        ${fontGolosText(400)};
        font-size: ${rm(14)};
        color: ${tokens.black100};
        transition: background-color 0.3s ease;

        &:hover, &.-active { background-color: ${tokens.bgGray}; }
    }

    .swatch {
        width: ${rm(22)};
        height: ${rm(22)};
        border-radius: ${rm(4)};
        border: 1px solid ${tokens.gray700};
        flex-shrink: 0;
    }

    .name { text-transform: uppercase; }

    /*
      On touch the list becomes a grid of colour chips: the names are raw hex
      for most products, so they add width and no meaning. The name survives as
      each button's accessible name and tooltip.
    */
    ${media.md`
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: ${rm(6)};

        button {
            width: 100%;
            min-height: unset;
            aspect-ratio: 1;
            padding: ${rm(3)};
            justify-content: center;
            border: ${rm(2)} solid transparent;

            &.-active { border-color: ${tokens.blue}; background-color: transparent; }
        }

        .swatch {
            width: 100%;
            height: 100%;
            border-radius: ${rm(3)};
        }

        .name {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
        }
    `}
`
