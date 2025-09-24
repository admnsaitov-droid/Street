import { AnimatedText } from "@/components/animated/AnimatedText/AnimatedText"
import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"

interface HeroProps {
    heroData: any
}

export const Hero = ({ heroData }: HeroProps) => {
    return (
        <StyledHero>
            <h2>Packages</h2>
        </StyledHero>
    )
}

const StyledHero = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`

const StyledTitle = styled(AnimatedText)`
    font-size: ${rm(100)};
    ${fontGolosText(600)};
    letter-spacing: -0.02em;
    line-height: 85%;
    color: ${colors.black100};

    ${media.lg`
        font-size: ${rm(80)};    
    `}
`

const StyledDescription = styled(AnimatedText)`
    font-size: ${rm(40)};
    ${fontGolosText(400)};
    color: ${colors.black100};
    line-height: 115%;
    letter-spacing: -0.01em;
    color: ${colors.black100};

    span:nth-child(2){
        padding-left: ${rm(113)} !important;
    }

    ${media.lg`
        font-size: ${rm(32)};
        width: ${rm(777)};    
    `}

    ${media.md`
        font-size: ${rm(24)};
    `}

    ${media.xsm`
        font-size: ${rm(20)};
    `}

    span:nth-child(2){
        ${media.md`
            padding-left: ${rm(0)} !important;
        `}

        ${media.xsm`
            padding-left: ${rm(0)} !important;
        `}
    }
`