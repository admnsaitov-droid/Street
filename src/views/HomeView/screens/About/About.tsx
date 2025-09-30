import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText";
import { ScaleImageAppear } from "@/components/animated/ScaleImageAppear/ScaleImageAppear";
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { BlueButton } from "@/components/Ui/buttons/BlueButton";
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";
import Image from "next/image";
import styled from "styled-components"

interface AboutProps {
    aboutData: any
}

export const About = ({ aboutData }: AboutProps) => {
    return (
        <StyledAbout>
            <StyledTopContainer>
                <AnimatedText className="title" tag="h2">{aboutData?.title}</AnimatedText>
                <div className="right">
                    <AnimatedText className="descriptionMain" tag="p">{aboutData?.description}</AnimatedText>
                    <div className="bottom">
                        <AnimatedText className="descriptionSecondary" tag="p">{aboutData?.descriptionSecondary}</AnimatedText>
                        <BlueButton link={aboutData?.button?.link} isSvg className="button">{aboutData?.button?.text}</BlueButton>
                    </div>
                </div>
            </StyledTopContainer>
            <StyledBottomContainer>
                <ScaleImageAppear className="image-container">
                    <MediaComponent media={aboutData?.media} className="image" parallax={true} isExtendable={false} />
                </ScaleImageAppear>
            </StyledBottomContainer>
        </StyledAbout>
    )
}

const StyledAbout = styled.div`
    width: 100%;
    padding: ${rm(150)} ${rm(50)};

    ${media.md`
        padding: ${rm(150)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(70)} ${rm(16)};
    `}
`

const StyledTopContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(30)};
    `}
    

    .title{
        color: ${colors.gray};
        font-size: ${rm(20)};
        line-height: 110%;
        letter-spacing: -0.01em;
        ${fontGolosText(400)};
        text-transform: uppercase;
        height: fit-content !important;
        
        ${media.lg`
            font-size: ${rm(16)};
        `}

        ${media.xsm`
            font-size: ${rm(14)};
        `}
    }

    .right{
        display: flex;
        flex-direction: column;
        gap: ${rm(20)};
        width: ${rm(1100)};

        ${media.lg`
            width: ${rm(890)};
        `}

        ${media.md`
            width: ${rm(475)};
        `}

        ${media.xsm`
            width: 100%;
        `}

        .descriptionMain{
            color: ${colors.black100};
            font-size: ${rm(40)};
            line-height: 115%;
            letter-spacing: -0.01em;
            ${fontGolosText(400)};

            span:nth-child(1){
                >:nth-child(1){
                    padding-left: ${rm(113)} !important;
                }
            }
            
            ${media.lg`
                font-size: ${rm(32)};
            `}

            ${media.md`
                font-size: ${rm(24)};
                
                span:nth-child(1){
                    >:nth-child(1){
                        padding-left: ${rm(0)} !important;
                    }
                }
            `}

            ${media.xsm`
                font-size: ${rm(20)};
            `}
        }

        .bottom{
            display: flex;
            justify-content: space-between;
            padding-left: ${rm(113)};
            align-items: flex-end;

            ${media.md`
                padding-left: 0;
                flex-direction: column;
                gap: ${rm(30)};
                align-items: flex-start;
            `}


            .descriptionSecondary{
                color: ${colors.gray};
                font-size: ${rm(20)};
                line-height: 130%;
                ${fontGolosText(400)};
                width: ${rm(600)};

                ${media.lg`
                    font-size: ${rm(16)};
                    width: ${rm(455)};
                `}

                ${media.md`
                    width: 100%;    
                `}

                ${media.xsm`
                    font-size: ${rm(14)};
                `}
            }

            >:nth-child(2){
                ${media.xsm`
                    width: 100%;
                    margin-top: ${rm(-10)};
                `}
            }
        }
    }
`   

const StyledBottomContainer = styled.div`
    width: 100%;
    height: ${rm(800)};
    border-radius: ${rm(10)};
    overflow: hidden;
    position: relative;
    margin-top: ${rm(40)};

    ${media.lg`
        height: ${rm(600)};
    `}

    ${media.md`
        height: ${rm(576)};
    `}

    ${media.xsm`
        height: ${rm(246)};
    `}

    .image-container{
        width: 100%;
        height: 100%;

        >:nth-child(1){
            position: relative;
            border-radius: ${rm(10)};
            overflow: hidden;
        }
    }

    img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`