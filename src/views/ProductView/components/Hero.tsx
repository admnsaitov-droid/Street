import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import styled from "styled-components"

interface HeroProps {
    data: any
}

export const Hero = ({ data }: HeroProps) => {
    return (
        <StyledHero>
            <StyledContent>
                <Breadcrumbs
                    items={[
                        { label: "Home", slug: "" },
                        { label: "Products", slug: "products" },
                        { label: data?.name || "", href: undefined },
                    ]}
                />
                <div className="top">
                    <StyledTitle>{data?.name}</StyledTitle>
                    <StyledSubtitle>{data?.model}</StyledSubtitle>
                </div>
            </StyledContent>
        </StyledHero>
    )
}

const StyledHero = styled.div`
    width: 100%;
    ${heightLvh(100)};
    background-color:rgb(20, 37, 51);
`

const StyledContent = styled.div`
    padding: ${rm(100)} ${rm(50)};

    .top{
        display: flex;
        flex-direction: column;
        gap: ${rm(20)};
        margin-top: ${rm(40)};
    }
`

const StyledTitle = styled.p`
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

const StyledSubtitle = styled.p`
    font-size: ${rm(20)};
    ${fontGolosText(400)};
    line-height: 110%;
    color: ${colors.gray};
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(16)};
    `}
`