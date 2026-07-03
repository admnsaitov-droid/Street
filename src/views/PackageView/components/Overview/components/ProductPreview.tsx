import { create } from "zustand"
import VideoPlayer from "@/components/Skeleton/VideoPlayer"
import { MutableRefObject, createRef, useEffect, useRef, useState } from "react"
import { animated, useSpring } from "@react-spring/web"
import { useLoop } from "@/hooks/useLoop"
import { useWindowWidth } from "@react-hook/window-size"
import { AnimLink } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout"
import styled from "styled-components"
import { rm } from "@/styles"
import { media } from "@/styles"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"

interface UseProductPreview {
    allUrls: Array<any>
    poster: string
    url: string
    ref: HTMLElement | null
    containerRef: MutableRefObject<HTMLDivElement | null>
    index: number
    route: string
    setRef: (ref: HTMLElement | null) => void
    setAllUrls: (allUrls: Array<any>) => void
    setUrl: (url: string) => void
    setPoster: (poster: string) => void
    setIndex: (index: number) => void
    setRoute: (route: string) => void
}
export const useProductPreview = create<UseProductPreview>((set, get) => ({
    allUrls: [],
    setAllUrls: allUrls => set({ allUrls }),
    url: '',
    setUrl: url => set({ url }),
    poster: '',
    setPoster: poster => set({ poster }),
    ref: null,
    setRef: ref => set({ ref }),
    containerRef: createRef(),
    index: -1,
    setIndex: index => set({ index }),
    route: '',
    setRoute: route => set({ route })
}))

export const ProductPreview = () => {
    const url = useProductPreview(state => state.url)
    const poster = useProductPreview(state => state.poster)
    const ref = useProductPreview(state => state.ref)
    const allUrls = useProductPreview(state => state.allUrls)
    const containerRef = useProductPreview(state => state.containerRef)
    const index = useProductPreview(state => state.index)
    const route = useProductPreview(state => state.route)
    const values = useSpring({
        opacity: url === 'poster-only' && poster ? 1 : 0,
        scale: url === 'poster-only' && poster ? 1 : .5,
        delay: url === 'poster-only' && poster ? 0 : 300
    })
    const [moveValues, moveApi] = useSpring(() => ({
        y: 0,
        x: 0
    }))

    const progressValues = useSpring({
        width: (index + 1) / (allUrls?.length || 1) * 100 + '%'
    })

    const innerRef = useRef<HTMLDivElement | null>(null)
    const width = useWindowWidth()
    
    // Desktop - smooth positioning that tracks line height changes
    useEffect(() => {
        if (!ref || !containerRef.current || !innerRef.current) {return}
        if (window.innerWidth <= 576) { return }
        if (url !== 'poster-only' || !poster) { return } // Only position when preview is active

        const rightOffset = window.innerWidth > 1440 ? 140 : 60

        const updatePosition = () => {
            if (!containerRef.current || !innerRef.current) return

            const refRect = ref.getBoundingClientRect()
            const containerRect = containerRef.current.getBoundingClientRect()
            const innerRect = innerRef.current.getBoundingClientRect()
            
            // Calculate position relative to container - center the preview on the line
            const y = refRect.top - containerRect.top + refRect.height / 2 - innerRect.height / 2
            
            // Calculate x position: container width - right padding - preview width
            // Get actual computed padding from the container
            const containerStyles = window.getComputedStyle(containerRef.current)
            const rightPadding = parseFloat(containerStyles.paddingRight) || 0
            const x = containerRect.width - rightPadding - innerRect.width - rightOffset

            // Smooth animation that follows height changes
            moveApi.start({ 
                y, 
                x,
                config: { tension: 280, friction: 60 } // Match accordion animation feel
            })
        }

        // Initial positioning
        updatePosition()

        // Set up ResizeObserver to track line height changes
        const resizeObserver = new ResizeObserver(() => {
            // Use requestAnimationFrame to ensure smooth updates
            requestAnimationFrame(updatePosition)
        })

        resizeObserver.observe(ref)

        // Cleanup
        return () => {
            resizeObserver.disconnect()
        }
    }, [ref, url, poster, moveApi, index])

    // Mobile
    useLoop(() => {
        if (!containerRef.current || !innerRef.current) {return}
        if (window.innerWidth > 576) { return }
        const isHome = window.location.pathname === '/'
        if (isHome) {
            const y = Math.abs(Math.min(window.scrollY - window.outerHeight + innerRef.current.getBoundingClientRect().height + 200, 0))
            moveApi.start({ y })
            return
        }
        moveApi.start({ y: 0 })
    })

    return (
        <>
            <StyledContainer as={animated.div} ref={innerRef} style={{...moveValues, pointerEvents: url === 'poster-only' && poster && width <= 576 ? 'all' : 'none'}}>
                <AnimLink href={`/products/${route}`} aria-label={`View product details`}>
                    <animated.span style={{...values, backgroundColor: '#EAECF2 !important'}}>
                        { allUrls.map((item, idx) => 
                            <VideoPlayer 
                                key={idx} 
                                style={{ display: getMediaStrapiPath(item?.previewImage) === poster && url === 'poster-only' ? 'block' : 'none' }} 
                                enableLoad={false} // No need to load video since we only have posters
                                enableLoader={false} // No loader needed for poster-only mode
                                className="video" 
                                poster={getMediaStrapiPath(item?.previewImage)} 
                                src={''} // No video source
                                width={1440} 
                                height={1080} 
                            />
                        ) }
                    </animated.span>
                </AnimLink>
            </StyledContainer>
        </>

    )
}

const StyledContainer = styled(animated.div)`
    position: absolute;
    z-index: 1;
    top: 0; left: 0;
    width: ${rm(240)};
    height: ${rm(240)};
    pointer-events: none;
    border-radius: ${rm(8)};
    overflow: hidden;

    > a {
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    > a > span {
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(255, 255, 255, .5);
        border-radius: ${rm(3)};
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* ${media.lg`
        width: ${rm(1440 / 2.75)};
        height: ${rm(1080 / 2.75 * 0.75)};
        top: calc(50% - ${rm(1080 / 2.75 / 2)} - ${rm(70)}); 
        left: calc(50% - ${rm(1440 / 2.75 / 2)});
    `} */

    ${media.xsm`
        width: ${rm(390 - 32)};
        height: ${rm(390 - 32)};
        top: ${rm(48)}; left: ${rm(16)};
        position: fixed;
        /* transform: none !important; */
        z-index: 11;
        pointer-events: auto;
    `}

    &:hover {
        opacity: .5;

        ${media.xsm`
            opacity: 1;
        `}
    }

    .video {
        position: absolute;
        width: 100% !important;
        height: 100% !important;
        top: 0; left: 0;
        z-index: 1;
        background-color: #EAECF2 !important;
    }


    .progress {
        position: absolute;
        bottom: 0; left: 0;
        width: 100%;
        height: 1px;
        background: rgba(0, 0, 0, .5);
        z-index: 1;

        > div {
            position: absolute;
            top: 0; left: 0;
            height: 100%;
            background-color: rgba(255, 255, 255, .8);
        }
    }
`