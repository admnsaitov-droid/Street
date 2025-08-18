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

interface SwiperBlockProps {
    images?: any[]
}

export const SwiperBlock = ({ images }: SwiperBlockProps) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const swiperRef = useRef<SwiperType | null>(null)

    const hasImages = Array.isArray(images) && images.length > 0

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
                <StyledTitle>
                    <span className="first">Built to perform</span>
                    <span>Show in use</span>
                </StyledTitle>
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

    .buttonsBlock{
        display: flex;
        gap: ${rm(5)};
    }
`

const StyledSwiperButton = styled.div<{side: 'left' | 'right'}>`
    padding: ${rm(12)};
    background-color: #F8F9FC;
    border-radius: ${rm(4)};
    cursor: pointer;

    transition: background-color 0.3s ease-in-out;

    &:hover{
        background-color:rgb(150, 156, 161);
    }

    svg{
        width: ${rm(24)};
        height: ${rm(24)};
        margin-bottom: ${rm(-3)};
        transform: ${({ side }) => side === 'right' ? 'rotate(180deg)' : 'none'};
    }
`


const StyledTitle = styled.p`
    width: ${rm(600)};
    margin-bottom: ${rm(20)};
    
    ${media.lg`
        width: ${rm(550)};
    `}

    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    ${fontGolosText(600)};
    color: ${colors.black100};

    ${media.lg`
        font-size: ${rm(40)};
    `}

    .first{
        ${fontSageGrotesk(400)} !important;
        color: ${colors.red} !important;
        margin-right: ${rm(10)};
        letter-spacing: -0.02em;
    }
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

    .image{
        width: 100%;
        height: 100%;
    }
`