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
import { useWindowWidth } from "@react-hook/window-size"
import { StyledMobileBackgroundViewoContainer } from "@/views/HomeView/screens/Hero/Hero"

interface HeroProps {
    data: any
}

export const Hero = ({ data }: HeroProps) => {
    const width = useWindowWidth()
    return (
        <StyledHero>
            <MediaComponent media={data?.media} className="image" parallax={true} isExtendable={false} priority={true} />
            {width <= 768 && (
                <StyledMobileBackgroundViewoContainer/>
            )}
            {width > 768 && (
                <BackgroundProgressiveBlur/>
            )}
            <StyledContent>
                <div className="left">
                    <AnimatedText className="description">{data?.description}</AnimatedText>
                    <div className="divider" />
                    <StyledTitle className="title" tag="h1">
                        {data?.title}
                    </StyledTitle>
                </div>
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

    .image{
        width: 100%;
        height: 100%;
        border-bottom-left-radius: ${rm(10)};
        border-bottom-right-radius: ${rm(10)};
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
    }
`


export const StyledTitle = styled(AnimatedText)`
    font-size: ${rm(100)};
    line-height: 85%;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    ${fontGolosText(600)};
    color: ${colors.black100};
    height: fit-content;
    
    ${media.lg`
        font-size: ${rm(80)};
    `}

    ${media.md`
        font-size: ${rm(56)};
    `}

    ${media.xsm`
        font-size: ${rm(40)};
    `}
`


const StyledContent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    position: relative;
    z-index: 1;
    justify-content: space-between;

    .left{
        display: flex;
        flex-direction: column;
        gap: ${rm(30)};

        ${media.xsm`
            gap: ${rm(20)};
        `}

        .title{
            color: ${colors.white100};
            margin-top: 0;
        }

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

    ${media.xsm`
        display: none;
    `}
`