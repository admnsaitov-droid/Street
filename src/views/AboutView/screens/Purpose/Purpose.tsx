import styled from "styled-components"
import { StyledAnnotation, StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { useWindowWidth } from "@react-hook/window-size"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { MaskImageAppear } from "@/components/animated/MaskImageAppear/MaskImageAppear"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { useMemo } from "react"

interface PurposeProps {
    data: any
}

export const Purpose = ({ data }: PurposeProps) => {
    const width = useWindowWidth();

    // Create image gallery from all available media
    const allImageGallery = useMemo(() => {
        const images = [];
        
        // Add main image
        if (data?.mainImage?.poster) {
            images.push(getMediaStrapiPath(data.mainImage.poster));
        }
        
        // Add secondary media images
        if (data?.mediaSecondary) {
            data.mediaSecondary.forEach((media: any) => {
                if (media?.poster) {
                    images.push(getMediaStrapiPath(media.poster));
                }
            });
        }
        
        return images;
    }, [data]);

    return (
        <StyledPurpose>
            <StyledTop>
                <StyledAnnotation>{data?.blockName}</StyledAnnotation>
                <StyledRightTop>
                    <StyledPurposeTitleContainer>
                        <h2>
                            <div className="first-row">
                                <AnimatedGrid
                                    tag="span"
                                    type="words"
                                    animation={{
                                        from: { opacity: 0, y: '40px' },
                                        to: { opacity: 1, y: '0px' },
                                        delayStep: 60
                                    }}
                                    overflow={true}
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
                                        }
                                    }}
                                >
                                    <span id="title-first">{data?.title?.firstWord}</span>
                                </AnimatedGrid>
                            </div>
                            <div className="second-row">
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
                                        'title-second': {
                                            style: {
                                                color: colors.black100,
                                                fontFamily: 'var(--font-golos-text)',
                                                fontOpticalSizing: 'auto',
                                                fontWeight: 600,
                                                fontStyle: 'normal',
                                            }
                                        },
                                        'title-third': {
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
                                    <span id="title-second">{data?.title?.secondWord}</span>
                                    <span id="title-third" className="first">{data?.title?.thirdWord}</span>
                                </AnimatedGrid>
                            </div>
                        </h2>
                    </StyledPurposeTitleContainer>
                    <div className="bottom">
                        <StyledSubtitle>{data?.description}</StyledSubtitle>
                        {width > 768 && <StyledSubtitle>{data?.descriptionSecondary}</StyledSubtitle>}
                    </div>
                </StyledRightTop>
            </StyledTop>
            <StyledBottom>
                <div className="left">
                    {data?.mediaSecondary?.map((image: any, index: number) => (
                        <StyledImageContainer key={index} className="imageContainer">
                            <MaskImageAppear className="image-container" enabled={width > 768}>
                                <MediaComponent media={image} className="image" parallax={true} imageGallery={allImageGallery} />
                            </MaskImageAppear>
                        </StyledImageContainer>
                    ))}
                </div>
                <div className="right">
                    <StyledImageContainer className="imageContainer">
                        <MaskImageAppear className="image-container" enabled={width > 768}>
                            <MediaComponent media={data?.mainImage} className="image" parallax={true} imageGallery={allImageGallery} />
                        </MaskImageAppear>
                    </StyledImageContainer>
                </div>
            </StyledBottom>
        </StyledPurpose>
    )
}

const StyledPurpose = styled.div`
    width: 100%;
    padding: ${rm(150)} ${rm(50)};

    ${media.md`
        padding: ${rm(150)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(70)} ${rm(16)};
    `}
`   

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(15)};
    `}
`

const StyledRightTop = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};
    width: ${rm(988)};

    ${media.lg`
        width: ${rm(778)};
    `}

    ${media.md`
        width: ${rm(475)};    
    `}

    ${media.xsm`
        width: 100%;
        gap: ${rm(15)};
    `}

    .bottom{
        display: flex;
        gap: ${rm(10)};

        >:nth-child(1){
            width: ${rm(407)};

            ${media.lg`
                width: ${rm(327)};
            `}

            ${media.md`
                width: ${rm(354)};
            `}
        }

        >:nth-child(2){
            width: ${rm(540)};

            ${media.lg`
                width: ${rm(440)};
            `}
        }
    }
`

export const StyledPurposeTitleContainer = styled.div`
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    width: ${rm(470)};
    display: flex;
    flex-direction: column;
    
    ${media.lg`
        font-size: ${rm(40)};
        width: ${rm(420)};
    `}

    ${media.md`
        .first-row {
            margin-bottom: ${rm(-8)};
        }
    `}

    ${media.xsm`
        font-size: ${rm(32)};
        width: ${rm(320)};
    `}

    .second-row{
        >:first-child{
            >:first-child{
                >:first-child{
                    >:nth-child(2){
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

    .first-row {
        width: 100%;

        ${media.xsm`
            margin-bottom: ${rm(4)};
        `}
    }

    .second-row {
        width: 100%;
        display: flex;
        align-items: flex-start;
    }
`

const StyledBottom = styled.div`
    width: 100%;
    display: flex;
    margin-top: ${rm(40)};
    gap: ${rm(10)};

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(10)};
    `}

    .left{
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        gap: ${rm(10)};
        flex: 1;
        width: ${rm(573)};

        ${media.xsm`
            width: 100%;
        `}

        .imageContainer{
            width: 100%;
            height: 100%;
            position: relative;

            ${media.md`
                width: ${rm(233)};
                height: ${rm(175)};
            `}

            ${media.xsm`
                width: ${rm(328)};
                height: ${rm(246)};
            `}
        }
    }

    .right{
        width: ${rm(987)};
        height: ${rm(781)};
        
        ${media.lg`
            width: ${rm(777)};
        `}

        ${media.md`
            width: ${rm(475)};
            height: ${rm(360)};
        `}

        ${media.xsm`
            width: 100%;
            height: ${rm(246)};
        `}
    }
`

const StyledImageContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: ${rm(10)};
    overflow: hidden;

    .image{
        width: 100%;
        height: 100%;
    }
`