"use client"
import styled from "styled-components"
import { Hero } from "./screens/Hero/Hero"
import { Inspiration } from "./screens/Inspiration/Inspiration"
import { History } from "./screens/History/History"
import { Purpose } from "./screens/Purpose/Purpose"

interface AboutViewProps {
    data: any
}

export const AboutView = ({ data }: AboutViewProps) => {
    console.log(data)
    return (
        <StyledAboutView>
            <Hero data={data?.aboutPage?.hero} />
            <Inspiration data={data?.aboutPage?.inspiration} />
            <History data={data?.aboutPage?.history} />
            <Purpose data={data?.aboutPage?.purpose} />
        </StyledAboutView>
    )
}

const StyledAboutView = styled.div`
    width: 100%;
`
