'use client'
import { media, rm } from "@/styles"
import styled from "styled-components"
import { StyledTitle } from "../PackagesView/PackagesView"
import { StyledSubtitle } from "../PackagesView/screens/Package/Package"
import Image from "next/image"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { LineOverview } from "./components/LineOverview"
import { StyledExploreHeader } from "../PackageView/components/Overview/Overview"
import { ProductCard } from "./components/ProductCard"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"

interface LineViewProps {
    data: any
}

export const LineView = ({ data }: LineViewProps) => {
    console.log('data', data)

    const extendedProducts = [...data?.line?.products, ...data?.line?.products, ...data?.line?.products, ...data?.line?.products]

    return (
        <StyledLineView>
            <Breadcrumbs
                items={[
                    { label: "Home", slug: "" },
                    { label: "Products", slug: "lines" },
                    { label: data?.line?.lineContent?.title || "", href: undefined },
                ]}
            />
            <StyledHero>
                <StyledTop>
                    <StyledTitle>{data?.line?.lineContent?.title}</StyledTitle>
                    <StyledSubtitle>{data?.line?.lineContent?.description}</StyledSubtitle>
                </StyledTop>
                <StyledTopImageContainer>
                    <MediaComponent media={data?.line?.mainMedia} className="image" />
                </StyledTopImageContainer>
            </StyledHero>
            <LineOverview data={data?.line?.lineOverview} />
            <StyledProductsTitle>
                <span className="first">Explore</span>
                our products
            </StyledProductsTitle>
            <StyledProductsGrid>
                {extendedProducts?.map((product: any) => (
                    <ProductCard key={product?.id} data={product} />
                ))}
            </StyledProductsGrid>
        </StyledLineView>
    )
}

const StyledLineView = styled.div`
    width: 100%;
    padding: ${rm(100)} ${rm(50)};
`

const StyledHero = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(40)};
`

const StyledTop = styled.div`
    display: flex;
    justify-content: space-between;

    >:last-child {
        width: ${rm(550)};

        ${media.lg`
            width: ${rm(440)};
        `}
    }
`

const StyledTopImageContainer = styled.div`
    width: 100%;
    height: ${rm(800)};
    position: relative;
    overflow: hidden;
    border-radius: ${rm(10)};

    .image {
        width: 100%;
        height: 100%;
    }

    ${media.lg`
        height: ${rm(600)};
    `}
`

const StyledProductsTitle = styled(StyledExploreHeader)`
    margin-top: ${rm(150)};
`

const StyledProductsGrid = styled.div`
    display: flex;
    row-gap: ${rm(20)};
    column-gap: ${rm(10)};
    flex-wrap: wrap;
    margin-top: ${rm(50)};
`