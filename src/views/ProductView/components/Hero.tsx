import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import styled from "styled-components"
import { DynamicProductScene as ProductScene } from "./Scene/DynamicProductScene"
import { ColorPaletre } from "./ColorPaletre/ColoPaletre"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"


interface HeroProps {
    data: any
    colors: {
        name: string
        color: string
    }[]
}

export const Hero = ({ data, colors }: HeroProps) => {

    const breadcrumbs = data?.breadcrumbs?.map((breadcrumb: any) => (
        { label: breadcrumb.text, slug: breadcrumb.link }
    ))

    return (
        <StyledHero>
            <StyledContent>
                <Breadcrumbs
                    items={[
                        ...breadcrumbs,
                        { label: data?.name || "", href: undefined },
                    ]}
                />
                <div className="top">
                    <StyledTitle>{data?.name}</StyledTitle>
                    <StyledSubtitle>{data?.model}</StyledSubtitle>
                </div>
            </StyledContent>
            <ProductScene data={data?.model3D} colors={colors} />
            <ColorPaletre colors={colors} />
        </StyledHero>
    )
}

const StyledHero = styled.div`
    width: 100%;
    ${heightLvh(100)};
    background-color:#F8F9FC;
    position: relative;

    ${media.xsm`
        overflow: hidden;
    `}
`

const StyledContent = styled.div`
    padding: ${rm(100)} ${rm(50)};
    position: relative;
    z-index: 10;

    ${media.md`
        padding: ${rm(100)} ${rm(25)};
        padding-bottom: ${rm(50)};
    `}

    ${media.xsm`
        padding: ${rm(90)} ${rm(16)};
        padding-bottom: ${rm(20)};
    `}

    .top{
        display: flex;
        flex-direction: column;
        gap: ${rm(20)};
        margin-top: ${rm(40)};

        ${media.xsm`
            margin-top: ${rm(30)};
        `}
    }
`

const StyledTitle = styled(AnimatedText)`
    font-size: ${rm(48)};
    ${fontGolosText(600)};
    color: ${colors.black100};
    line-height: 90%;
    letter-spacing: -0.01em;
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(40)};
    `}
`

const StyledSubtitle = styled(AnimatedText)`
    font-size: ${rm(20)};
    ${fontGolosText(400)};
    line-height: 110%;
    color: ${colors.gray};
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(16)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
    `}
`