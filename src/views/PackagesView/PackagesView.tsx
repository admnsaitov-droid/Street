'use client'
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { Package } from "./screens/Package/Package"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"

interface PackagesViewProps {
    data: any
}

export const PackagesView = ({ data }: PackagesViewProps) => {
    console.log(data)

    const breadcrumbs = data?.breadcrumbs?.map((breadcrumb: any) => (
        { label: breadcrumb.text, slug: breadcrumb.link }
    ))
    
    return (
        <StyledPackagesView>
            <Breadcrumbs
                items={[
                    ...breadcrumbs
                ]}
            />
            <StyledTop>
                {data?.title && <StyledTitle tag="h1">{data?.title}</StyledTitle>}
                {data?.description && <StyledDescription tag="p">{data?.description}</StyledDescription>}
            </StyledTop>
            <StyledPackages>
                {data?.package?.map((item: any, index: number) => (
                    <Package key={index} data={item} productsCountText={data?.productsCountText} exploreText={data?.exploreText} />
                ))}
            </StyledPackages>
        </StyledPackagesView>
    )
}

const StyledPackagesView = styled.div`
    width: 100%;
    padding: ${rm(100)} ${rm(50)};
    padding-bottom: ${rm(150)};

    ${media.md`
        padding: ${rm(100)} ${rm(25)};
        padding-bottom: ${rm(150)};
    `}

    ${media.xsm`
        padding: ${rm(90)} ${rm(16)};
        padding-bottom: ${rm(70)};
    `}
`

const StyledTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${rm(80)};
    margin-top: ${rm(40)};

    ${media.md`
        flex-direction: column;
        gap: ${rm(20)};
        justify-content: flex-start;
    `}
    
    ${media.xsm`
        margin-top: ${rm(30)};
        gap: ${rm(15)};
        margin-bottom: ${rm(70)};
    `}
`

export const StyledTitle = styled(AnimatedText)`
    line-height: 85%;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    ${fontGolosText(600)};
    color: ${colors.black100};
    height: fit-content;
    font-size: ${rm(48)};

    ${media.lg`
        font-size: ${rm(40)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
    `}
`

const StyledDescription = styled(AnimatedText)`
    font-size: ${rm(40)};
    line-height: 115%;
    ${fontGolosText(400)};
    color: ${colors.black100};
    width: ${rm(1007)};

    span:nth-child(1){
        >:nth-child(1){
            padding-left: ${rm(113)} !important;
        }
    }

    ${media.lg`
        font-size: ${rm(32)};
        width: ${rm(777)};
    `}

    ${media.md`
        font-size: ${rm(24)};
        width: ${rm(475)};
        letter-spacing: -0.01em;

        span:nth-child(1){
            >:nth-child(1){
                padding-left: ${rm(0)} !important;
            }
        }
    `}

    ${media.xsm`
        font-size: ${rm(20)};
        width: 100%;
    `}
`

const StyledPackages = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`