'use client'
import { SimpleButton } from "@/components/Ui/buttons/SimpleButton"
import UnderlineLink from "@/components/animated/UnderlineLink/UnderlineLink"
import { colors, media, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { StyledAnnotation, StyledSubtitle } from "@/views/PackagesView/screens/Package/Package"
import Image from "next/image"
import styled from "styled-components"
import { useEffect, useMemo } from "react"
import { Product } from "./components/Product"
import { ProductPreview, useProductPreview } from "./components/ProductPreview"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"

interface OverviewProps {
    data: any
}

export const Overview = ({ data }: OverviewProps) => {

    const linesData = data?.lines

    console.log('linesData', linesData)
    const setAllUrls = useProductPreview(state => state.setAllUrls)
    const containerRef = useProductPreview(state => state.containerRef)

    const allProducts = useMemo(() => (
        Array.isArray(linesData)
            ? linesData.flatMap((line: any) => line?.products || [])
            : []
    ), [linesData])

    useEffect(() => {
        setAllUrls(allProducts)
    }, [allProducts, setAllUrls])

    return (
        <StyledOverview ref={containerRef}>
            <StyledTop>
                <StyledAnnotation>overview</StyledAnnotation>
                <div className="right">
                    <StyledTitle>{data?.mainDescription}</StyledTitle>
                    <div className="bottom">
                        <StyledSubtitle>{data?.descriptionSecondary}</StyledSubtitle>
                        <SimpleButton>
                            {data?.button?.text}
                        </SimpleButton>
                    </div>
                </div>
            </StyledTop>
            <StyledImagesContainer>
                <StyledImageContainer>
                    <MediaComponent media={data?.mainMediaLeft} className="image" />
                </StyledImageContainer>
                <StyledImageContainer>
                    <MediaComponent media={data?.mainMediaRight} className="image" />
                </StyledImageContainer>
            </StyledImagesContainer>

            {Array.isArray(linesData) && linesData.length > 0 && (
                <StyledExplore>
                    <StyledExploreHeader>
                        <span className="first">Explore</span>
                        the line
                    </StyledExploreHeader>
                    <StyledLines>
                        {linesData.map((line: any, lineIndex: number) => (
                            <StyledLineGroup key={line?.id || lineIndex}>
                                <StyledLineName>{line?.name}</StyledLineName>
                                <StyledProducts>
                                    {line?.products.map((product: any, productIndexWithinLine: number) => {
                                        const globalIndex = (linesData
                                            .slice(0, lineIndex)
                                            .reduce((acc: number, l: any) => acc + ((l?.products || []).length), 0)) + productIndexWithinLine
                                        return (
                                            <Product key={product?.id || globalIndex} product={product} index={globalIndex} />
                                        )
                                    })}
                                </StyledProducts>
                            </StyledLineGroup>
                        ))}
                    </StyledLines>
                </StyledExplore>
            )}
            <ProductPreview />
        </StyledOverview>
    )
}

const StyledOverview = styled.div`
    width: 100%;
    height: 100%;
    padding: ${rm(150)} ${rm(50)};
    display: flex;
    flex-direction: column;
    position: relative;
`

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

    .right{
        display: flex;
        flex-direction: column;
        gap: ${rm(40)};
        width: ${rm(1100)};

        ${media.lg`
            width: ${rm(890)};    
        `}

        .bottom{
            width: 100%;
            padding-left: ${rm(113)};
            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            >:nth-child(1){
                width: ${rm(550)};

                ${media.lg`
                    width: ${rm(440)};
                `}
            }
        }
    }
`

const StyledTitle = styled.p`
    font-size: ${rm(40)};
    line-height: 100%;
    ${fontGolosText(400)};
    text-indent: ${rm(113)};
    letter-spacing: -0.01em;
    color: ${colors.black100};

    ${media.lg`
        font-size: ${rm(32)};
    `}
`

const StyledImagesContainer = styled.div`
    display: flex;
    gap: ${rm(10)};
    height: ${rm(600)};
    width: 100%;
    margin-top: ${rm(40)};

    >:nth-child(1){
        width: 60%;
    }

    >:nth-child(2){
        width: 40%;
    }

    ${media.lg`
        height: ${rm(430)};
    `}
`   

const StyledImageContainer = styled.div`
    height: 100%;
    border-radius: ${rm(10)};
    overflow: hidden;
    position: relative;

    .image{
        width: 100%;
        height: 100%;
    }
`

const StyledExplore = styled.div`
    width: 100%;
    margin-top: ${rm(150)};
    display: flex;
    flex-direction: column;
`

export const StyledExploreHeader = styled.p`
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;
    ${fontGolosText(600)};
    color: ${colors.black100};
    gap: ${rm(10)};
    display: flex;

    ${media.lg`
        font-size: ${rm(40)};
    `}

    .first{
        ${fontSageGrotesk(400)} !important;
        color: ${colors.red} !important;
        letter-spacing: -0.02em;
        line-height: 105%;
    }
`

const StyledLines = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: ${rm(50)};
`

const StyledLineGroup = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: ${rm(0)} 0 ${rm(50)} 0;
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

const StyledLineName = styled.p`
    font-size: ${rm(30)};
    line-height: 110%;
    ${fontGolosText(400)};
    text-transform: none;
    color: ${colors.black100};
    margin-top: ${rm(20)};

    ${media.lg`
        font-size: ${rm(24)};
    `}
`

const StyledProducts = styled.div`
    display: flex;
    flex-direction: column;
`