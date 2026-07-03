'use client'
import { media, rm } from "@/styles"
import styled from "styled-components"
import { StyledTitle } from "../PackagesView/PackagesView"
import { StyledSubtitle } from "../PackagesView/screens/Package/Package"
import Image from "next/image"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import { LineOverview } from "./components/LineOverview"

import { ProductCard } from "./components/ProductCard"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { MediaComponent } from "@/components/MediaComponent/MediaComponent"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { colors } from "@/styles/colors"
import { ScaleImageAppear } from "@/components/animated/ScaleImageAppear/ScaleImageAppear"

interface LineViewProps {
    data: any
}

export const LineView = ({ data }: LineViewProps) => {
    const breadcrumbs = data?.line?.breadcrumbs?.map((breadcrumb: any) => (
        { label: breadcrumb.text, slug: breadcrumb.link }
    ))

    return (
        <StyledLineView>
            <Breadcrumbs
                items={breadcrumbs ? [
                    ...breadcrumbs,
                    { label: data?.line?.lineContent?.title || "", href: undefined },
                ] : []}
            />
            <StyledHero>
                <StyledTop>
                    {data?.line?.lineContent?.title && <StyledTitle tag="h1">{data?.line?.lineContent?.title}</StyledTitle>}
                    {/* {data?.line?.lineContent?.description && <StyledSubtitle tag="p">{data?.line?.lineContent?.description}</StyledSubtitle>} */}
                </StyledTop>
                <StyledTopImageContainer>
                    <ScaleImageAppear className="image-container">
                        <MediaComponent media={data?.line?.mainMedia} className="image" parallax={true} priority={true} />
                    </ScaleImageAppear>
                </StyledTopImageContainer>
            </StyledHero>
            <LineOverview data={data?.line?.lineOverview} overviewText={data?.line?.overviewText} />
            <StyledProductsTitleContainer>
                <h2>
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
                        <span id="title-first" className="first">{data?.line?.exploreTitle?.textFirst}</span>
                        <span id="title-second">{data?.line?.exploreTitle?.textSecond}</span>
                        </AnimatedGrid>
                    </h2>
            </StyledProductsTitleContainer>
            <StyledProductsGrid>
                {data?.line?.products?.map((product: any) => (
                    <ProductCard key={product?.id} data={product} />
                ))}
            </StyledProductsGrid>
        </StyledLineView>
    )
}

const StyledLineView = styled.div`
    width: 100%;
    padding: ${rm(100)} ${rm(50)};

    ${media.md`
        padding: ${rm(100)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(90)} ${rm(16)};
    `}
`

const StyledHero = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(40)};

    ${media.xsm`
        gap: ${rm(30)};
    `}
`

const StyledTop = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: ${rm(20)};
    width: 100%;

    ${media.md`
        flex-direction: column;
        gap: ${rm(20)};
    `}

    // >:last-child {
    //     width: ${rm(550)};

    //     ${media.lg`
    //         width: ${rm(440)};
    //     `}

    //     ${media.md`
    //         width: ${rm(417)};
    //     `}

    //     ${media.xsm`
    //         width: 100%;
    //     `}
    // }
`

const StyledTopImageContainer = styled.div`
    width: 100%;
    height: ${rm(800)};
    position: relative;
    overflow: hidden;
    border-radius: ${rm(10)};

    .image ,.image-container {
        width: 100%;
        height: 100%;
    }

    ${media.lg`
        height: ${rm(600)};
    `}

    ${media.md`
        height: ${rm(539)};
    `}

    ${media.xsm`
        height: ${rm(246)};
    `}
`

const StyledProductsTitleContainer = styled.div`
    margin-top: ${rm(150)};
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(48)};
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
        margin-top: ${rm(70)};
    `}


    >:first-child{
        >:first-child{
            >:first-child{
                >:first-child{
                    >:first-child{
                        margin-right: 0.25em;
                    }
                }
            }
        }
    }

    h2 {
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

const StyledProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: start;
    gap: ${rm(20)};
    margin-top: ${rm(50)};

    ${media.md`
        grid-template-columns: repeat(3, 1fr);
        gap: ${rm(16)};
    `}

    ${media.xsm`
        grid-template-columns: repeat(2, 1fr);
        gap: ${rm(16)};
    `}
`