'use client'
import { media, colors, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import styled from "styled-components"

interface ProjectsViewProps {
    data: any
}

export const ProjectsView = ({ data }: ProjectsViewProps) => {

    console.log(data);
    
    return (
        <StyledProjectsView>
            <StyledContent>
                <StyledTitle>
                    <span>{data?.projectsPage?.title?.textFirst}</span>
                    <span className="first">{data?.projectsPage?.title?.textSecond}</span>
                </StyledTitle>
            </StyledContent>
        </StyledProjectsView>
    )
}

const StyledProjectsView = styled.div`
    width: 100%;
    ${heightLvh(100)};
    background-color: #0000004D;
`

const StyledContent = styled.div`
    padding: ${rm(110)} ${rm(50)};
    width: 100%;
`

const StyledTitle = styled.p`
    width: ${rm(1000)};
    margin-bottom: ${rm(20)};
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(100)};
    text-transform: uppercase;
    ${fontGolosText(600)};
    color: ${colors.white100};

    ${media.lg`
        font-size: ${rm(80)};
        width: ${rm(780)};
    `}

    ${media.md`
        font-size: ${rm(56)};
        width: ${rm(600)};
    `}

    ${media.xsm`
        width: 100%;
        font-size: ${rm(40)};
    `}

    .first{
        ${fontSageGrotesk(400)} !important;
        color: ${colors.red} !important;
        margin-right: ${rm(10)};
        letter-spacing: -0.02em;
    }
`