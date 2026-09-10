'use client'
import { media, colors, rm } from "@/styles"
import { fontGolosText, fontSageGrotesk } from "@/styles/fonts"
import { heightLvh } from "@/styles/utils"
import styled from "styled-components"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DynamicDistributionScene as DistributionScene } from "./components/DynamicScene"
import AnimatedGrid from "@/components/animated/AnimatedContent"
import { CountryPanel } from "./components/CountryPanel/CountryPanel"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs"
import { Location as DistributionLocation } from "./data/distributionData"
import { getAllDynamicLocations, transformDynamicData } from "./data/dynamicDataTransformer"
import { CountryPanelMobile } from "./components/CountryPanel/CountryPanelMobile"
import { useWindowWidth } from "@react-hook/window-size"
interface DistributionViewProps {
    data: any
}

// Helper functions for URL parameter management
const updateLocationParam = (router: any, locationId: string | null) => {
    const url = new URL(window.location.href)
    if (locationId) {
        url.searchParams.set('location', locationId)
    } else {
        url.searchParams.delete('location')
    }
    router.replace(url.pathname + url.search, { scroll: false })
}

const getLocationFromParam = (locationParam: string | null, data: any): DistributionLocation | null => {
    if (!locationParam || !data?.distributionPage) return null
    const allLocations = getAllDynamicLocations(data)
    return allLocations.find(location => location.id === locationParam) || null
}

export const DistributionView = ({ data }: DistributionViewProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeFilterId, setActiveFilterId] = useState('all')
    const [selectedLocation, setSelectedLocation] = useState<DistributionLocation | null>(null)
    const isInternalLocationChange = useRef(false)
    const width = useWindowWidth()

    console.log('data', data)

    // Check URL parameter on mount and set selected location
    useEffect(() => {
        // Skip if this is an internal location change to prevent rerender conflicts
        if (isInternalLocationChange.current) {
            isInternalLocationChange.current = false
            return
        }
        
        const locationParam = searchParams.get('location')
        const locationFromParam = getLocationFromParam(locationParam, data)
        
        // Only update if the location is actually different
        if (locationFromParam?.id !== selectedLocation?.id) {
            if (locationFromParam) {
                setSelectedLocation(locationFromParam)
                // Set the appropriate filter based on the location's region
                const regionFilterMap: { [key: string]: string } = {
                    'Europe': 'europe',
                    'Africa': 'africa', 
                    'America': 'america',
                    'Asia': 'asia'
                }
                const filterId = regionFilterMap[locationFromParam.region] || 'all'
                setActiveFilterId(filterId)
            } else if (selectedLocation) {
                // Only clear if we had a location before
                setSelectedLocation(null)
            }
        }
    }, [searchParams, selectedLocation])

    const handleFilterChange = (filterId: string) => {
        setActiveFilterId(filterId)
    }

    const handleLocationClick = (location: DistributionLocation | null) => {
        // Mark this as an internal change to prevent useEffect rerender conflicts
        isInternalLocationChange.current = true
        setSelectedLocation(location)
        // Update URL parameter silently
        updateLocationParam(router, location?.id || null)
    }

    return (
        <StyledDistributionView>
            <StyledSceneWrapper>
                <StyledContent>
                    <Breadcrumbs items={[
                        { label: 'Home', slug: '' },
                        { label: data?.distributionPage?.title?.textFirst || 'Distribution', href: undefined },
                    ]} />
                    <StyledTitleContainer>
                        <h1>
                            {/* Crawlable/accessible title: AnimatedGrid only paints text client-side,
                                so the real title text is provided here for SSR HTML and screen readers. */}
                            <VisuallyHidden>
                                {[data?.distributionPage?.title?.textFirst, data?.distributionPage?.title?.textSecond]
                                    .map((part: string | undefined) => part?.trim())
                                    .filter(Boolean)
                                    .join(' ')}
                            </VisuallyHidden>
                            <span aria-hidden="true">
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
                                            color: colors.red,
                                            fontFamily: 'var(--font-sage-grotesk)',
                                            fontOpticalSizing: 'auto',
                                            fontWeight: 400,
                                            fontStyle: 'normal',
                                        }
                                    },
                                    'title-second': {
                                        style: {
                                            color: colors.white100,
                                            fontFamily: 'var(--font-sage-grotesk)',
                                            fontOpticalSizing: 'auto',
                                            fontWeight: 400,
                                            fontStyle: 'normal',
                                        }
                                    }
                                }}
                            >
                                <span id="title-first">{data?.distributionPage?.title?.textFirst}</span>
                                <br />
                                <span id="title-second" className="first">{data?.distributionPage?.title?.textSecond}</span>
                            </AnimatedGrid>
                            </span>
                        </h1>
                    </StyledTitleContainer>
                </StyledContent>
                <DistributionScene 
                    activeFilterId={activeFilterId} 
                    onLocationClick={handleLocationClick}
                    selectedLocation={selectedLocation}
                    data={data}
                />
            </StyledSceneWrapper>
            {width > 768 ? <CountryPanel 
                activeFilterId={activeFilterId}
                onFilterChange={handleFilterChange} 
                onLocationClick={handleLocationClick} 
                selectedLocation={selectedLocation}
                data={data}
            /> : <CountryPanelMobile 
                activeFilterId={activeFilterId}
                onFilterChange={handleFilterChange}
                onLocationClick={handleLocationClick}
                selectedLocation={selectedLocation}
                data={data}
            />}
        </StyledDistributionView>
    )
}

// Accessible/crawlable text that stays out of the visual layout.
const VisuallyHidden = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`

const StyledDistributionView = styled.div`
    width: 100%;
    ${heightLvh(100)};
    background-color: ${colors.black100};
    position: relative;

    ${media.md`
        height: auto;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    `}

    ${media.xsm`
        height: auto;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    `}
`

const StyledContent = styled.div`
    padding: ${rm(110)} ${rm(50)};
    width: 100%;
    position: relative;
    z-index: 4;
    user-select: none;
    pointer-events: none;

    ${media.xsm`
        padding: ${rm(100)} ${rm(16)};
    `}
`

const StyledSceneWrapper = styled.div`
    width: 100%;
    height: 100%;
    position: relative;

    ${media.md`
        ${heightLvh(100)};
        min-height: 100vh;
    `}

    ${media.xsm`
        ${heightLvh(100)};
        min-height: 100vh;
    `}
`

const StyledTitleContainer = styled.div`
    width: 100%;
    margin-bottom: ${rm(20)};
    line-height: 90%;
    font-size: ${rm(100)};
    text-transform: uppercase;

    ${media.lg`
        font-size: ${rm(80)};
    `}

    ${media.md`
        font-size: ${rm(56)};
    `}

    ${media.xsm`
        font-size: ${rm(32)};
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