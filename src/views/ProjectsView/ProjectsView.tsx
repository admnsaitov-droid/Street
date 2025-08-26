'use client'
import { media, colors, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import styled from "styled-components"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { ProjectsMapEmbed } from "./components/ProjectsMapEmbed"

interface ProjectsViewProps {
    data: any
}

export const ProjectsView = ({ data }: ProjectsViewProps) => {

    console.log(data);
    
    return (
        <StyledProjectsView>
            <StyledContent>
                <StyledTitleContainer>
                    <AnimatedGrid
                        type="words"
                        animation={{
                            from: { opacity: 0, y: '40px' },
                            to: { opacity: 1, y: '0px' },
                            delayStep: 60
                        }}
                        overflow={true}
                        gap={{ horizontal: '0.25em', vertical: '0.25em' }}
                        containerStyle={{ overflow: 'hidden' }}
                        cellConfigs={{
                            'title-first': {
                                style: {
                                    color: colors.white100,
                                    fontFamily: 'var(--font-golos-text)',
                                    fontOpticalSizing: 'auto',
                                    fontWeight: 600,
                                    fontStyle: 'normal',
                                }
                            },
                            'title-second': {
                                style: {
                                    color: colors.red,
                                    fontFamily: 'var(--font-sage-grotesk)',
                                    fontOpticalSizing: 'auto',
                                    fontWeight: 400,
                                    fontStyle: 'normal',
                                    lineHeight: '105%',
                                }
                            }
                        }}
                    >
                        <span id="title-first">{data?.projectsPage?.title?.textFirst}</span>
                        <span id="title-second" className="first">{data?.projectsPage?.title?.textSecond}</span>
                    </AnimatedGrid>
                </StyledTitleContainer>
            </StyledContent>
            <ProjectsMapEmbed
                location="New York, NY"
                zoom={13}
                width="100%"
                height="100%"
            />
        </StyledProjectsView>
    )
}

const StyledProjectsView = styled.div`
    width: 100%;
    ${heightLvh(100)};
    background-color: #0000004D;
    position: relative;
`

const StyledContent = styled.div`
    padding: ${rm(110)} ${rm(50)};
    width: 100%;
    position: relative;
    z-index: 1;
`

const StyledTitleContainer = styled.div`
    width: ${rm(1000)};
    margin-bottom: ${rm(20)};
    line-height: 90%;
    letter-spacing: -0.01em;
    font-size: ${rm(100)};
    text-transform: uppercase;

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
`