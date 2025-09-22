import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import { StyledTitle } from "@/views/PackagesView/PackagesView"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import Image from "next/image"
import styled from "styled-components"
import dynamic from "next/dynamic"

const PackageScene = dynamic(() => import("./DynamicPackageScene").then((mod) => mod.DynamicPackageScene), {
    ssr: false,
})

interface HeroProps {
    data: any
    breadcrumbs: any
}

export const Hero = ({ data, breadcrumbs }: HeroProps) => {

    return (
        <StyledHero>
            <PackageScene />
            {/* <StyledBackgroundImage src={`/packages/${data?.slug.toLowerCase()}.jpg`} alt='preview-image' fill/> */}
            <StyledContent>
                <Breadcrumbs
                    items={[
                        ...breadcrumbs,
                        // { label: data?.hero?.title || data?.title || "", href: undefined },
                    ]}
                />
                <StyledTitle style={{ userSelect: 'none', pointerEvents: 'none' }}>{data?.hero?.title}</StyledTitle>
                <StyledDescription style={{ userSelect: 'none', pointerEvents: 'none' }}>{data?.hero?.description}</StyledDescription>
            </StyledContent>
        </StyledHero>
    )
}

const StyledHero = styled.div`
    width: 100%;
    ${heightLvh(100)};
    position: relative;
    background-color: ${colors.bgGray};
`

const StyledContent = styled.div`
    // width: 100%;
    // height: 100%;
    padding: ${rm(100)} ${rm(50)};
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};
    position: relative;
    z-index: 10;

    ${media.md`
        padding: ${rm(100)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(90)} ${rm(16)};
    `}
`

const StyledDescription = styled(AnimatedText)`
    font-size: ${rm(20)};
    line-height: 130%;
    ${fontGolosText(400)};
    color: ${colors.gray};
    width: ${rm(540)};
    user-select: none;
    pointer-events: none;

    ${media.lg`
        font-size: ${rm(16)};
        width: ${rm(420)};
    `}

    ${media.md`
        font-size: ${rm(16)};
        width: ${rm(354)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
        width: 100%;
    `}
`