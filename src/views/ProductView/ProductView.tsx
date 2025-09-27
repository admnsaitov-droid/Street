'use client'

import { media, rm } from "@/styles"
import { Hero } from "./components/Hero"
import { ProductOverview } from "./components/ProductOverview"
import styled from "styled-components"
import { SwiperBlock } from "./components/SwiperBlock"
import { StructuredData } from "@/components/StructuredData/StructuredData"
import { generateProductSchema } from "@/utils/generateStructuredData"
import { ColorPaletre } from "./components/ColorPaletre/ColoPaletre"
import { useWindowWidth } from "@react-hook/window-size"

interface ProductViewProps {
    data: any
}

const testColors = [
    {
        name: "Blue",
        color: "rgb(60, 97, 206)"
    },
    {
        name: "Orange",
        color: "rgb(236, 100, 10)"
    },
    {
        name: "Green",
        color: "rgb(74, 203, 98)"
    },
    
    {
        name: "Red",
        color: "rgb(205, 33, 33)"
    },
    
    {
        name: "Lime",
        color: "rgb(191, 255, 0)"
    },
    {
        name: "Yellow",
        color: "rgb(255, 255, 0)"
    },
]

export const ProductView = ({ data }: ProductViewProps) => {
    console.log('data', data)

    // Generate Product schema for SEO
    const productSchema = generateProductSchema({
        name: data?.product?.name,
        description: data?.product?.productInfo?.description || data?.product?.productInfo?.descriptionMain,
        image: data?.product?.swiperMedias?.map((media: any) => media?.url) || [],
        brand: "Street Barbell",
        sku: data?.product?.model,
        category: "Fitness Equipment",
        material: "Steel",
        offers: {
            availability: "https://schema.org/InStock",
            url: typeof window !== 'undefined' ? window.location.href : ''
        }
    })

    const width = useWindowWidth()

    return (
        <StyledProductView>
            <StructuredData schemas={[productSchema]} />
            <Hero data={data?.product} colors={testColors} />
            {width <= 768 ? <ColorPaletre colors={testColors} /> : null}
            <StyledWrapper>
                <ProductOverview data={data?.product} />
            </StyledWrapper>
            <SwiperBlock images={data?.product?.swiperMedias} title={data?.product?.referencesTitle} />
        </StyledProductView>
    )
}

const StyledProductView = styled.div`
    width: 100%;
    height: 100%;
`

const StyledWrapper = styled.div`
    width: 100%;
    padding: ${rm(150)} ${rm(50)};
    color:rgb(12, 50, 163);

    ${media.md`
        padding: ${rm(100)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(90)} ${rm(16)};
    `}
`