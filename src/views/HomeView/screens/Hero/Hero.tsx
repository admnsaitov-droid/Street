import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import { AnimatedTranslate } from "@/components/animated/AnimatedTranslate/AnimatedTranslate"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import SkeletonVideo from "@/components/Skeleton/SkeletonVideo"
import { WhiteButton } from "@/components/Ui/buttons/WhiteButton"
import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import Image from "next/image"
import styled from "styled-components"

interface HeroProps {
    heroData: any
}

export const Hero = ({ heroData }: HeroProps) => {
    
    return (
        <StyledHero>
            <MediaComponent media={heroData?.mainVideo} className="hero-media" />
            <BackgroundProgressiveBlur>
            </BackgroundProgressiveBlur>
            <StyledContent>
                <div className="left">
                    <AnimatedText className="description">{heroData?.description}</AnimatedText>
                    <div className="divider" />
                    <StyledTitle>
                        <span className="first">{heroData?.title?.textFirst}</span>
                        <span className="second">{heroData?.title?.textSecond}</span>
                    </StyledTitle>
                </div>
                <AnimatedTranslate className="button">
                    <WhiteButton isSvg={true} onClick={() => {}}>
                        {heroData?.button?.text}
                    </WhiteButton>
                </AnimatedTranslate>
            </StyledContent>
        </StyledHero>
    )
}

const StyledHero = styled.div`
    ${heightLvh(100)};
    width: 100%;
    position: relative;
    padding: ${rm(50)};


    ${media.md`
        padding: ${rm(50)} ${rm(25)};              
    `}

    ${media.xsm`
        padding: ${rm(40)} ${rm(16)};              
    `}

    .hero-media {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-bottom-left-radius: ${rm(10)};
        border-bottom-right-radius: ${rm(10)};
        overflow: hidden;
    }

    .button{
        ${media.xsm`
            width: 100%;

            >:nth-child(1){
                width: 100%;
            }
        `}
    }
`

const StyledContent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    position: relative;
    z-index: 1;
    justify-content: space-between;


    ${media.md`
        flex-direction: column;
        gap: ${rm(50)};
        justify-content: flex-end;
        align-items: flex-start;
    `}

    ${media.xsm`
        gap: ${rm(30)};
    `}

    .left{
        display: flex;
        flex-direction: column;
        gap: ${rm(30)};

        ${media.xsm`
            gap: ${rm(20)};
        `}

        .description{
            font-size: ${rm(20)};
            width: ${rm(560)};
            line-height: 100%;
            ${fontGolosText(500)};
            color: ${colors.white100};
            text-transform: uppercase;

            ${media.lg`
                font-size: ${rm(18)};
                width: ${rm(490)};
            `}

            ${media.xsm`
                font-size: ${rm(14)};
                width: ${rm(287)};
            `}
        }

        .divider{
            height: 1px;
            width: ${rm(40)};
            background-color: ${colors.white100};
        }
    }
`

const StyledTitle = styled.div`
    font-size: ${rm(100)};
    line-height: 85%;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    width: ${rm(1300)};

    ${media.lg`
        font-size: ${rm(80)};
        width: ${rm(924)};
    `}

    ${media.md`
        font-size: ${rm(56)};
        width: ${rm(718)};
    `}

    ${media.xsm`
        font-size: ${rm(40)};
        width: 100%;
    `}

    .first{
        color: ${colors.white100};
        ${fontGolosText(600)};
    }

    .second{
        color: ${colors.red};
        ${fontSageGrotesk(400)};
    }
`

export const BackgroundProgressiveBlur = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    backdrop-filter: blur(100px);
    mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0) 100%);
    -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0) 100%);
    z-index: 1;
    border-bottom-left-radius: ${rm(10)};
    border-bottom-right-radius: ${rm(10)};
    overflow: hidden;

    ${media.xsm`
        display: none;
    `}
`