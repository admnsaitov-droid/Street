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
import { useLocale } from "next-intl"

interface OverviewProps {
    data: any
}

const EXPLORE_TRANSLATIONS: Record<string, { explore: string; theLine: string }> = {
    en: { explore: 'Explore', theLine: 'the line' },
    de: { explore: 'Entdecken', theLine: 'die Linie' },
    es: { explore: 'Explorar', theLine: 'la línea' },
    fr: { explore: 'Explorer', theLine: 'la gamme' },
    fi: { explore: 'Tutustu', theLine: 'linjaan' },
}

export const Overview = ({ data }: OverviewProps) => {
    const locale = useLocale()
    const t = EXPLORE_TRANSLATIONS[locale] ?? EXPLORE_TRANSLATIONS.en

    const linesData = data?.lines

    const setAllUrls = useProductPreview(state => state.setAllUrls)
    const containerRef = useProductPreview(state => state.containerRef)

    const allProducts = useMemo(() => (
        Array.isArray(linesData)
            ? linesData.flatMap((line: any) => line?.produkties || [])
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
                {data?.overviewText && <StyledAnnotation tag="h2">{data?.overviewText}</StyledAnnotation>}
                <div className="right">
                    {data?.mainDescription && <StyledTitle tag="h2">{data?.mainDescription}</StyledTitle>}
                    <div className="bottom">
                        {data?.descriptionSecondary && <StyledSubtitle tag="p">{data?.descriptionSecondary}</StyledSubtitle>}
                        <SimpleButton className="button" link="/contact" isSvg>
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
                    {<StyledExploreHeaderContainer>
                        <h3>
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
                                <span id="title-first" className="first" style={{marginRight: '0.25em'}}>{t.explore}</span>
                                <span id="title-second">{t.theLine}</span>
                        </AnimatedGrid>
                    </h3>
                    </StyledExploreHeaderContainer>}
                     {linesData && linesData.length > 0 && <StyledLines>
                        {linesData.map((line: any, lineIndex: number) => (
                            <StyledLineGroup key={line?.id || lineIndex}>
                                <StyledLineInfo>
                                    {line?.linii?.name && <StyledLineName as="h4">{line?.linii?.name}</StyledLineName>}
                                    <div className="translateImageWrapper">
                                        <div className="imageWrapper">
                                            <Image src={getMediaStrapiPath(line?.linePreviewImage)} alt={line?.linii?.name} fill />
                                        </div>
                                    </div>
                                </StyledLineInfo>
                                <StyledProducts>
                                    {line?.produkties && line?.produkties.length > 0 && line?.produkties.map((product: any, productIndexWithinLine: number) => {
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
                    </StyledLines>}
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

            // >*{
            //     width: 100%;
            // }
        `}
    }
`

const StyledLineInfo = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    gap: ${rm(20)};
    align-self: stretch;
    
    .translateImageWrapper {
        position: relative;
        flex: 1;
        min-height: 0;

        .imageWrapper {
            height: ${rm(282)};
            width: ${rm(440)};
            position: sticky;
            top: 30%;
            left: 0;
            z-index: 1;
            border-radius: ${rm(8)};
            overflow: hidden;

            ${media.xsm`
                height: ${rm(185)};
                width: 100%;
            `}

            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
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
        width: 100%;

        span:nth-child(1){
            >:nth-child(1){
                padding-left: ${rm(0)} !important;
            }
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

    h3 {
        margin: 0;
        padding: 0;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        color: inherit;
        text-transform: inherit;
        font-family: inherit;
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
    align-items: stretch;
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
        background-image: repeating-linear-gradient(
            to right,
            #B7BCCA 0,
            #B7BCCA 1px,
            transparent 1px,
            transparent 5px
        );
        background-size: auto;
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
    text-transform: uppercase;
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