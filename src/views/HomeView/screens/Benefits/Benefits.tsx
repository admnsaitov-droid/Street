import { AnimatedDivider } from "@/components/animated/AnimatedDivider/AnimatedDivider"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import { MaskImageAppear } from "@/components/animated/MaskImageAppear/MaskImageAppear"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import Image from "next/image"
import styled from "styled-components"
import { useWindowWidth } from "@react-hook/window-size"

interface BenefitsProps {
    benefitsData: any
}

export const Benefits = ({ benefitsData }: BenefitsProps) => {

    const width = useWindowWidth()

    return (
        <StyledBenefits>
            <div className="left">
                <MaskImageAppear className="image-container" enabled={false}>
                    <MediaComponent media={benefitsData?.media} className="image" parallax={false} isExtendable={false} />
                </MaskImageAppear>
            </div>
            <div className="right">
                <div className="main">
                    <AnimatedText className="title" tag="h2">{benefitsData?.title}</AnimatedText>
                    <AnimatedText className="description" tag="p">{benefitsData?.description}</AnimatedText>
                </div>
                <StyledBenefitsContainer>
                    {benefitsData?.benefits?.map((benefit: any, index: number) => (
                        <StyledBenefit key={benefit?.id}>
                            <div className="dividerMain"></div>
                            <AnimatedText className="count">{`0${index + 1}`}</AnimatedText>
                            <div className="divider">
                                <AnimatedDivider/>
                            </div>
                            <AnimatedText className="benefit">{benefit?.benefit}</AnimatedText>
                        </StyledBenefit>
                    ))}
                </StyledBenefitsContainer>
            </div>
        </StyledBenefits>
    )
}

const StyledBenefits = styled.div`
    width: 100%;
    display: flex;
    background-color: ${colors.blue};

    ${media.md`
        flex-direction: column;
    `}

    ${media.xsm`
        border-radius: ${rm(10)};
        overflow: hidden;
    `}

    .left{
        width: 50%;
        height: auto;
        position: relative;
        border-top-right-radius: ${rm(10)};
        border-bottom-right-radius: ${rm(10)};
        overflow: hidden;
        
        ${media.md`
            width: 100%;
            height: ${rm(576)};
        `}

        ${media.xsm`
            height: ${rm(370)};
            border-bottom-left-radius: ${rm(10)};
        `}

        .image-container{
            position: relative;
            width: 100%;
            height: 100%;

            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }

    .right{
        padding: ${rm(100)} ${rm(120)};
        padding-right: ${rm(162)};
        display: flex;
        flex-direction: column;
        gap: ${rm(56)};
        width: 50%;

        ${media.md`
            width: 100%;
            padding: ${rm(100)} ${rm(25)};
        `}

        ${media.xsm`
            padding: ${rm(70)} ${rm(16)};
        `}

        .main{
            display: flex;
            flex-direction: column;
            gap: ${rm(20)};

            .title{
                ${fontSageGrotesk(400)};
                line-height: 90%;
                letter-spacing: -0.02em;
                color: ${colors.white100};
                font-size: ${rm(48)};
                text-transform: uppercase;

                ${media.lg`
                    font-size: ${rm(40)};    
                `}

                ${media.xsm`
                    font-size: ${rm(32)};
                `}
            }

            .description{
                ${fontGolosText(400)};
                line-height: 130%;
                color: ${colors.blue90};
                font-size: ${rm(20)};

                ${media.lg`
                    font-size: ${rm(16)};    
                `}

                ${media.md`
                    width: ${rm(340)};    
                `}

                ${media.xsm`
                    font-size: ${rm(14)};
                    width: 100%;
                `}
            }
        }
    }
`

const StyledBenefitsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    row-gap: ${rm(40)};
    column-gap: ${rm(20)};

    ${media.md`
        row-gap: ${rm(40)};
        column-gap: ${rm(130)};
    `}

    ${media.xsm`
        row-gap: ${rm(30)};
        column-gap: ${rm(8)};
    `}
`

const StyledBenefit = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(15)};
    width: 45%;

    ${media.md`
        width: ${rm(233)};
    `}

    ${media.xsm`
        width: 48.7%;
    `}

    .dividerMain{
        margin-bottom: ${rm(15)};
        width: 100%;
        height: 1px;
        background: repeating-linear-gradient(
            to right,
            ${colors.blue90} 0,
            ${colors.blue90} 1px,
            transparent 1px,
            transparent 5px
        );
        background-size: auto;
        border: none;
        position: relative;
    }
    
    .count{
        font-size: ${rm(48)};
        ${fontSageGrotesk(400)};
        color: ${colors.white100};
        line-height: 90%;
        letter-spacing: -0.02em;
        
        ${media.lg`
            font-size: ${rm(40)};
        `}

        ${media.xsm`
            font-size: ${rm(32)};
        `}
    }

    .divider{
        width: ${rm(40)};
        height: 2px;

        div{
            background-color: ${colors.blue90};
        }
    }

    .benefit{
       font-size: ${rm(20)};
       ${fontGolosText(400)};
       color: ${colors.white100};
       line-height: 130%;

       ${media.lg`
            font-size: ${rm(16)};
       `}

       ${media.xsm`
            font-size: ${rm(14)};
            width: 95%;
       `}
    }
`