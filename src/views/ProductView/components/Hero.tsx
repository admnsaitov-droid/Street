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
import { useMemo, useState } from "react"
import Image from "next/image"


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

    const breadcrumbs = data?.breadcrumbs?.map((breadcrumb: any) => (
        { label: breadcrumb.text, slug: breadcrumb.link }
    ))

    const width = useWindowWidth()

    const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null)
    const galleryUrls = useMemo(() => (data?.productImages || []).map((m: any) => m && m.url ? ({ url: m.url }) : m).map((m: any) => m ? m : null).filter(Boolean), [data?.productImages])

    return (
        <StyledHero>
            <StyledContent>
                <Breadcrumbs
                    items={[
                        ...breadcrumbs || [],
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
                <>
                    <StyledImageOverlay role="dialog" aria-modal="true">
                        <div className="imageWrap">
                            <Image src={activeImageUrl} alt="Product" fill style={{ objectFit: 'contain' }} />
                        </div>
                        <StyledBackgroundGradient />
                    </StyledImageOverlay>
                </>
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
            {width > 768 ? <StyledQuoteButtonWrapper>
                <SimpleButton isSvg link={data?.quoteButton?.link}>
                    {data?.quoteButton?.text && data?.quoteButton?.text}
                </SimpleButton>
            </StyledQuoteButtonWrapper> : null}
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
    `}
`

const StyledBackgroundGradient = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(180deg, #F8F9FC 0%, #DCDEE5 100%);
    z-index: 1;
`

const StyledImageOverlay = styled.div`
    position: absolute;
    inset: 0;
    z-index: 20;
    // background: rgba(0,0,0,0.32);
    background: #F8F9FC;
    display: flex;
    align-items: center;
    justify-content: center;

    .imageWrap{
        position: relative;
        width: 80%;
        height: 80%;
        max-width: 1200px;
        max-height: 80vh;
        background: transparent;
        z-index: 2;
    }
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
`