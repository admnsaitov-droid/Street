"use client"

import Image from "next/image"
import styled from "styled-components"
import { colors, media, rm } from "@/styles"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { useVideoPlayerStore } from "@/store/store"
import { useMemo, useRef, WheelEvent, Suspense, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Box, PerspectiveCamera } from "@react-three/drei"
import { ProductModel } from "./Scene/components/ProductModel"
import { heightLvh } from "@/styles/utils"

interface ProductGalleryProps {
    images?: any[]
    model3D?: any
    colors?: { name: string; color: string }[]
    accentColors?: { name: string; color: string }[]
    onOpenImage?: (url: string, gallery: string[]) => void
    activeImageUrl?: string | null
    onCloseImage?: () => void
}

export const ProductGallery = ({ images = [], model3D, colors = [], accentColors = [], onOpenImage, activeImageUrl = null, onCloseImage }: ProductGalleryProps) => {
    const { openImage, isOpen, contentType, content, closePlayer, nextImage, previousImage } = useVideoPlayerStore()
    const railRef = useRef<HTMLDivElement>(null)
    const thumbRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

    const galleryUrls = useMemo(() => images.map((img) => getMediaStrapiPath(img)), [images])

    const storeImageOpen = isOpen && contentType === 'image'
    const isSceneActive = onOpenImage
        ? !activeImageUrl
        : !storeImageOpen

    // Determine if an image is currently active (not 3D scene)
    const isImageActive = onOpenImage
        ? !!activeImageUrl
        : storeImageOpen

    // Get current image index
    const currentImageIndex = useMemo(() => {
        if (!isImageActive) return -1
        const currentUrl = onOpenImage ? activeImageUrl : content
        if (!currentUrl) return -1
        return galleryUrls.findIndex(url => url === currentUrl)
    }, [isImageActive, activeImageUrl, content, onOpenImage, galleryUrls])

    const canNavigate = isImageActive && galleryUrls.length > 1

    const sceneButtonRef = useRef<HTMLButtonElement>(null)

    // Scroll to center the active thumbnail or scene button
    useEffect(() => {
        if (!railRef.current) return

        const rail = railRef.current
        let targetButton: HTMLButtonElement | null = null

        // If scene is active, scroll to scene button
        if (isSceneActive && sceneButtonRef.current) {
            targetButton = sceneButtonRef.current
        } 
        // If an image is active, scroll to that thumbnail
        else if (currentImageIndex >= 0) {
            const currentUrl = onOpenImage ? activeImageUrl : content
            if (currentUrl) {
                targetButton = thumbRefs.current.get(currentUrl) || null
            }
        }

        if (!targetButton) return
        
        // Check if rail is horizontal (mobile) or vertical (desktop)
        const isHorizontal = rail.scrollWidth > rail.clientWidth && rail.scrollHeight <= rail.clientHeight
        
        if (isHorizontal) {
            // Horizontal scrolling (mobile)
            const buttonOffsetLeft = targetButton.offsetLeft
            const buttonWidth = targetButton.offsetWidth
            const railWidth = rail.clientWidth
            
            // Center the button in the rail viewport
            const targetScrollLeft = buttonOffsetLeft - (railWidth / 2) + (buttonWidth / 2)
            
            // Smooth scroll to center
            rail.scrollTo({
                left: Math.max(0, targetScrollLeft),
                behavior: 'smooth'
            })
        } else {
            // Vertical scrolling (desktop)
            const buttonOffsetTop = targetButton.offsetTop
            const buttonHeight = targetButton.offsetHeight
            const railHeight = rail.clientHeight
            
            // Center the button in the rail viewport
            const targetScrollTop = buttonOffsetTop - (railHeight / 2) + (buttonHeight / 2)
            
            // Smooth scroll to center
            rail.scrollTo({
                top: Math.max(0, targetScrollTop),
                behavior: 'smooth'
            })
        }
    }, [currentImageIndex, activeImageUrl, content, onOpenImage, isSceneActive])

    const handleOpenScene = () => {
        if (onOpenImage) {
            onCloseImage?.()
            return
        }
        if (isOpen) closePlayer()
    }

    const handleOpenImage = (url: string) => {
        if (onOpenImage) {
            onOpenImage(url, galleryUrls)
        } else {
            openImage(url, galleryUrls)
        }
    }

    const handlePreviousImage = () => {
        if (!canNavigate) return
        
        if (onOpenImage) {
            // Custom callback mode: find previous image
            const prevIndex = currentImageIndex === 0 ? galleryUrls.length - 1 : currentImageIndex - 1
            onOpenImage(galleryUrls[prevIndex], galleryUrls)
        } else {
            // Store mode: use store's previousImage
            previousImage()
        }
    }

    const handleNextImage = () => {
        if (!canNavigate) return
        
        if (onOpenImage) {
            // Custom callback mode: find next image
            const nextIndex = (currentImageIndex + 1) % galleryUrls.length
            onOpenImage(galleryUrls[nextIndex], galleryUrls)
        } else {
            // Store mode: use store's nextImage
            nextImage()
        }
    }

    const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
        const el = railRef.current
        if (!el) return
        const { scrollTop, scrollHeight, clientHeight } = el
        const atTop = scrollTop <= 0
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1
        const goingUp = e.deltaY < 0
        const goingDown = e.deltaY > 0

        // If we can scroll inside the rail, capture the wheel
        if ((goingUp && !atTop) || (goingDown && !atBottom)) {
            e.preventDefault()
            e.stopPropagation()
            el.scrollTop += e.deltaY
        }
    }

    return (
        <StyledWrapper style={{pointerEvents: isOpen ? 'auto' : 'none', userSelect: isOpen ? 'auto' : 'none'}}>
        <StyledRail ref={railRef} onWheel={handleWheel} aria-label="Product media thumbnails">
            <StyledThumbButton 
                ref={sceneButtonRef}
                $active={isSceneActive} 
                onClick={handleOpenScene} 
                aria-label="3D scene"
                is3d={true}
            >
                <div className="badge">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="20" height="20" rx="2" fill="white"/>
                    <g clip-path="url(#clip0_5291_11307)">
                    <path d="M7.0101 16.3233C4.83345 15.29 3.2701 13.1733 3.03345 10.6667H2.03345C2.37345 14.7733 5.80676 18 10.0001 18C10.1501 18 10.2934 17.9867 10.4401 17.9767L7.9001 15.4333L7.0101 16.3233ZM10.0001 2C9.8501 2 9.70676 2.01334 9.5601 2.02334L12.1001 4.56669L12.9868 3.68003C15.1668 4.71003 16.7301 6.82669 16.9668 9.33337H17.9668C17.6268 5.22666 14.1934 2 10.0001 2Z" fill="#0040DD"/>
                    <path d="M7.42944 12.8936C6.9876 12.8936 6.61593 12.8234 6.31444 12.683C6.01294 12.5375 5.78422 12.3322 5.62828 12.067C5.47753 11.8019 5.40216 11.4875 5.40216 11.1236H6.57174C6.57174 11.3887 6.63932 11.5862 6.77447 11.7162C6.90962 11.8461 7.12795 11.9111 7.42944 11.9111C7.71534 11.9111 7.92846 11.8487 8.06881 11.724C8.21436 11.594 8.28714 11.4121 8.28714 11.1782C8.28714 10.9338 8.21436 10.7493 8.06881 10.6246C7.92846 10.4998 7.71534 10.4374 7.42944 10.4374H6.91482V9.54854H7.42944C7.67895 9.54854 7.87128 9.49656 8.00644 9.39259C8.14159 9.28343 8.20916 9.11709 8.20916 8.89357C8.20916 8.70124 8.14419 8.5427 8.01423 8.41794C7.88428 8.29318 7.68935 8.23081 7.42944 8.23081C7.16433 8.23081 6.9668 8.29058 6.83685 8.41014C6.71209 8.5297 6.64972 8.70644 6.64972 8.94035H5.48013C5.48013 8.58168 5.55031 8.27759 5.69066 8.02808C5.8362 7.77337 6.05453 7.58104 6.34562 7.45108C6.63672 7.31593 6.99799 7.24835 7.42944 7.24835C7.86089 7.24835 8.22216 7.31333 8.51326 7.44328C8.80435 7.57324 9.02008 7.74998 9.16043 7.9735C9.30598 8.19702 9.37875 8.44913 9.37875 8.72983C9.37875 9.03652 9.29298 9.29643 9.12144 9.50955C8.9551 9.71748 8.73158 9.86563 8.45088 9.954C8.77316 10.0424 9.02008 10.1983 9.19162 10.4218C9.36835 10.6402 9.45672 10.9261 9.45672 11.2795C9.45672 11.5914 9.37355 11.8695 9.20721 12.1138C9.04607 12.3529 8.81475 12.5427 8.51326 12.683C8.21176 12.8234 7.85049 12.8936 7.42944 12.8936ZM10.4666 12.8V7.34192H12.3613C12.9123 7.34192 13.3828 7.44069 13.7726 7.63822C14.1625 7.83575 14.4588 8.12944 14.6615 8.5193C14.8694 8.90397 14.9734 9.3822 14.9734 9.954V10.1099C14.9734 10.6921 14.8668 11.1834 14.6537 11.5836C14.4406 11.9839 14.1313 12.288 13.7258 12.4959C13.3256 12.6986 12.8447 12.8 12.2833 12.8H10.4666ZM11.6284 11.8331H12.2054C12.4913 11.8331 12.7512 11.7785 12.9851 11.6694C13.219 11.5602 13.4061 11.3809 13.5465 11.1314C13.692 10.8767 13.7648 10.5362 13.7648 10.1099V9.954C13.7648 9.54854 13.6998 9.22625 13.5699 8.98714C13.4399 8.74282 13.2606 8.56869 13.0319 8.46472C12.8084 8.36076 12.5588 8.30878 12.2833 8.30878H11.6284V11.8331Z" fill="#0040DD"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_5291_11307">
                    <rect width="16" height="16" fill="#0040DD" transform="translate(2 2)"/>
                    </clipPath>
                    </defs>
                    </svg>
                </div>
            </StyledThumbButton>
            {images.map((img) => {
                const url = getMediaStrapiPath(img)
                const active = onOpenImage
                    ? !!activeImageUrl && activeImageUrl === url
                    : (!!content && contentType === 'image' && content === url)
                return (
                    <StyledThumbButton 
                        key={img?.id || url} 
                        $active={active} 
                        onClick={() => handleOpenImage(url)}
                        ref={(el) => {
                            if (el) {
                                thumbRefs.current.set(url, el)
                            } else {
                                thumbRefs.current.delete(url)
                            }
                        }}
                    >
                        <Image src={url} alt={img?.alternativeText || img?.name || "Product image"} fill />
                    </StyledThumbButton>
                )
            })}
        </StyledRail>
        {canNavigate && (
            <StyledNavigationContainer>
                <StyledNavButton onClick={handlePreviousImage} aria-label="Previous image">
                    <ChevronLeftIcon />
                </StyledNavButton>
                <StyledNavButton onClick={handleNextImage} aria-label="Next image">
                    <ChevronRightIcon />
                </StyledNavButton>
            </StyledNavigationContainer>
        )}
    </StyledWrapper>
    )
}

