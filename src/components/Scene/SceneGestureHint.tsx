'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { colors, media, rm } from '@/styles'
import { fontGolosText } from '@/styles/fonts'

interface SceneGestureHintProps {
    /** The element the scene is drawn into. */
    containerRef: React.RefObject<HTMLElement | null>
    /** Only touch devices need this; a mouse keeps dragging as before. */
    enabled: boolean
    /** Called the first time a real two-finger gesture happens. */
    onGesture?: () => void
    label?: string
}

const HINT_VISIBLE_MS = 1600

/**
 * The "use two fingers" overlay, in the style map embeds use.
 *
 * A scene that swallows one-finger drags traps the page: a visitor scrolling
 * down with a thumb over the canvas goes nowhere. So one finger scrolls the
 * page and two fingers drive the scene — and the moment someone tries one
 * finger, this says so rather than leaving them stuck.
 *
 * It never blocks input (`pointer-events: none`); it only watches.
 */
export const SceneGestureHint = ({ containerRef, enabled, onGesture, label = 'Use two fingers to rotate' }: SceneGestureHintProps) => {
    const [visible, setVisible] = useState(false)
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const show = useCallback(() => {
        setVisible(true)
        if (hideTimer.current) clearTimeout(hideTimer.current)
        hideTimer.current = setTimeout(() => setVisible(false), HINT_VISIBLE_MS)
    }, [])

    useEffect(() => {
        const node = containerRef.current
        if (!enabled || !node) return

        const onTouchStart = (event: TouchEvent) => {
            if (event.touches.length >= 2) {
                setVisible(false)
                if (hideTimer.current) clearTimeout(hideTimer.current)
                onGesture?.()
                return
            }
            show()
        }

        node.addEventListener('touchstart', onTouchStart, { passive: true })
        return () => {
            node.removeEventListener('touchstart', onTouchStart)
            if (hideTimer.current) clearTimeout(hideTimer.current)
        }
    }, [containerRef, enabled, onGesture, show])

    if (!enabled) return null

    return (
        <StyledHint aria-hidden="true" $visible={visible}>
            <span className="inner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5V4a1.5 1.5 0 0 1 3 0v5.5m0-.5a1.5 1.5 0 0 1 3 0V16a5 5 0 0 1-5 5h-1.6a5 5 0 0 1-3.9-1.9l-2.2-2.8a1.5 1.5 0 0 1 2.2-2l1.5 1.5"
                        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {label}
            </span>
        </StyledHint>
    )
}

const StyledHint = styled.div<{ $visible: boolean }>`
    position: absolute;
    inset: 0;
    z-index: 15;
    display: flex;
    align-items: center;
    justify-content: center;
    /* never intercept a gesture — this only explains one */
    pointer-events: none;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    /* discrete show/hide — the narrow CSS-transition exception */
    transition: opacity 0.25s ease;

    .inner {
        display: inline-flex;
        align-items: center;
        gap: ${rm(10)};
        padding: ${rm(12)} ${rm(18)};
        border-radius: ${rm(8)};
        background-color: rgba(12, 14, 20, 0.72);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        color: ${colors.white100};
        ${fontGolosText(500)};
        font-size: ${rm(15)};
        line-height: 1;
        text-align: center;

        ${media.xsm`
            font-size: ${rm(13)};
            padding: ${rm(10)} ${rm(14)};
        `}
    }
`
