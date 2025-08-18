import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"

interface DescriptionProps {
    model: any,
    description: any,
}

export const Description = ({ model, description }: DescriptionProps) => {
    return (
        <StyledDescription>
            <StyledTitle>{model}</StyledTitle>
            <StyledSubtitle>{description}</StyledSubtitle>
        </StyledDescription>
    )
}

const StyledDescription = styled.div`
    width: ${rm(550)};
    display: flex;
    flex-direction: column;
    gap: ${rm(15)};

    ${media.lg`
        width: ${rm(440)};
    `}
`

const StyledTitle = styled.h1`
    font-size: ${rm(20)};
    ${fontGolosText(400)};
    line-height: 110%;
    color: ${colors.black100};
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(16)};
    `}
`

const StyledSubtitle = styled.p`
    font-size: ${rm(20)};
    color: ${colors.gray};
    ${fontGolosText(400)};
    line-height: 130%;
    width: 100%;
    word-break: break-word;

    ${media.lg`
        font-size: ${rm(16)};
    `}
`