const StyledWrapper = styled.div`
    position: absolute;
    ${heightLvh(100)};
    width: 100%;
    overflow: hidden;
    top: 0;
    left: 0;
    z-index: 50;
`

const StyledRail = styled.div`
    position: absolute;
    right: ${rm(16)};
    top: 50%;
    transform: translateY(-30%);
    display: flex;
    flex-direction: column;
    gap: ${rm(8)};
    z-index: 30; /* above overlay to allow clicking while image is open */
    max-height: ${rm(432)};
    overflow-y: auto;
    padding-right: ${rm(4)}; /* space for scrollbar */
    pointer-events: auto; /* ensure wheel events are captured */
    touch-action: pan-y; /* allow vertical touch scrolling */
    -webkit-overflow-scrolling: touch; /* smooth iOS scrolling */
    overscroll-behavior: contain; /* prevent page from hijacking scroll */

    /* Subtle, minimal scrollbar */
    &::-webkit-scrollbar { width: ${rm(6)}; }
    &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: ${rm(4)}; }
    &::-webkit-scrollbar-track { background: transparent; }

    ${media.md`
        right: ${rm(12)};
        gap: ${rm(8)};
        max-height: ${rm(432)};
    `}

    ${media.xsm`
        /* Mobile: bottom rail */
        // right: auto;
        // left: 50%;
        // top: auto;
        // bottom: ${rm(20)};
        // transform: translateX(-50%);
        // flex-direction: row;
        // gap: ${rm(8)};
        // max-height: none;
        // max-width: calc(100% - ${rm(16)});
        // overflow-y: hidden;
        // overflow-x: auto;
        touch-action: pan-y;
        right: 0;
        max-height: ${rm(270)};
        gap: ${rm(5)};
    `}
`

