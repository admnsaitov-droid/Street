"use client"
import styled from "styled-components"
import { Hero } from "./screens/Hero/Hero"
import { Inspiration } from "./screens/Inspiration/Inspiration"
import { History } from "./screens/History/History"
import { Purpose } from "./screens/Purpose/Purpose"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"

interface AboutViewProps {
    data: any
}

export const AboutView = ({ data }: AboutViewProps) => {
    return (
        <StyledAboutView>
            <StyledBreadcrumbsWrapper>
                <Breadcrumbs items={[
                    { label: 'Home', slug: '' },
                    { label: data?.aboutPage?.hero?.title || 'About', href: undefined },
                ]} />
            </StyledBreadcrumbsWrapper>
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

const StyledBreadcrumbsWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 100px 50px 0;
    z-index: 10;
    pointer-events: none;

    nav { pointer-events: all; }
`
