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
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { MaskImageAppear } from "@/components/animated/MaskImageAppear/MaskImageAppear"

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

    const imageGallery = [
        data?.mainMediaLeft?.poster,
        data?.mainMediaRight?.poster
    ].filter(Boolean).map(media => getMediaStrapiPath(media));

    return (
        <StyledOverview ref={containerRef}>
            <StyledTop>
                <StyledAnnotation>overview</StyledAnnotation>
                <div className="right">
                    <StyledTitle>{data?.mainDescription}</StyledTitle>
                    <div className="bottom">
                        <StyledSubtitle>{data?.descriptionSecondary}</StyledSubtitle>
                        <SimpleButton className="button">
                            {data?.button?.text}
                        </SimpleButton>
                    </div>
                </div>
            </StyledTop>
            <StyledImagesContainer>
                <StyledImageContainer>
                    <MaskImageAppear className="image-container" duration={900}>
                        <MediaComponent media={data?.mainMediaLeft} className="image" imageGallery={imageGallery} />
                    </MaskImageAppear>
                </StyledImageContainer>
                <StyledImageContainer>
                    <MaskImageAppear className="image-container" duration={900}>
                        <MediaComponent media={data?.mainMediaRight} className="image" imageGallery={imageGallery} />
                    </MaskImageAppear>
                </StyledImageContainer>
            </StyledImagesContainer>

            {Array.isArray(linesData) && linesData.length > 0 && (
                <StyledExplore>
                    <StyledExploreHeaderContainer>
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
                                        color: colors.red,
                                        fontFamily: 'var(--font-sage-grotesk)',
                                        fontOpticalSizing: 'auto',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        lineHeight: '105%',
                                    }
                                },
                                'title-second': {
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
                            <span id="title-first" className="first">Explore</span>
                            <span id="title-second">the line</span>
                        </AnimatedGrid>
                    </StyledExploreHeaderContainer>
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

    ${media.md`
        padding: ${rm(100)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(70)} ${rm(16)};
    `}

    .button{
        ${media.xsm`
            width: 100%;

            >*{
                width: 100%;
            }
        `}
    }
`

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(15)};
    `}

    .right{
        display: flex;
        flex-direction: column;
        gap: ${rm(40)};
        width: ${rm(1100)};

        ${media.lg`
            width: ${rm(890)};    
        `}

        ${media.md`
            width: ${rm(475)};
            gap: ${rm(20)};
        `}

        ${media.xsm`
            width: 100%;
        `}

        .bottom{
            width: 100%;
            padding-left: ${rm(113)};
            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            ${media.md`
                padding-left: 0;
                flex-direction: column;
                gap: ${rm(30)};
                align-items: flex-start;
            `}

            >:nth-child(1){
                width: ${rm(550)};

                ${media.lg`
                    width: ${rm(440)};
                `}

                ${media.md`
                    width: 100%;
                `}
            }
        }
    }
`

const StyledTitle = styled(AnimatedText)`
    font-size: ${rm(40)};
    line-height: 115%;
    ${fontGolosText(400)};
    letter-spacing: -0.01em;
    color: ${colors.black100};

    span:nth-child(2){
        padding-left: ${rm(113)} !important;
    }

    ${media.lg`
        font-size: ${rm(32)};
    `}

    ${media.md`
        font-size: ${rm(24)};
        width: 100%;

        span:nth-child(2){
            padding-left: ${rm(0)} !important;
        }
    `}

    ${media.xsm`
        font-size: ${rm(20)};
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

        ${media.xsm`
            width: 100%;
        `}
    }

    >:nth-child(2){
        width: 40%;

        ${media.xsm`
            width: 100%;
        `}
    }

    ${media.lg`
        height: ${rm(430)};
    `}

    ${media.md`
        height: ${rm(268)};
    `}

    ${media.xsm`
        height: auto;
        flex-direction: column;
    `}
`   

const StyledImageContainer = styled.div`
    height: 100%;
    border-radius: ${rm(10)};
    overflow: hidden;
    position: relative;

    ${media.xsm`
        height: ${rm(185)};
    `}

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

const StyledExploreHeaderContainer = styled.div`
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
    `}
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

    ${media.md`
        padding-bottom: ${rm(70)};
    `}

    ${media.xsm`
        flex-direction: column;
        gap: ${rm(30)};
        padding-bottom: ${rm(0)};
    `}

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

        ${media.xsm`
            display: none;
        `}
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

    ${media.md`
        font-size: ${rm(18)};
    `}

    ${media.xsm`
        font-size: ${rm(20)};
    `}
`

const StyledProducts = styled.div`
    display: flex;
    flex-direction: column;
`