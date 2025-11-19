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
import { useMemo } from "react"

interface ProductViewProps {
    data: any
}

// Helper function to convert hex to rgb
const hexToRgb = (hex: string): string => {
    // Remove # if present
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex)
    if (!result) return hex // Return original if not a valid hex
    
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    return `rgb(${r}, ${g}, ${b})`
}

export const ProductView = ({ data }: ProductViewProps) => {
    console.log('data', data)

    // Transform main colors from product data
    const mainColors = useMemo(() => {
        if (!data?.product?.colors || !Array.isArray(data.product.colors)) return []
        return data.product.colors.map((color: any) => ({
            name: color.displayColor || '',
            color: color.modelColor || ''
        }))
    }, [data?.product?.colors])

    // Transform accent colors from product data and convert hex to rgb
    const accentColors = useMemo(() => {
        if (!data?.product?.accentColors || !Array.isArray(data.product.accentColors)) return []
        return data.product.accentColors.map((color: any) => ({
            name: color.displayColor || '',
            color: color.modelColor ? hexToRgb(color.modelColor) : ''
        }))
    }, [data?.product?.accentColors])

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

    console.log('product data' ,data)

    return (
        <StyledProductView>
            <StructuredData schemas={[productSchema]} />
            <Hero data={data?.product} colors={mainColors} accentColors={accentColors} />
            {width <= 768 ? <ColorPaletre mainColors={mainColors} accentColors={accentColors} /> : null}
            <StyledWrapper>
                <ProductOverview data={data?.product} />
            </StyledWrapper>
            {data?.product?.swiperMedias?.length > 0 && data?.product?.referencesTitle ? <SwiperBlock images={data?.product?.swiperMedias} title={data?.product?.referencesTitle} /> : null}
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