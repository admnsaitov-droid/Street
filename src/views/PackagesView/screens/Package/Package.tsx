'use client'
import UnderlineLink from "@/components/animated/UnderlineLink/UnderlineLink"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import Image from "next/image"
import styled from "styled-components"

interface PackageProps {
    data: any
}

export const Package = ({ data }: PackageProps) => {

    
    return (
        <StyledPackage>
            <StyledContent>
                <StyledLeft>
                    <StyledAnnotation>{data?.productsCount} fitness equipment</StyledAnnotation>
                    <StyledBottomContainer>
                        <MediaComponent media={data?.previewAboveMedia} className="image"/>
                    </StyledBottomContainer>
                </StyledLeft>
                <StyledRight>
                    <StyledInfo>
                        <div className="left">
                            <p className="title">{data?.title}</p>
                            <StyledSubtitle>{data?.previewDescription}</StyledSubtitle>
                        </div>
                        <StyledExploreButton>
                            <UnderlineLink lineColor={colors.blue} href={`/packages/${data?.slug}`} text='Explore'/>
                        </StyledExploreButton>
                    </StyledInfo>
                    <StyledBottomContainer>
                        <MediaComponent media={data?.previewSideMedia} className="image" />
                    </StyledBottomContainer>
                </StyledRight>
            </StyledContent>
        </StyledPackage>
    )
}

const StyledPackage = styled.div`
    width: 100%;
    padding: ${rm(50)} 0;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-image: 
            radial-gradient(circle 1px at 4px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 12px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 20px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 28px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 36px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 44px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 52px 0.5px, #B7BCCA 100%, transparent 100%),
            radial-gradient(circle 1px at 60px 0.5px, #B7BCCA 100%, transparent 100%);
        background-size: 16px 1px;
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
`

const StyledRight = styled(StyledMainContainer)`
    // width: ${rm(999)};
    height: 100%; // Ensure full height

    ${media.lg`
        width: ${rm(777)};
    `}
`

const StyledExploreButton = styled.div`
    font-size: ${rm(16)};
    line-height: 130%;
    ${fontGolosText(400)};
    color: ${colors.blue};
    height: fit-content;

    ${media.lg`
        font-size: ${rm(14)};
    `}
`

export const StyledAnnotation = styled.p`
    color: ${colors.gray};
    font-size: ${rm(20)};
    line-height: 110%;
    ${fontGolosText(400)};
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(16)};
    `}
`

const StyledInfo = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;

    .left{
        display: flex;
        flex-direction: column;
        gap: ${rm(20)};
        width: ${rm(550)};

        ${media.lg`
            width: ${rm(440)};
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
        }

    }
`

export const StyledSubtitle = styled.p`
    font-size: ${rm(20)};
    color: ${colors.gray};
    ${fontGolosText(400)};
    line-height: 130%;
    width: 100%;

    ${media.lg`
        font-size: ${rm(16)};
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
`