const StyledThumbButton = styled.button<{ $active?: boolean, is3d?: boolean }>`
    width: ${rm(80)};
    height: ${rm(80)};
    min-width: ${rm(80)};
    min-height: ${rm(80)};
    flex: 0 0 auto; /* keep fixed size inside scrollable flex column */
    border-radius: ${rm(4)};
    overflow: hidden;
    position: relative;
    border: 2px solid ${({ $active }) => ($active ? colors.blue : 'white')};
    background: ${({ is3d }) => is3d ? colors.white100 : '#EAECF2'};
    cursor: pointer;
    padding: 0;

    img{ object-fit: cover; }

    canvas{ pointer-events: none; }

    .badge{
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translate(50%, -50%);
        background: ${colors.white100};
        overflow: hidden;
        color: ${colors.blue};
        font-size: ${rm(12)};
        line-height: 1;
        border-radius: ${rm(4)};
        z-index: 1;
        width: ${rm(40)};
        height: ${rm(40)};

        ${media.xsm`
            width: ${rm(24)};
            height: ${rm(24)};
        `}

        svg{
            width: 100%;
            height: 100%;
        }
    }

    ${media.md`
        width: ${rm(80)};
        height: ${rm(80)};
        min-width: ${rm(80)};
        min-height: ${rm(80)};
        border-radius: ${rm(4)};
    `}

    ${media.xsm`
        width: ${rm(50)};
        height: ${rm(50)};
        min-width: ${rm(50)};
        min-height: ${rm(50)};
        border-radius: ${rm(4)};
    `}
`

const ChevronLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const ChevronRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const StyledNavigationContainer = styled.div`
    position: absolute;
    bottom: ${rm(50)};
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: ${rm(6)};
    align-items: center;
    padding: ${rm(6)};
    background: #FFFFFF66;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: ${rm(4)};
    z-index: 1000;
    pointer-events: auto;

    ${media.xsm`
        bottom: ${rm(12)};
        padding: ${rm(6)};
        gap: ${rm(6)};
        border-radius: ${rm(4)};
    `}
`

const StyledNavButton = styled.button`
    width: ${rm(44)};
    height: ${rm(44)};
    min-width: ${rm(44)};
    min-height: ${rm(44)};
    border-radius: ${rm(4)};
    background: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: #000;
    padding: 0;

    &:hover {
        transform: scale(1.05);
        background: rgba(255, 255, 255, 0.95);
    }

    &:active {
        transform: scale(0.95);
    }

    svg {
        width: ${rm(24)};
        height: ${rm(24)};
    }

    ${media.xsm`
        // width: ${rm(40)};
        // height: ${rm(40)};
        // min-width: ${rm(40)};
        // min-height: ${rm(40)};
        border-radius: ${rm(4)};

        // svg {
        //     width: ${rm(18)};
        //     height: ${rm(18)};
        // }
    `}
`


