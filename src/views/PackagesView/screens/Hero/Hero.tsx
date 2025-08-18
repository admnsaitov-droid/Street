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
            <h1>Packages</h1>
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
    line-height: 100%;
    text-indent: ${rm(113)};
    letter-spacing: -0.01em;
    color: ${colors.black100};

    ${media.lg`
        font-size: ${rm(32)};
        width: ${rm(777)};    
    `}
`