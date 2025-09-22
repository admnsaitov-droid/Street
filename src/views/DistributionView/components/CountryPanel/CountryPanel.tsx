import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { useState, useEffect } from "react"
import { distributionData, getFilterNames, Filter, getLocationsByFilter, Location as DistributionLocation } from "../../data/distributionData"
import { LocationCard } from "../LocationCard/LocationCard"

const filters = getFilterNames()



interface CountryPanelProps {
    onFilterChange?: (filterId: string) => void
    onLocationClick?: (location: DistributionLocation | null) => void
    selectedLocation?: DistributionLocation | null
}

export const CountryPanel = ({ onFilterChange, onLocationClick, selectedLocation }: CountryPanelProps) => {
    const [activeFilter, setActiveFilter] = useState('All')
    const [activeCard, setActiveCard] = useState<string | null>(null)

    // Sync activeCard state with selectedLocation changes (from tracker clicks)
    useEffect(() => {
        if (selectedLocation) {
            setActiveCard(selectedLocation.id)
        } else {
            setActiveCard(null)
        }
    }, [selectedLocation])

    const handleFilterClick = (filterName: string) => {
        setActiveFilter(filterName)
        setActiveCard(null) // Reset active card when filter changes
        // Find the filter ID from the name
        const filter = distributionData.find((f: Filter) => f.name === filterName)
        if (filter && onFilterChange) {
            onFilterChange(filter.id)
        }
    }

    const handleCardClick = (location: DistributionLocation) => {
        // Toggle card expansion
        if (activeCard === location.id) {
            setActiveCard(null)
            // Reset planet rotation to initial state
            if (onLocationClick) {
                onLocationClick(null)
            }
        } else {
            setActiveCard(location.id)
            // Rotate planet to location
            if (onLocationClick) {
                onLocationClick(location)
            }
        }
    }

    // Get locations for the active filter
    const activeFilterData = distributionData.find((f: Filter) => f.name === activeFilter)
    const locations = activeFilterData ? activeFilterData.locations : []

    return (
        <StyledCountryPanel>
            <StyledTopContainer>
                {filters.map((filter: string) => (
                    <div 
                        key={filter}
                        className={`filter ${activeFilter === filter ? 'active' : ''}`} 
                        onClick={() => handleFilterClick(filter)}
                    >
                        {filter}
                    </div>
                ))}
            </StyledTopContainer>
            
            <StyledCardsContainer
                onWheel={(e) => {
                    e.stopPropagation()
                }}
                onTouchMove={(e) => {
                    e.stopPropagation()
                }}
            >
                {locations.map((location) => (
                    <LocationCard 
                        key={location.id} 
                        location={location} 
                        onClick={() => handleCardClick(location)}
                        isExpanded={activeCard === location.id}
                    />
                ))}
            </StyledCardsContainer>
        </StyledCountryPanel>
    )
}

const StyledCountryPanel = styled.div`
    position: absolute;
    top: ${rm(110)};
    right: ${rm(50)};
    height: calc(100% - ${rm(110)});
    width: ${rm(440)};
    z-index: 1000;
    display: flex;
    flex-direction: column;

    /* Mask for transparency effect at the bottom */
    mask: linear-gradient(to bottom, black 0%, black calc(100% - ${rm(60)}), transparent 100%);
    -webkit-mask: linear-gradient(to bottom, black 0%, black calc(100% - ${rm(60)}), transparent 100%);

    ${media.xsm`
        display: none;
    `}
`

const StyledTopContainer = styled.div`
    display: flex;
    width: 100%;
    gap: ${rm(4)};
    border: 1px solid #B7BCCA33;
    background-color: #6F768526;
    backdrop-filter: blur(32px);
    border-radius: ${rm(8)};

    .filter{
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: ${rm(14)} 0;
        background-color: transparent;
        color: ${colors.white100};
        ${fontGolosText(400)};
        font-size: ${rm(16)};
        line-height: 130%;
        border-radius: ${rm(6)};
        cursor: pointer;
        user-select: none;
        // backdrop-filter: blur(88px);

        ${media.lg`
            font-size: ${rm(14)};
        `}

        transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out, transform 0.2s ease-in-out;

        &:not(.active):hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }

    .active{
        background-color: ${colors.white100};
        color: ${colors.black100};
    }
`

const StyledCardsContainer = styled.div`
    margin-top: ${rm(12)};
    // padding-right: ${rm(8)};
    padding-bottom: ${rm(40)};
    flex: 1;
    overflow-y: auto;
    position: relative;
    
    /* Prevent scroll from bubbling to parent */
    overscroll-behavior: contain;
    
    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
        width: ${rm(6)};
    }
    
    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: ${rm(3)};
    }
    
    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: ${rm(3)};
        transition: background 0.2s ease;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.4);
    }
    
    /* Smooth scrolling */
    scroll-behavior: smooth;
    
    /* Firefox scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
`