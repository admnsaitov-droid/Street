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
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { useInView, useSpring, animated, easings } from '@react-spring/web';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useWindowWidth } from "@react-hook/window-size";

interface LatestNewsProps {
    latestNewsData: any
}

// Individual animated slide component
const AnimatedSlide = ({ children, index, isInView }: { children: React.ReactNode, index: number, isInView: boolean }) => {
    const slideSpring = useSpring({
        y: isInView ? '0%' : '-40%',
        delay: index * 150, // Staggered delay: 0ms, 150ms, 300ms, etc.
        config: {
            tension: 120,
            friction: 40
        }
    });

    return (
        <AnimatedSlideWrapper style={slideSpring}>
            {children}
        </AnimatedSlideWrapper>
    );
};

export const LatestNews = ({ latestNewsData }: LatestNewsProps) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const width = useWindowWidth()
    
    // Detect when swiper container is in view
    const [swiperInViewRef, swiperInView] = useInView({
        once: true
    });

    const [buttonsInViewRef, buttonsInView] = useInView({
        once: true
    });

    const buttonsSpring = useSpring({
        y: buttonsInView ? '0%' : '-100%',
        config: {
            tension: 300,
            friction: 35,
            mass: 0.7,
            duration: 700,
            easing: easings.easeOutQuart,
        }
    });

    const newsMobile = latestNewsData?.articles?.slice(0, 3)
    
    // Calculate if there are enough slides to enable swiping
    const articlesCount = latestNewsData?.articles?.length || 0
    const slidesPerView = width > 768 ? 4 : 3
    const canSwipe = articlesCount > slidesPerView

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
                <StyledTitleContainer>
                    <h2>
                        <AnimatedGrid
                            tag="span"
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
                                        color: colors.black100,
                                        fontFamily: 'var(--font-golos-text)',
                                        fontOpticalSizing: 'auto',
                                        fontWeight: 600,
                                        fontStyle: 'normal',
                                    }
                                },
                                'title-second': {
                                    style: {
                                        color: colors.red,
                                        fontFamily: 'var(--font-sage-grotesk)',
                                        fontOpticalSizing: 'auto',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        lineHeight: '105%',
                                    }
                                }
                            }}
                        >
                            <span id="title-first">{latestNewsData?.title?.textFirst}</span>
                            <span id="title-second" className="first">{latestNewsData?.title?.textSecond}</span>
                        </AnimatedGrid>
                    </h2>
                </StyledTitleContainer>
                <div style={{display: 'flex', alignItems: 'center', minWidth: 'fit-content', position: 'relative', overflow: 'hidden'}} ref={buttonsInViewRef}>
                    <animated.div style={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content', ...buttonsSpring }}>
                        {canSwipe && (
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
                        )}
                        {width > 576 && <BlueButton isSvg={false} link={latestNewsData?.button?.link}>
                            {latestNewsData?.button?.text}
                        </BlueButton>}
                    </animated.div>
                </div>
            </StyledTopBar>
            {width > 576 && <StyledSwiperContainer ref={swiperInViewRef}>
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
                    {latestNewsData?.articles?.map((article: any, index: number) => (
                        <SwiperSlide key={article?.id}>
                            <AnimatedSlide index={index} isInView={swiperInView}>
                                <ArticleCard article={article} />
                            </AnimatedSlide>
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

        >:nth-child(2) .dividerMain{
            display: none;
        }
    `}
`

const StyledTopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${rm(40)};
`

const StyledTitleContainer = styled.div`
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    width: 100%;

    ${media.lg`
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
    `}

    h2 {
        margin: 0;
        padding: 0;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        color: inherit;
        text-transform: inherit;
        font-family: inherit;
        
        span#title-second::before,
        span.first::before {
            content: ' ';
            white-space: pre;
        }
    }
`

const StyledSwipeButtonContainer = styled(animated.div)`
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
    overflow: hidden;
    
    .swiper {
        width: 100%;
        padding-bottom: ${rm(40)};
    }

    .swiper-slide {
        height: auto;
        overflow: hidden;
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

const AnimatedSlideWrapper = styled(animated.div)`
    width: 100%;
    height: 100%;
    overflow: hidden;
`