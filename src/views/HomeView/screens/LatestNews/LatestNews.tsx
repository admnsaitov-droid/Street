import { fontGolosText, fontSageGrotesk } from "@/styles/fonts";
import { colors } from "@/styles/colors";
import styled from "styled-components"
import { media, rm } from "@/styles";
import { BlueButton } from "@/components/Ui/buttons/BlueButton";
import { ArticleCard } from "./components/ArticleCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useWindowWidth } from "@react-hook/window-size";

interface LatestNewsProps {
    latestNewsData: any
}

export const LatestNews = ({ latestNewsData }: LatestNewsProps) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const width = useWindowWidth()

    const newsMobile = latestNewsData?.articles?.slice(0, 3)

    const handlePrevClick = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleNextClick = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const handleSlideChange = (swiper: SwiperType) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (
        <StyledLatestNews>
            <StyledTopBar>
                <StyledTitle>
                    <span>{latestNewsData?.title?.textFirst}</span>
                    <span className="first">{latestNewsData?.title?.textSecond}</span>
                </StyledTitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StyledSwipeButtonContainer>
                        <StyledSwipeButton 
                            onClick={handlePrevClick}
                            disabled={isBeginning}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 6L9 12L15 18" stroke="black" strokeWidth="2"/>
                            </svg>
                        </StyledSwipeButton>
                        <StyledSwipeButton 
                            onClick={handleNextClick}
                            disabled={isEnd}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6L15 12L9 18" stroke="black" strokeWidth="2"/>
                            </svg>
                        </StyledSwipeButton>
                    </StyledSwipeButtonContainer>
                    {width > 576 && <BlueButton isSvg={false} link={latestNewsData?.button?.link}>
                        {latestNewsData?.button?.text}
                    </BlueButton>}
                </div>
            </StyledTopBar>
            {width > 576 && <StyledSwiperContainer>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={width > 768 ? 4 : 3}
                    navigation={false}
                    pagination={{ clickable: true }}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    onSlideChange={handleSlideChange}
                    breakpoints={{
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        1440: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        }
                    }}
                >
                    {latestNewsData?.articles?.map((article: any) => (
                        <SwiperSlide key={article?.id}>
                            <ArticleCard article={article} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </StyledSwiperContainer>}
            <StyledNewsMobile>
                {newsMobile?.map((article: any, index: number) => (
                    <ArticleCard key={index} article={article} />
                ))}
            </StyledNewsMobile>
            {width <= 576 && <BlueButton isSvg={false} link={latestNewsData?.button?.link} className="mobile-button">
                {latestNewsData?.button?.text}
            </BlueButton>}
        </StyledLatestNews>
    )
}

const StyledLatestNews = styled.div`
    width: 100%;
    padding: ${rm(150)} ${rm(50)};

    ${media.md`
        padding: ${rm(150)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(70)} ${rm(16)};
    `}

    .mobile-button{
        width: 100%;
        margin-top: ${rm(30)};
    }
`

const StyledNewsMobile = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    display: none;

    ${media.xsm`
        display: flex;
    `}
`

const StyledTopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${rm(40)};
`

const StyledTitle = styled.p`
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    ${fontGolosText(600)};
    color: ${colors.black100};
    gap: ${rm(10)};
    display: flex;

    ${media.lg`
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
    `}

    .first{
        ${fontSageGrotesk(400)} !important;
        color: ${colors.red} !important;
        letter-spacing: -0.02em;
        line-height: 105%;
    }
`

const StyledSwipeButtonContainer = styled.div`
    display: flex;
    gap: ${rm(5)};
    margin-right: ${rm(10)};

    ${media.xsm`
        display: none;
    `}
`

const StyledSwipeButton = styled.button<{ disabled?: boolean }>`
    padding: ${rm(12)};
    background-color: #F8F9FC;
    cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
    border: none;
    transition: opacity 0.3s ease;
    opacity: ${({ disabled }) => disabled ? 0.5 : 1};

    &:hover {
        opacity: ${({ disabled }) => disabled ? 0.5 : 0.8};
    }

    svg{
        width: ${rm(24)};
        height: ${rm(24)};
    }
`

const StyledSwiperContainer = styled.div`
    .swiper {
        width: 100%;
        padding-bottom: ${rm(40)};
    }

    .swiper-slide {
        height: auto;
    }

    .swiper-pagination {
        bottom: 0;
    }

    .swiper-pagination-bullet {
        width: ${rm(8)};
        height: ${rm(8)};
        background-color: ${colors.gray};
        opacity: 0.5;
        transition: opacity 0.3s ease;
    }

    .swiper-pagination-bullet-active {
        opacity: 1;
        background-color: ${colors.black100};
    }
`