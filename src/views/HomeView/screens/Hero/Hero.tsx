import AnimatedGrid from "@/components/animated/AnimatedContent"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import { AnimatedTranslate } from "@/components/animated/AnimatedTranslate/AnimatedTranslate"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import SkeletonVideo from "@/components/Skeleton/SkeletonVideo"
import { WhiteButton } from "@/components/Ui/buttons/WhiteButton"
import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { useWindowWidth } from "@react-hook/window-size"
import Image from "next/image"
import styled from "styled-components"

interface HeroProps {
    heroData: any
}

export const Hero = ({ heroData }: HeroProps) => {
    const width = useWindowWidth()

    return (
        <StyledHero>
            <MediaComponent media={heroData?.mainVideo} className="hero-media" isExtendable={false}/>
            {width <= 768 && (
                <StyledMobileBackgroundViewoContainer />
            )}
            <BackgroundProgressiveBlur/>
            <StyledContent>
                <div className="left">
                    <AnimatedText className="description" tag="p">{heroData?.description}</AnimatedText>
                    <div className="divider" />
                    <StyledTitleContainer>
                        <h1>
                            <AnimatedGrid
                                tag="span"
                                type="words"
                                animation={{
                                    from: { opacity: 0, y: '40px' },
                                    to: { opacity: 1, y: '0px' },
                                    delayStep: 60
                                }}
                                overflow={true}
                                gap={{ horizontal: '0.5em', vertical: '0em' }}
                                containerStyle={{ overflow: 'hidden' }}
                                cellConfigs={{
                                    'title-first': {
                                        style: {
                                            color: colors.white100,
                                            fontFamily: 'var(--font-golos-text)',
                                            fontOpticalSizing: 'auto',
                                            fontWeight: 600,
                                            fontStyle: 'normal',
                                            lineHeight: '85%',
                                        }
                                    },
                                    'title-second': {
                                        style: {
                                            color: colors.red,
                                            fontFamily: 'var(--font-sage-grotesk)',
                                            fontOpticalSizing: 'auto',
                                            fontWeight: 400,
                                            fontStyle: 'normal',
                                            lineHeight: '85%',
                                        }
                                    }
                                }}
                            >
                                <span id="title-first" className="first">{heroData?.title?.textFirst}</span>
                                <span id="title-second" className="second">{heroData?.title?.textSecond}</span>
                        </AnimatedGrid>
                    </h1>
                    </StyledTitleContainer>
                </div>
                <AnimatedTranslate className="button">
                    <WhiteButton isSvg={true} link={heroData?.button?.link}>
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

const StyledTitleContainer = styled.div`
    font-size: ${rm(100)};
    line-height: 85%;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    width: ${rm(1100)};

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

    h1 {
        margin: 0;
        padding: 0;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        color: inherit;
        text-transform: inherit;
        font-family: inherit;

        > span > span > span {
            align-items: baseline;
        }
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
`

export const StyledMobileBackgroundViewoContainer = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: ${colors.black100};
    opacity: 0.3;
    display: none;
    border-bottom-left-radius: ${rm(10)};
    border-bottom-right-radius: ${rm(10)};
    overflow: hidden;
    

    ${media.xsm`
        display: block;
    `}
`