'use client'

import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { colors, media, rm } from "@/styles";
import { fontGolosText } from "@/styles/fonts";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useLoop } from "@/hooks/useLoop";
import { lerp } from "@/utils/math";
import { useInView } from "@react-spring/web";
import { useSpring, animated } from "@react-spring/web";
import useLoadingStore from "@/store/store";
import { useWindowWidth } from "@react-hook/window-size";

const CIRCLE_SIZE = 100; // px

interface BlueButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    isSvg?: boolean;
    className?: string;
    link?: string;
    submit?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
}

export const BlueButton = ({ children, onClick, isSvg, className, link, submit, disabled, ariaLabel }: BlueButtonProps) => {    
    const ref = useRef<HTMLSpanElement>(null)
    const lerpRef = useRef({ x: 0, y: 0 })
    const pointerRef = useRef({ x: 0, y: 0 })
    const isInViewRef = useRef(false)
    const [inViewRef, inView] = useInView()
    const [isHovered, setIsHovered] = useState(false)
    const [circleSpring, api] = useSpring(() => ({ scale: 0, config: { tension: 300, friction: 30 } }))
    const [path1Spring, path1Api] = useSpring(() => ({ transform: 'translateY(0px)', config: { tension: 300, friction: 30 } }))
    const [path2Spring, path2Api] = useSpring(() => ({ transform: 'translateX(0px)', config: { tension: 300, friction: 30 } }))
    const [path3Spring, path3Api] = useSpring(() => ({ transform: 'translateY(0px)', config: { tension: 300, friction: 30 } }))
    const setCurrentCursor = useLoadingStore((state: any) => state.setCurrentCursor)
    const width = useWindowWidth();

    useEffect(() => {
        if (inView) {
            isInViewRef.current = true
        } else {
            isInViewRef.current = false
        }
    }, [inView])

    useEffect(() => {
        if(width <= 768) return;
        
        const handlePointerMove = (e: MouseEvent) => {
            pointerRef.current = {
                x: e.clientX,
                y: e.clientY
            }
        }

        window.addEventListener('mousemove', handlePointerMove)
        return () => window.removeEventListener('mousemove', handlePointerMove)
    }, [width])

    useLoop(() => {
        if (!isInViewRef.current) return
        if (window.innerWidth < 768) return
        if (!ref.current) return

        const buttonRect = inViewRef.current.getBoundingClientRect()
        const x = lerp(lerpRef.current.x, pointerRef.current.x - buttonRect.left, 0.075)
        const y = lerp(lerpRef.current.y, pointerRef.current.y - buttonRect.top, 0.075)
        lerpRef.current = { x, y }
        ref.current.style.transform = `translate(${x - CIRCLE_SIZE / 2}px, ${y - CIRCLE_SIZE / 2}px)`
    }, { framerate: 10 })

    useEffect(() => {
        api.start({ scale: isHovered ? 1 : 0 })
        
        // Animate paths on hover
        path1Api.start({ transform: isHovered ? 'translateY(-2px)' : 'translateY(0px)' })
        path2Api.start({ transform: isHovered ? 'translateX(2px)' : 'translateX(0px)' })
        path3Api.start({ transform: isHovered ? 'translateY(2px)' : 'translateY(0px)' })
    }, [isHovered, api, path1Api, path2Api, path3Api])

    return (
        <StyledBlueButton 
            ref={inViewRef}
            className={className}
            onMouseEnter={() => {
                if(width <= 768) return;
                setIsHovered(true)
                setCurrentCursor({
                    type: 'hover',
                })
            }}
            onMouseLeave={() => {
                if(width <= 768) return;
                setIsHovered(false)
                setCurrentCursor({
                    type: 'default',
                })
            }}
        >
            <span style={{zIndex: 2, position: 'relative'}}>{children}</span>
            {link && (
                <StyledHiddenLink 
                    href={link} 
                    target="_blank"
                    aria-label={ariaLabel || (typeof children === 'string' ? children : 'Link')}
                />
            )}
            {!link && (
                <StyledHiddenButton 
                    onClick={onClick}
                    type={submit ? 'submit' : 'button'}
                    disabled={disabled}
                    aria-label={ariaLabel || (typeof children === 'string' ? children : 'Button')}
                />
            )}
            {isSvg && (
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <animated.path 
                        d="M10.1092 9.21504L13.7168 5.60742L10.1092 1.99981L6.50157 5.60742L10.1092 9.21504Z" 
                        fill="white"
                        style={{ transform: path1Spring.transform }}
                    />
                    <animated.path 
                        d="M13.715 19.1799L10.1074 15.5723L6.49981 19.1799L10.1074 22.7875L13.715 19.1799Z" 
                        fill="white"
                        style={{ transform: path3Spring.transform }}
                    />
                    <animated.path 
                        d="M16.8927 16.0023L13.2852 12.3947L16.8927 8.78711L20.5003 12.3947" 
                        fill="white"
                        style={{ transform: path2Spring.transform }}
                    />
                </svg>
            )}
            <StyledFloatingHoverCircle ref={ref}>
                <animated.span style={{ scale: circleSpring.scale }} className='hoverCircle' />
            </StyledFloatingHoverCircle>
        </StyledBlueButton>
    )
}

const StyledBlueButton = styled.div`
    background-color: ${colors.blue};
    border-radius: ${rm(4)};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${rm(10)};
    padding: ${rm(16)} ${rm(28.5)};
    cursor: pointer;
    transition: opacity 0.3s ease;
    font-size: ${rm(18)};
    ${fontGolosText(600)};
    color: ${colors.white100};
    text-transform: uppercase;
    position: relative;
    height: fit-content;
    width: fit-content;
    overflow: hidden;
    z-index: 1;

    ${media.lg`
        font-size: ${rm(16)};
    `}

    svg{
        width: ${rm(24)};
        height: ${rm(24)};
        position: relative;
        z-index: 1;
    }

    span{
        position: relative;
        z-index: 1;
    }

    &:hover{
        // opacity: 0.8;
    }

    &:disabled{
        opacity: 0.5;
        cursor: not-allowed;
    }

`

const StyledFloatingHoverCircle = styled.span`
    position: absolute !important;
    top: 0;
    left: 0;
    pointer-events: none;
    user-select: none;
    width: 100%;
    height: 100%;
    z-index: 1;

    .hoverCircle {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 50%;
        background: ${colors.black100};
        width: ${CIRCLE_SIZE}px;
        height: ${CIRCLE_SIZE}px;
        display: block;
    }
`

const StyledHiddenLink = styled(AnimLink)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
`

const StyledHiddenButton = styled.button`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    border: none;
    background: transparent;
    cursor: pointer;
    outline: none;
`