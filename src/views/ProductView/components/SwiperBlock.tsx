"use client"

import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { fontSageGrotesk } from "@/styles/fonts"
import styled from "styled-components"
import Image from "next/image"
import { useRef, useState } from "react"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import AnimatedGrid from "@/components/animated/AnimatedContent"

interface SwiperBlockProps {
    images?: any[]
    title?: any
}

export const SwiperBlock = ({ images, title }: SwiperBlockProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const swiperRef = useRef<SwiperType | null>(null)

    const hasImages = Array.isArray(images) && images.length > 0
    const canSwipe = hasImages && images.length > 1

    const handlePrev = () => {
        if (!hasImages) return
        swiperRef.current?.slidePrev()
    }

    const handleNext = () => {
        if (!hasImages) return
        swiperRef.current?.slideNext()
    }

    return (
        <StyledSwiperBlock>
            <StyledTop>
                <StyledTitleContainer>
                    <AnimatedGrid
                        type="words"
                        animation={{
                            from: { opacity: 0, y: '40px' },
                            to: { opacity: 1, y: '0px' },
                            delayStep: 60
                        }}
                        overflow={true}
                        gap={{ horizontal: '0.25em', vertical: '0.25em' }}
                        containerStyle={{ overflow: 'hidden' }}
                        cellConfigs={{
                            'title-first': {
                                style: {
                                    color: colors.red,
                                    fontFamily: 'var(--font-sage-grotesk)',
                                    fontOpticalSizing: 'auto',
                                    fontWeight: 400,
                                    fontStyle: 'normal',
                                    lineHeight: '105%',
                                }
                            },
                            'title-second': {
                                style: {
                                    color: colors.black100,
                                    fontFamily: 'var(--font-golos-text)',
                                    fontOpticalSizing: 'auto',
                                    fontWeight: 600,
                                    fontStyle: 'normal',
                                }
                            }
                        }}
                    >
                        <span id="title-first" className="first">{title?.textFirst}</span>
                        <span id="title-second">{title?.textSecond}</span>
                    </AnimatedGrid>
                </StyledTitleContainer>
                {canSwipe && (
                    <div className="buttonsBlock">
                        <StyledSwiperButton side="left" onClick={handlePrev} aria-label="Previous slide">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 6L9 12L15 18" stroke="black" stroke-width="2"/>
                            </svg>
                        </StyledSwiperButton>
                        <StyledSwiperButton side="right" onClick={handleNext} aria-label="Next slide">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 6L9 12L15 18" stroke="black" stroke-width="2"/>
                            </svg>
                        </StyledSwiperButton>
                    </div>
                )}
            </StyledTop>
            {hasImages && (
                <StyledViewport aria-label="Product images">
                    <Swiper
                        slidesPerView="auto"
                        spaceBetween={12}
                        onSwiper={(swiper) => { swiperRef.current = swiper }}
                        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                   >
                        {images!.map((image, index) => (
                            <SwiperSlide key={index} style={{ width: 'auto' }}>
                                <StyledSwiperSlideContainer>
                                    <MediaComponent media={image} className="image" />
                                </StyledSwiperSlideContainer>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </StyledViewport>
            )}
        </StyledSwiperBlock>
    )
}

const StyledSwiperBlock = styled.div`
    width: 100%;
`

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${rm(0)} ${rm(50)};
    margin-bottom: ${rm(50)};

    ${media.md`
        padding: ${rm(0)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(0)} ${rm(16)};
        margin-bottom: ${rm(30)};
    `}

    .buttonsBlock{
        display: flex;
        gap: ${rm(5)};

        ${media.xsm`
            display: none;
        `}
    }
`

const StyledSwiperButton = styled.div<{side: 'left' | 'right', disabled?: boolean}>`
    padding: ${rm(12)};
    background-color: #F8F9FC;
    border-radius: ${rm(4)};
    cursor: pointer;

    transition: background-color 0.3s ease-in-out;

    &:hover{
        background-color: ${colors.blue};
        opacity: 1 !important;
    }

    svg{
        width: ${rm(24)};
        height: ${rm(24)};
        margin-bottom: ${rm(-3)};
        transform: ${({ side }) => side === 'right' ? 'rotate(180deg)' : 'none'};
    }
`


const StyledTitleContainer = styled.div`
    width: ${rm(600)};
    margin-bottom: ${rm(20)};
    
    ${media.lg`
        width: ${rm(550)};
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
        width: 100%;
    `}

    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
`

const StyledViewport = styled.div`
    width: 100%;
`

const StyledSwiperSlideContainer = styled.div`
    flex: 0 0 auto;
    width: clamp(${rm(220)}, 32vw, ${rm(552)});
    height: ${rm(414)};
    position: relative;
    scroll-snap-align: start;
    margin-bottom: ${rm(150)};

    ${media.md`
        width: ${rm(354)};
        height: ${rm(266)};
    `}

    ${media.xsm`
        height: ${rm(328)};
        width: ${rm(246)};
    `}

    .image{
        width: 100%;
        height: 100%;
    }
`