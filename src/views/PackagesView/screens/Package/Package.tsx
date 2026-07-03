'use client'
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import { AnimatedTranslate } from "@/components/animated/AnimatedTranslate/AnimatedTranslate"
import { MaskImageAppear } from "@/components/animated/MaskImageAppear/MaskImageAppear"
import UnderlineLink from "@/components/animated/UnderlineLink/UnderlineLink"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { useWindowWidth } from "@react-hook/window-size"
import Image from "next/image"
import styled from "styled-components"

interface PackageProps {
    data: any
    productsCountText: string
    exploreText: string
}

export const Package = ({ data, productsCountText, exploreText }: PackageProps) => {

    const width = useWindowWidth();
    
    // Debug: Log the productsCount value
    console.log('Original productsCount:', data?.productsCount);
    console.log('Cleaned productsCount:', data?.productsCount?.replace(/,/g, ''));
    
    // Create image gallery from available media
    const imageGallery = [
        data?.previewAboveMedia?.poster,
        data?.previewSideMedia?.poster
    ].filter(Boolean).map(media => getMediaStrapiPath(media));

    const productText = data?.productsCount.replace(/,/g, '') + ' ' + productsCountText
    
    return (
        <StyledPackage>
            <StyledContent>
                <StyledLeft>
                    {width > 576 && <StyledAnnotation>{productText}</StyledAnnotation>}
                    <StyledBottomContainer>
                        <MaskImageAppear className="image-container" duration={900}>  
                            <MediaComponent media={data?.previewAboveMedia} className="image" parallax={true} imageGallery={imageGallery}/>
                        </MaskImageAppear>
                    </StyledBottomContainer>
                </StyledLeft>
                <StyledRight>
                    <StyledInfo>
                        <div className="left">
                            <AnimatedText className="title" tag="h2">{data?.title}</AnimatedText>
                            <StyledSubtitle tag="p">{data?.previewDescription}</StyledSubtitle>
                        </div>
                        <StyledExploreButton>
                            <UnderlineLink lineColor={colors.blue} href={`/packages/${data?.slug}`} text={exploreText}/>
                        </StyledExploreButton>
                    </StyledInfo>
                    <StyledBottomContainer>
                        <MaskImageAppear className="image-container" duration={900}>
                            <MediaComponent media={data?.previewSideMedia} className="image" parallax={true} imageGallery={imageGallery} />
                        </MaskImageAppear>
                    </StyledBottomContainer>
                </StyledRight>
                {width <= 576 && <StyledAnnotation>{productText}</StyledAnnotation>}
            </StyledContent>
        </StyledPackage>
    )
}

const StyledPackage = styled.div`
    width: 100%;
    padding: ${rm(50)} 0;
    position: relative;

    ${media.xsm`
        padding: ${rm(40)} 0;    
    `}

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-image: repeating-linear-gradient(
            to right,
            #B7BCCA 0,
            #B7BCCA 1px,
            transparent 1px,
            transparent 5px
        );
        background-size: auto;
        background-repeat: repeat-x;
    }
`

const StyledContent = styled.div`
    width: 100%;
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${rm(10)};
    align-items: stretch; // This ensures both children stretch to the same height

    ${media.xsm`
        display: flex;
        flex-direction: column-reverse;
    `}
`

const StyledMainContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${rm(40)};
    height: 100%; // This ensures the container takes full height
`

const StyledLeft = styled(StyledMainContainer)`
    // width: ${rm(700)};
    height: 100%; // Ensure full height

    ${media.lg`
        width: ${rm(553)};
    `}

    ${media.md`
        width: ${rm(233)};    
    `}

    ${media.xsm`
        width: 100%;
    `}
`

const StyledRight = styled(StyledMainContainer)`
    width: ${rm(999)};
    height: 100%; // Ensure full height

    ${media.lg`
        width: ${rm(777)};
    `}

    ${media.md`
        width: ${rm(475)};    
    `}

    ${media.xsm`
        width: 100%;
    `}
`

const StyledExploreButton = styled(AnimatedTranslate)`
    font-size: ${rm(16)};
    line-height: 130%;
    ${fontGolosText(400)};
    color: ${colors.blue};
    height: fit-content;

    ${media.lg`
        font-size: ${rm(14)};
    `}
`

export const StyledAnnotation = styled(AnimatedText)`
    color: ${colors.gray};
    font-size: ${rm(20)};
    line-height: 110%;
    ${fontGolosText(400)};
    text-transform: uppercase;
    height: fit-content !important;

    ${media.lg`
        font-size: ${rm(16)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
        margin-bottom: ${rm(20)};
    `}
`

const StyledInfo = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;

    ${media.md`
        flex-direction: column;
        gap: ${rm(20)};
    `}

    .left{
        display: flex;
        flex-direction: column;
        gap: ${rm(20)};
        width: ${rm(550)};

        ${media.lg`
            width: ${rm(440)};
        `}

        ${media.md`
            width: 100%;
        `}

        .title{ 
            font-size: ${rm(48)};
            line-height: 90%;
            ${fontGolosText(600)};
            text-transform: uppercase;
            letter-spacing: -0.01em;
            color: ${colors.black100};

            ${media.lg` 
                font-size: ${rm(40)};
            `}

            ${media.xsm`
                font-size: ${rm(32)};
            `}
        }

    }
`

export const StyledSubtitle = styled(AnimatedText)`
    font-size: ${rm(20)};
    color: ${colors.gray};
    ${fontGolosText(400)};
    line-height: 130%;
    width: 100%;
    min-height: ${rm(50)};
    height: fit-content;

    ${media.lg`
        font-size: ${rm(16)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
    `}
`

const StyledBottomContainer = styled.div`
    width: 100%;
    height: ${rm(600)};
    position: relative;
    border-radius: ${rm(10)};
    overflow: hidden;

    .image{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    ${media.lg`
        height: ${rm(448)};
    `}

    ${media.md`
        height: ${rm(268)};
    `}

    ${media.xsm`
        height: ${rm(185)};
    `}
`