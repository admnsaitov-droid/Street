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
    display: flex;
    flex-direction: column;
    gap: ${rm(15)};
    padding-bottom: ${rm(10)};

    ${media.xsm`
        gap: ${rm(20)};
    `}
`

const StyledSpecification = styled.div`
    display: flex;
    gap: ${rm(10)};
    align-items: center;

    ${media.md`
        align-items: flex-start;
    `}
`

const StyledValue = styled(AnimatedText)`
    font-size: ${rm(20)};
    ${fontGolosText(400)};
    line-height: 130%;
    color: ${colors.black100};

    ${media.lg`
        font-size: ${rm(16)};
    `}

    ${media.md`
        width: ${rm(305)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
        width: ${rm(189)};
    `}
`

const StyledParam = styled(AnimatedText)`
    font-size: ${rm(20)};
    ${fontGolosText(400)};
    line-height: 110%;
    color: ${colors.gray};
    text-transform: uppercase;
    width: 25%;

    ${media.lg`
        font-size: ${rm(16)};
    `}

    ${media.md`
        width: ${rm(160)};
    `}

    ${media.xsm`
        font-size: ${rm(14)};
        width: ${rm(124)};
    `}
`
