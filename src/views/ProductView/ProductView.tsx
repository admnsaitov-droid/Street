'use client'

import { media, rm } from "@/styles"
import { Hero } from "./components/Hero"
import { ProductOverview } from "./components/ProductOverview"
import styled from "styled-components"
import { SwiperBlock } from "./components/SwiperBlock"

interface ProductViewProps {
    data: any
}

const testColors = [
    {
        name: "Red",
        color: "rgb(236, 100, 10)"
    },
    
    {
        name: "Blue",
        color: "rgb(60, 97, 206)"
    },
    
    {
        name: "Green",
        color: "#00FF00"
    },
    
    {
        name: "Yellow",
        color: "#FFFF00"
    },
    
    {
        name: "Purple",
        color: "#800080"
    },
    
]

export const ProductView = ({ data }: ProductViewProps) => {
    console.log('data', data)

    return (
        <StyledProductView>
            <Hero data={data?.product} colors={testColors} />
            <StyledWrapper>
                <ProductOverview data={data?.product} />
            </StyledWrapper>
            <SwiperBlock images={data?.product?.swiperMedias} />
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