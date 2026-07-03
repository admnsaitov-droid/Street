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
import { useMemo, useEffect } from "react"
import { useColorStore } from "@/store/store"
import { SimpleButton } from "@/components/Ui/buttons/SimpleButton"

interface ProductViewProps {
    data: any
    specificationTexts?: Record<string, string | null> | null
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

export const ProductView = ({ data, specificationTexts }: ProductViewProps) => {
    console.log('data', data)
    const { materialMainColor, materialAccentColor, setMaterialMainColor, setMaterialAccentColor } = useColorStore()

    // Reset material colors when product changes
    useEffect(() => {
        // Reset material colors when product changes (before new ones are extracted)
        setMaterialMainColor(null)
        setMaterialAccentColor(null)
    }, [data?.product?.id, setMaterialMainColor, setMaterialAccentColor])

    // Get colors to exclude
    const colorsToExclude = useMemo(() => {
        return data?.product?.colorsToExclude && Array.isArray(data.product.colorsToExclude)
            ? data.product.colorsToExclude
                .map((color: any) => color?.modelColor?.toLowerCase().trim())
                .filter((color: string) => color && color !== '')
            : []
    }, [data?.product?.colorsToExclude])

    // Transform main colors from product data and merge with material colors
    const mainColors = useMemo(() => {
        const apiColors = data?.product?.mainColors && Array.isArray(data.product.mainColors)
            ? data.product.mainColors
                .filter((color: any) => {
                    // Filter out null/empty colors
                    if (!color?.modelColor || color.modelColor.trim() === '') return false
                    // Filter out colors that match colorsToExclude
                    const modelColorLower = color.modelColor.toLowerCase().trim()
                    return !colorsToExclude.includes(modelColorLower)
                })
                .map((color: any) => {
                    // Use displayColor for both name and color value
                    const displayColorValue = color.displayColor || ''
                    // Convert hex to rgb if displayColor is hex format
                    const colorValue = displayColorValue.startsWith('#') || /^[0-9A-Fa-f]{6}$/i.test(displayColorValue)
                        ? hexToRgb(displayColorValue)
                        : displayColorValue
                    return {
                        name: displayColorValue,
                        color: colorValue
                    }
                })
            : []
        
        // Add material color first if it exists and isn't already in the list
        const materialColor = materialMainColor
        if (materialColor) {
            const materialExists = apiColors.some((c: any) => c.color === materialColor.color)
            if (!materialExists) {
                return [materialColor, ...apiColors]
            }
        }
        
        return apiColors
    }, [data?.product?.mainColors, materialMainColor, colorsToExclude])

    // Transform accent colors from product data and merge with material colors
    const accentColors = useMemo(() => {
        const apiColors = data?.product?.accentColors && Array.isArray(data.product.accentColors)
            ? data.product.accentColors
                .filter((color: any) => {
                    // Filter out null/empty colors
                    if (!color?.modelColor || typeof color.modelColor !== 'string' || color.modelColor.trim() === '') return false
                    // Filter out colors that match colorsToExclude
                    const modelColorLower = color.modelColor.toLowerCase().trim()
                    return !colorsToExclude.includes(modelColorLower)
                })
                .map((color: any) => {
                    // Use displayColor for both name and color value
                    const displayColorValue = color.displayColor || ''
                    // Convert hex to rgb if displayColor is hex format
                    const colorValue = displayColorValue.startsWith('#') || /^[0-9A-Fa-f]{6}$/i.test(displayColorValue)
                        ? hexToRgb(displayColorValue)
                        : displayColorValue
                    return {
                        name: displayColorValue,
                        color: colorValue
                    }
                })
            : []
        
        // Add material color first if it exists and isn't already in the list
        const materialColor = materialAccentColor
        const result: Array<{ name: string; color: string }> = []
        
        if (materialColor && materialColor.color) {
            result.push(materialColor)
        }
        
        // Add API colors that don't duplicate the material color
        apiColors.forEach((apiColor: any) => {
            if (apiColor.color && !result.some((c) => c.color === apiColor.color)) {
                result.push(apiColor)
            }
        })
        
        console.log('accentColors result:', result)
        console.log('materialAccentColor:', materialAccentColor)
        console.log('apiColors:', apiColors)
        
        return result
    }, [data?.product?.accentColors, materialAccentColor, colorsToExclude])

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
    const hasSwiperMedias = Array.isArray(data?.product?.swiperMedias) && data.product.swiperMedias.length > 0
    const swiperTitle = data?.product?.referencesTitle || { textFirst: "References"}
    const quoteLink = data?.product?.quoteButton?.link || "/contact"
    const quoteText = data?.product?.quoteButton?.text || "Contact us"

    console.log('product data' ,data)

    return (
        <StyledProductView>
            <StructuredData schemas={[productSchema]} />
            <Hero data={data?.product} colors={mainColors} accentColors={accentColors} />
            {width <= 768 ? (
                <StyledMobileControls>
                    <ColorPaletre mainColors={mainColors} accentColors={accentColors} />
                    <SimpleButton isSvg link={quoteLink}>
                        {quoteText}
                    </SimpleButton>
                </StyledMobileControls>
            ) : null}
            <StyledWrapper>
                <ProductOverview data={data?.product} specificationTexts={specificationTexts} />
            </StyledWrapper>
            {hasSwiperMedias ? <SwiperBlock images={data?.product?.swiperMedias} title={swiperTitle} /> : null}
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

const StyledMobileControls = styled.div`
    width: 100%;
    padding: 0 ${rm(16)};
    margin-top: ${rm(16)};
    display: flex;
    flex-direction: column;
    gap: ${rm(16)};

    >*{
        width: 100%;
    }
`