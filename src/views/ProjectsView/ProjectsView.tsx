'use client'
import { media, colors, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import styled from "styled-components"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { ProjectsMap } from "./components/ProjectsMap"
import { MapMarker } from "./components/MapMarker"

interface ProjectsViewProps {
    data: any
}

export const ProjectsView = ({ data }: ProjectsViewProps) => {

    console.log(data);

    const mapCenter = {
        lat: parseFloat(data?.projectsPage?.mapSettings?.mapLat) || 0,
        lng: parseFloat(data?.projectsPage?.mapSettings?.mapLng) || 0
    }

    const zoom = parseInt(data?.projectsPage?.mapSettings?.zoom) || 10
    
    const markers = data?.projectsPage?.markers?.map((marker: any) => ({
        position: {
            lat: parseFloat(marker?.lat) || 0,
            lng: parseFloat(marker?.lng) || 0
        },
        title: marker?.title,
        address: marker?.address,
        image: marker?.image,
        linkText: marker?.linkText,
        onLinkClick: () => console.log("View details clicked")
    }))
    
    return (
        <StyledProjectsView>
            <StyledContent>
                <StyledTitleContainer>
                    <h1>
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
                    </h1>
                </StyledTitleContainer>
            </StyledContent>
            <ProjectsMap
                center={mapCenter}
                zoom={zoom}
                markers={markers}
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
    user-select: none;
    pointer-events: none;
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

    h1 {
        margin: 0;
        padding: 0;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        color: inherit;
        text-transform: inherit;
        font-family: inherit;
    }
`