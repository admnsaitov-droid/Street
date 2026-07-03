import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"

interface SpecificationsProps {
    specifications: any
}

export const Specifications = ({ specifications }: SpecificationsProps) => {
    return (
        <StyledSpecifications>
            {specifications?.map((specification: any) => (
                <StyledSpecification key={specification?.id}>
                    <StyledParam>{specification?.param}</StyledParam>
                    <StyledValue>{specification?.value}</StyledValue>
                </StyledSpecification>
            ))}
        </StyledSpecifications>
    )
}

const StyledSpecifications = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: ${rm(240)} minmax(0, 1fr);
    column-gap: ${rm(72)};
    row-gap: ${rm(15)};
    padding-bottom: ${rm(10)};

    ${media.md`
        grid-template-columns: ${rm(190)} minmax(0, 1fr);
    `}

    ${media.xsm`
        grid-template-columns: ${rm(170)} minmax(0, 1fr);
        column-gap: ${rm(72)};
        row-gap: ${rm(15)};
    `}
`

const StyledSpecification = styled.div`
    display: contents;
`

const StyledValue = styled(AnimatedText)`
    font-size: ${rm(20)};
    ${fontGolosText(400)};
    line-height: 130%;
    color: ${colors.black100};
    min-width: 0;
    overflow-wrap: normal;
    align-self: center;

    ${media.lg`
        font-size: ${rm(16)};
    `}

    ${media.md`
        align-self: flex-start;
    `}

    ${media.xsm`
        font-size: ${rm(14)};
    `}
`

const StyledParam = styled(AnimatedText)`
    font-size: ${rm(20)};
    ${fontGolosText(400)};
    line-height: 110%;
    color: ${colors.gray};
    text-transform: uppercase;
    white-space: nowrap;
    align-self: center;

    ${media.lg`
        font-size: ${rm(16)};
    `}

    ${media.md`
        align-self: flex-start;
    `}

    ${media.xsm`
        font-size: ${rm(14)};
    `}
`
