"use client"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { animated, useSpring } from "@react-spring/web"
import { useEffect, useId, useRef, useState } from "react"
import styled from "styled-components"

interface AccordionProps {
    title: string,
    children: React.ReactNode
}

export const Accordion = ({ title, children }: AccordionProps) => {

    const [isOpen, setIsOpen] = useState(true)
    const contentId = useId()
    const contentRef = useRef<HTMLDivElement | null>(null)
    const [measuredHeight, setMeasuredHeight] = useState(0)

    const rotateSpring = useSpring({
        transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)'
    })

    const [contentSpring, api] = useSpring(() => ({
        height: 0,
        y: -4,
        config: { tension: 240, friction: 26, clamp: true }
    }))

    useEffect(() => {
        const node = contentRef.current
        if (!node) return

        const update = () => {
            // Use scrollHeight to get full content height even if clipped
            const nextHeight = node.scrollHeight
            setMeasuredHeight(nextHeight)
        }

        update()

        // Observe dynamic content changes
        const observer = new ResizeObserver(() => {
            update()
        })
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        api.start({
            height: isOpen ? measuredHeight : 0,
            y: isOpen ? 0 : -4
        })
    }, [isOpen, measuredHeight, api])

    return (
        <StyledAccordion>
            <StyledButton
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className="motion-button"
            >
                <StyledTitle>{title}</StyledTitle>
                <animated.svg style={rotateSpring} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.12 16.88L12 10.7733L5.88 16.88L4 15L12 7L20 15L18.12 16.88Z" fill="#0040DD"/>
                </animated.svg>
            </StyledButton>
            <ContentOuter style={{ height: contentSpring.height }} id={contentId}>
                <ContentInner ref={contentRef}>
                    <animated.div style={{
                        transform: contentSpring.y.to((v) => `translateY(${v}px)`)
                    }}>
                        {children}
                    </animated.div>
                </ContentInner>
            </ContentOuter>
        </StyledAccordion>
    )
}

const StyledTitle = styled.p`
    font-size: ${rm(22)};
    ${fontGolosText(500)};
    line-height: 100%;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    color: ${colors.blue};

    ${media.lg`
        font-size: ${rm(18)};
    `}
`

const StyledButton = styled.button`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    transition: opacity 0.3s ease-in-out;
    
    svg{
        width: ${rm(24)};
        height: ${rm(24)};
        will-change: transform;
    }
`

const StyledAccordion = styled.div`
    width: 100%;
    position: relative;
    padding-top: ${rm(20)};

    .motion-button{
        &:hover{
            opacity: 0.8;
        }
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-image: 
            radial-gradient(circle 1px at 4px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 12px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 20px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 28px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 36px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 44px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 52px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 60px 0.5px, #B7BCCA 100%, transparent 100%);
        background-size: 16px 1px;
        background-repeat: repeat-x;
        transition: opacity 0.3s ease-in-out;
    }
`

const ContentOuter = styled(animated.div)`
    overflow: hidden;
    will-change: height;
`

const ContentInner = styled.div`
    padding-top: ${rm(20)};
`