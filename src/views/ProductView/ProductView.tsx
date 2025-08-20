'use client'

import { rm } from "@/styles"
import { Hero } from "./components/Hero"
import { ProductOverview } from "./components/ProductOverview"
import styled from "styled-components"
import { SwiperBlock } from "./components/SwiperBlock"

interface ProductViewProps {
    data: any
}

export const ProductView = ({ data }: ProductViewProps) => {
    console.log('data', data)

    return (
        <StyledProductView>
            <Hero data={data?.product} />
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
`