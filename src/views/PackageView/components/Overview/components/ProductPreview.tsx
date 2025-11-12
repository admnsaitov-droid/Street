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

        const rightOffset = window.innerWidth > 1440 ? 100 : 60

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
            
            console.log('Positioning preview:', { 
                y, 
                x, 
                refHeight: refRect.height,
                actualIndex: index,
                containerWidth: containerRect.width,
                windowWidth: window.innerWidth,
                rightPadding,
                previewWidth: innerRect.width
            })

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
                    <animated.span style={{...values, backgroundColor: '#F8F9FC !important'}}>
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
                        <span className="logo">
                            <svg width="176" height="16" viewBox="0 0 176 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_5081_9399)">
                                <path d="M92.6527 7.80066L89.3633 4.535L86.0739 7.80066L89.3633 11.0663L92.6527 7.80066Z" fill="black"/>
                                <path d="M84.7614 6.4944L88.0508 3.22874L84.7614 -0.036913L81.472 3.22875L84.7614 6.4944Z" fill="#FF0021"/>
                                <path d="M88.0491 12.3738L84.7598 9.10811L81.4704 12.3738L84.7598 15.6394L88.0491 12.3738Z" fill="black"/>
                                <path d="M89.3655 11.0656L86.0762 7.8L89.3655 4.53438L92.6548 7.8" fill="black"/>
                                <path d="M83.4453 7.79965L80.1559 4.53403L75.5511 -0.0376282L72.2617 3.22799L76.8666 7.79965L72.2617 12.3713L75.5511 15.6369L80.1559 11.0653L83.4453 7.79965Z" fill="black"/>
                                <path d="M106.11 7.93865V7.60657C107.139 7.16097 108.096 6.24219 108.096 4.70698C108.096 2.9946 106.699 1.60687 104.974 1.60687H100.205H97.3125V13.9935H101.031H105.107C106.832 13.9935 108.23 12.6058 108.23 10.8934C108.23 9.29243 107.188 8.36197 106.11 7.93865ZM104.377 6.32388H101.031V4.58922H104.377V6.32388ZM104.511 11.0101H101.031V9.27545H104.511V11.0101Z" fill="black"/>
                                <path d="M142.227 7.93928V7.6072C143.256 7.1616 144.214 6.24281 144.214 4.70761C144.214 2.99523 142.816 1.6075 141.091 1.6075H136.323H133.43V13.9941H137.149H141.224C142.949 13.9941 144.347 12.6064 144.347 10.894C144.347 9.29305 143.305 8.3626 142.227 7.93928ZM140.495 6.32451H137.149V4.58984H140.495V6.32451ZM140.628 11.0107H137.149V9.27608H140.628V11.0107Z" fill="black"/>
                                <path d="M117.682 1.60626H110.987L108.434 13.9929H112.153L112.751 10.9299H116.368L116.967 13.9929H120.686L118.133 1.60626H117.682ZM113.362 7.80012L113.961 4.73714H115.159L115.757 7.80012H113.363H113.362Z" fill="black"/>
                                <path d="M128.889 1.60606H124.336H121.443V13.9927H125.162V10.1934H126.382L128.167 13.9927H132.227L129.842 9.59081C131.222 9.1834 132.227 7.91556 132.227 6.41324V4.92048C132.227 3.08927 130.732 1.605 128.888 1.605L128.889 1.60606ZM125.162 4.73694H128.508V7.06255H125.162V4.73694Z" fill="black"/>
                                <path d="M148.291 1.60626H145.398V13.994H148.291H155.207V11.0106H149.117V9.2759H154.462V6.32433H149.117V4.58967H155.207V1.60626H148.291Z" fill="black"/>
                                <path d="M160.188 1.60626H156.469V13.994H159.362H165.532V10.8631H160.188V1.60626Z" fill="black"/>
                                <path d="M170.256 10.8631V1.60626H166.537V13.994H169.43H175.6V10.8631H170.256Z" fill="black"/>
                                <path d="M30.7149 1.60606H26.1624H23.2695V13.9927H26.9885V10.1934H28.2078L29.9935 13.9927H34.0534L31.6681 9.59081C33.0478 9.1834 34.0534 7.91556 34.0534 6.41324V4.92048C34.0534 3.08927 32.5583 1.605 30.7138 1.605L30.7149 1.60606ZM26.9885 4.73694H30.3345V7.06255H26.9885V4.73694Z" fill="black"/>
                                <path d="M38.1517 1.60626H35.2578V13.994H38.1517H45.066V11.0106H38.9778V9.2759H44.3211V6.32433H38.9778V4.58967H45.066V1.60626H38.1517Z" fill="black"/>
                                <path d="M49.219 1.60626H46.3262V13.994H49.219H56.1343V11.0106H50.0451V9.2759H55.3895V6.32433H50.0451V4.58967H56.1343V1.60626H49.219Z" fill="black"/>
                                <path d="M15.1009 1.60626H11.6523V4.73714H15.1009V13.994H18.8199V4.73714H22.2684V1.60626H18.8199H15.1009Z" fill="black"/>
                                <path d="M67.6091 1.60626H64.1616H60.4416H56.9941V4.73714H60.4416V13.994H64.1616V4.73714H67.6091V1.60626Z" fill="black"/>
                                <path d="M7.67708 1.60616H3.51144C1.66693 1.60616 0.171875 3.09043 0.171875 4.92164V6.13644C0.171875 7.36396 1.06207 8.41218 2.28141 8.62013L7.29664 9.47314V10.9956H3.89188V9.57393H0.172943V10.6784C0.172943 12.5096 1.668 13.9939 3.51251 13.9939H7.67815C9.52266 13.9939 11.0177 12.5096 11.0177 10.6784V9.46359C11.0177 8.23606 10.1275 7.18784 8.90818 6.9799L3.89295 6.12688V4.60442H7.2977V6.0261H11.0166V4.92164C11.0166 3.09043 9.52159 1.60616 7.67708 1.60616Z" fill="black"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_5081_9399">
                                <rect width="176" height="16" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                        </span>
                        <span className="progress"><animated.span style={progressValues} /></span>
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
    height: ${rm(180)};
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
        height: ${rm(285 * 0.75)};
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
        background-color: #F8F9FC !important;
    }

    .logo {
        display: flex;
        align-items: center;
        font-size: ${rm(16)};
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