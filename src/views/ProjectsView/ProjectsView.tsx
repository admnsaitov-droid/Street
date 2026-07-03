'use client'
import { media, colors, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import styled from "styled-components"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { ProjectsMap } from "./components/ProjectsMap"
import { MapMarker } from "./components/MapMarker"

interface ProjectsViewProps {
    data: any
}

export const ProjectsView = ({ data }: ProjectsViewProps) => {

    console.log(data);

    const mapCenter = {
        lat: 30,
        lng: 10.3522222,
    }

    const zoom = 2.6
    
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
                <Breadcrumbs items={[
                    { label: 'Home', slug: '' },
                    { label: [data?.projectsPage?.title?.textFirst, data?.projectsPage?.title?.textSecond].filter(Boolean).join(' ') || 'Projects', href: undefined },
                ]} />
                <StyledTitleContainer>
                    <h1>
                        <AnimatedGrid
                            tag="span"
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
                                        color: colors.black100,
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
            <MapContainer>
                <ProjectsMap
                    center={mapCenter}
                    zoom={zoom}
                    markers={markers || []}
                />
            </MapContainer>
        </StyledProjectsView>
    )
}

const StyledProjectsView = styled.div`
    width: 100%;
    background-color: #F8F9FC;
    position: relative;
`

const StyledContent = styled.div`
    padding: ${rm(110)} ${rm(50)};
    padding-bottom: ${rm(25)};
    width: 100%;
    position: relative;
    z-index: 1;
    user-select: none;
    pointer-events: none;

    ${media.xsm`
        padding: ${rm(92)} ${rm(16)};
        padding-bottom: ${rm(25)};
    `}
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
        font-size: ${rm(38)};
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

const MapContainer = styled.div`
    ${heightLvh(100)};
    width: 100%;
    position: relative;
    overflow: hidden;
`