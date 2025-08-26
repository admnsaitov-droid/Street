'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react"
import styled from "styled-components"
import { animated, useSpring } from "@react-spring/web"
import { colors } from "@/styles"

export const randomArray = [0.42, 0.71, 0.83, 0.29, 0.15, 0.93, 0.47, 0.56, 0.38, 0.91, 0.23, 0.67, 0.84, 0.12, 0.59, 0.77, 0.34, 0.88, 0.51, 0.96, 0.18, 0.63, 0.45, 0.72, 0.26, 0.81, 0.54, 0.92, 0.37, 0.69]

const StyledLoader = styled(animated.div)`
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    z-index: 300;
    background-color: ${colors.black100};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    pointer-events: none;
`

export const TransitionBg = forwardRef(({}, outerRef) => {
    const [opened, setOpened] = useState(false)
    const isFirstRender = useRef(true)
    const initialRender = useRef(true)
    
    useImperativeHandle(outerRef, () => ({ 
        show: (callback?: () => void) => {
            // Always reset to initial position before showing
            api.set({ transform: 'translateY(-100%)' })
            
            // Small delay to ensure the reset has been applied
            setTimeout(() => {
                isFirstRender.current = false
                setOpened(true)
                
                setTimeout(() => {
                    callback && callback()
                }, 500) // Duration for the transition effect
            }, 10)
        }, 
        hide: () => setOpened(false) 
    }))

    const [springs, api] = useSpring(() => ({
        transform: 'translateY(-100%)',
        config: {
            tension: 280,
            friction: 30
        }
    }))

    // Update the spring when opened state changes
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false
            return
        }
        
        if (opened) {
            api.start({ transform: 'translateY(0%)' })
        } else {
            api.start({ transform: 'translateY(100%)' })
        }
    }, [opened, api])

    return (
        <StyledLoader 
            style={{
                ...springs,
                pointerEvents: opened ? 'all' : 'none'
            }}
        />
    )
})

TransitionBg.displayName = 'TransitionBg' 