import styled from "styled-components"
import { StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { ScaleImageAppear } from "@/components/animated/ScaleImageAppear/ScaleImageAppear"

interface InspirationProps {
    data: any
}

export const Inspiration = ({ data }: InspirationProps) => {
    return (
        <StyledInspiration>
            <StyledTopContainer>
                <StyledAboutTitleContainer>
                    <h2>
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
                                },
                                'title-third': {
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
                            <span id="title-first">{data?.title?.firstWord}</span>
                            <span id="title-second" className="first">{data?.title?.secondWord}</span>
                            <span id="title-third">{data?.title?.thirdWord}</span>
                        </AnimatedGrid>
                    </h2>
                </StyledAboutTitleContainer>
                <div className="right">
                    <StyledSubtitle>
                        {data?.descriptionFirst}
                    </StyledSubtitle>
                    <StyledSubtitle>
                        {data?.descriptionSecond}
                    </StyledSubtitle>
                </div>
            </StyledTopContainer>
            <StyledMediaContainer>
                <ScaleImageAppear className="image-container">
                    <MediaComponent media={data?.media} className="image" parallax={true} isExtendable={false} />
                </ScaleImageAppear>
            </StyledMediaContainer>
        </StyledInspiration>
    )
}

const StyledInspiration = styled.div`
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
    margin-bottom: ${rm(50)};

    ${media.md`
        flex-direction: column;
        gap: ${rm(40)};
    `}

    ${media.xsm`
        gap: ${rm(15)};
        margin-bottom: ${rm(30)};
    `}

    .right{
        display: flex;
        gap: ${rm(10)};

        ${media.xsm`
            flex-direction: column;
        `}

        >:nth-child(1){
            width: ${rm(540)};

            ${media.lg`
                width: ${rm(420)};
            `}

            ${media.md`
                width: ${rm(354)};
            `}

            ${media.xsm`
                width: 100%;
            `}
        }

        >:nth-child(2){
            width: ${rm(407)};

            ${media.lg`
                width: ${rm(327)};
            `}

            ${media.md`
                width: ${rm(354)};
            `}

            ${media.xsm`
                width: 100%;
            `}
        }
    }
`

export const StyledAboutTitleContainer = styled.div`
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    width: ${rm(540)};
    
    ${media.lg`
        font-size: ${rm(40)};
        width: ${rm(420)};
    `}

    ${media.md`
        width: ${rm(536)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
        width: 100%;
    `}

    >:first-child{
        >:first-child{
            >:first-child{
                >:first-child{
                    >:first-child{
                        margin-right: 0.25em;
                    }
                }
            }
        }
    }

    h2 {
        margin: 0;
        padding: 0;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        color: inherit;
        text-transform: inherit;
        font-family: inherit;
    }

    >:nth-child(3){
        margin-top: ${rm(-40)};

        ${media.md`
            margin-top: ${rm(-15)};
        `}
    }
`

const StyledMediaContainer = styled.div`
    width: 100%;
    height: ${rm(800)};
    position: relative;
    border-radius: ${rm(10)};
    overflow: hidden;

    ${media.lg`
        height: ${rm(600)};
    `}

    ${media.md`
        height: ${rm(539)};
    `}

    ${media.xsm`
        height: ${rm(236)};
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

    .image{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
`