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