import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import styled from "styled-components"
import { DynamicProductScene as ProductScene } from "./Scene/DynamicProductScene"
import { ColorPaletre } from "./ColorPaletre/ColoPaletre"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import { useWindowWidth } from "@react-hook/window-size"
import { SimpleButton } from "@/components/Ui/buttons/SimpleButton"
import { ProductGallery } from "./ProductGallery"
import { useMemo, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"


interface HeroProps {
    data: any
    colors: {
        name: string
        color: string
    }[]
    accentColors?: {
        name: string
        color: string
    }[]
}

export const Hero = ({ data, colors, accentColors = [] }: HeroProps) => {
    const width = useWindowWidth()
    const quoteLink = data?.quoteButton?.link || "/contact"
    const quoteText = data?.quoteButton?.text || "Contact us"

    const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null)
    const galleryUrls = useMemo<string[]>(
        () => (data?.productImages || []).map((img: any) => getMediaStrapiPath(img)).filter(Boolean),
        [data?.productImages]
    )
    const currentIndex = activeImageUrl ? galleryUrls.indexOf(activeImageUrl) : -1

    const goNext = useCallback(() => {
        if (galleryUrls.length < 2) return
        const next = (currentIndex + 1) % galleryUrls.length
        setActiveImageUrl(galleryUrls[next])
    }, [currentIndex, galleryUrls])

    const goPrev = useCallback(() => {
        if (galleryUrls.length < 2) return
        const prev = currentIndex <= 0 ? galleryUrls.length - 1 : currentIndex - 1
        setActiveImageUrl(galleryUrls[prev])
    }, [currentIndex, galleryUrls])

    useEffect(() => {
        if (!activeImageUrl) return
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
            if (e.key === 'Escape') setActiveImageUrl(null)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [activeImageUrl, goNext, goPrev])

    return (
        <StyledHero>
            <StyledContent>
                <Breadcrumbs
                    items={[
                        { label: "Home", slug: "" },
                        { label: "Products", slug: "lines" },
                        { label: data?.name || "", href: undefined },
                    ]}
                />
                <div className="top">
                    {data?.name && <StyledTitle tag="h1">{data?.name}</StyledTitle>}
                    {data?.model && <StyledSubtitle tag="p">{data?.model}</StyledSubtitle>}
                </div>
            </StyledContent>
            <ProductScene data={data?.model3D} colors={colors} accentColors={accentColors} />
            {activeImageUrl && (
                <StyledImageOverlay role="dialog" aria-modal="true">
                    <div className="imageWrap">
                        <Image src={activeImageUrl} alt="Product" fill style={{ objectFit: 'contain' }} />
                    </div>
                    <StyledOverlayClose onClick={() => setActiveImageUrl(null)} aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </StyledOverlayClose>
                    {galleryUrls.length > 1 && (
                        <>
                            <StyledOverlayArrow $side="left" onClick={goPrev} aria-label="Previous image">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </StyledOverlayArrow>
                            <StyledOverlayArrow $side="right" onClick={goNext} aria-label="Next image">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </StyledOverlayArrow>
                            <StyledOverlayCounter>{currentIndex + 1} / {galleryUrls.length}</StyledOverlayCounter>
                        </>
                    )}
                </StyledImageOverlay>
            )}
            {/* Thumbnails rail on the right center */}
            {Array.isArray(data?.productImages) && data?.productImages.length > 0 && (
                <ProductGallery
                    images={data?.productImages}
                    model3D={data?.model3D}
                    colors={colors}
                    accentColors={accentColors}
                    onOpenImage={(url) => setActiveImageUrl(url)}
                    activeImageUrl={activeImageUrl}
                    onCloseImage={() => setActiveImageUrl(null)}
                />
            )}
            {width > 768 ? <ColorPaletre mainColors={colors} accentColors={accentColors} /> : null}
            {width > 768 ? (
                <StyledQuoteButtonWrapper>
                    <SimpleButton isSvg link={quoteLink}>
                        {quoteText}
                    </SimpleButton>
                </StyledQuoteButtonWrapper>
            ) : null}
        </StyledHero>
    )
}

const StyledHero = styled.div`
    width: 100%;
    ${heightLvh(100)};
    background-color:#F8F9FC;
    position: relative;

    ${media.xsm`
        overflow: hidden;
        height: 100dvh !important;
    `}
`

const StyledImageOverlay = styled.div`
    position: absolute;
    inset: 0;
    z-index: 20;
    background: #EAECF2;
    display: flex;
    align-items: center;
    justify-content: center;

    .imageWrap{
        position: relative;
        width: 100%;
        height: 100%;
        background: transparent;
        z-index: 2;
    }
`

const StyledOverlayClose = styled.button`
    position: absolute;
    top: ${rm(20)};
    right: ${rm(20)};
    z-index: 30;
    width: ${rm(44)};
    height: ${rm(44)};
    border-radius: 50%;
    background: rgba(0,0,0,0.15);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.black100};
    transition: background 0.2s;
    &:hover { background: rgba(0,0,0,0.25); }
`

const StyledOverlayArrow = styled.button<{ $side: 'left' | 'right' }>`
    position: absolute;
    top: 50%;
    ${({ $side }) => $side === 'left' ? `left: ${rm(20)};` : `right: ${rm(20)};`}
    transform: translateY(-50%);
    z-index: 30;
    width: ${rm(48)};
    height: ${rm(48)};
    border-radius: 50%;
    background: rgba(0,0,0,0.15);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.black100};
    transition: background 0.2s, transform 0.2s;
    &:hover {
        background: rgba(0,0,0,0.25);
        transform: translateY(-50%) scale(1.08);
    }
`

const StyledOverlayCounter = styled.div`
    position: absolute;
    bottom: ${rm(20)};
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    background: rgba(0,0,0,0.15);
    color: ${colors.black100};
    padding: ${rm(6)} ${rm(14)};
    border-radius: ${rm(20)};
    font-size: ${rm(14)};
    ${fontGolosText(400)};
`

const StyledContent = styled.div`
    padding: ${rm(100)} ${rm(50)};
    position: relative;
    z-index: 10;

    ${media.md`
        padding: ${rm(100)} ${rm(25)};
        padding-bottom: ${rm(50)};
    `}

    ${media.xsm`
        padding: ${rm(90)} ${rm(16)};
        padding-bottom: ${rm(20)};
    `}

    .top{
        display: flex;
        flex-direction: column;
        gap: ${rm(20)};
        margin-top: ${rm(40)};

        ${media.xsm`
            margin-top: ${rm(30)};
        `}
    }
`

const StyledTitle = styled(AnimatedText)`
    font-size: ${rm(48)};
    ${fontGolosText(600)};
    color: ${colors.black100};
    line-height: 90%;
    letter-spacing: -0.01em;
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(40)};
    `}
`

const StyledSubtitle = styled(AnimatedText)`
    font-size: ${rm(20)};
    ${fontGolosText(400)};
    line-height: 110%;
    color: ${colors.gray};
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(16)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
    `}
`

const StyledQuoteButtonWrapper = styled.div`
    position: absolute;
    right: ${rm(50)};
    bottom: ${rm(50)};
    z-index: 2;

    ${media.md`
        right: ${rm(25)};
        bottom: ${rm(25)};
    `}

    ${media.xsm`
        right: ${rm(16)};
        bottom: ${rm(16)};
    `}
`