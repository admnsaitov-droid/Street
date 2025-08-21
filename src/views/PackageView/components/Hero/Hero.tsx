import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import { StyledTitle } from "@/views/PackagesView/PackagesView"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import Image from "next/image"
import styled from "styled-components"

interface HeroProps {
    data: any
}

export const Hero = ({ data }: HeroProps) => {

    return (
        <StyledHero>
            <StyledBackgroundImage src={`/packages/${data?.slug.toLowerCase()}.jpg`} alt='preview-image' fill/>
            <StyledContent>
                <Breadcrumbs
                    items={[
                        { label: "Home", slug: "" },
                        { label: "Packages", slug: "packages" },
                        { label: data?.hero?.title || data?.title || "", href: undefined },
                    ]}
                />
                <StyledTitle>{data?.hero?.title}</StyledTitle>
                <StyledDescription>{data?.hero?.description}</StyledDescription>
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
    width: 100%;
    height: 100%;
    padding: ${rm(100)} ${rm(50)};
    display: flex;
    flex-direction: column;
    gap: ${rm(20)};
    position: relative;
    z-index: 1;

    ${media.md`
        padding: ${rm(100)} ${rm(25)};
    `}

    ${media.xsm`
        padding: ${rm(90)} ${rm(16)};
    `}
`

const StyledBackgroundImage = styled(Image)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

const StyledDescription = styled.p`
    font-size: ${rm(20)};
    line-height: 130%;
    ${fontGolosText(400)};
    color: ${colors.gray};
    width: ${rm(540)};

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