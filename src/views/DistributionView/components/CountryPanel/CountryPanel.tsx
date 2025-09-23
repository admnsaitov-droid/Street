import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { useState, useEffect } from "react"
import { distributionData, getFilterNames, Filter, getLocationsByFilter, Location as DistributionLocation } from "../../data/distributionData"
import { LocationCard } from "../LocationCard/LocationCard"

const filters = getFilterNames()



interface CountryPanelProps {
    activeFilterId?: string
    onFilterChange?: (filterId: string) => void
    onLocationClick?: (location: DistributionLocation | null) => void
    selectedLocation?: DistributionLocation | null
}

export const CountryPanel = ({ activeFilterId, onFilterChange, onLocationClick, selectedLocation }: CountryPanelProps) => {
    const [activeFilter, setActiveFilter] = useState('All')
    const [activeCard, setActiveCard] = useState<string | null>(null)
    const [animationPhase, setAnimationPhase] = useState<'idle' | 'hiding' | 'showing'>('idle')
    const [pendingLocation, setPendingLocation] = useState<DistributionLocation | null>(null)
    const [fadeContainerHeight, setFadeContainerHeight] = useState(0)

    // Sync activeCard state with selectedLocation changes (from tracker clicks)
    useEffect(() => {
        if (selectedLocation) {
            // IMMEDIATE: Set filter immediately for tracker clicks
            const regionFilterMap: { [key: string]: string } = {
                'Europe': 'Europe',
                'Africa': 'Africa',
                'America': 'America',
                'Asia': 'Asia'
            }
            const filterName = regionFilterMap[selectedLocation.region] || 'All'
            setActiveFilter(filterName)
            
            // Notify parent about filter change immediately
            const filter = distributionData.find((f: Filter) => f.name === filterName)
            if (filter && onFilterChange) {
                onFilterChange(filter.id)
            }
            
            // Start fade-container animation
            setPendingLocation(selectedLocation)
            setAnimationPhase('hiding')
            
            // Set activeCard immediately but keep it hidden
            setActiveCard(selectedLocation.id)
            
            // Animate fade-container from bottom to top
            setFadeContainerHeight(100)
            
            // Phase 2 - After fade-container covers all cards, show selected card (700ms delay)
            setTimeout(() => {
                setAnimationPhase('showing')
                
                // Keep fade-container at 100% to hide base cards - DON'T remove it
                // setFadeContainerHeight(0) // Commented out - keep fade visible
                
                // Phase 3 - Animation complete but keep card visible (500ms delay)
                setTimeout(() => {
                    setAnimationPhase('idle')
                    setPendingLocation(null)
                    // Keep activeCard and fadeContainerHeight at 100% to hide base cards
                }, 500)
            }, 700)
        } else {
            setActiveCard(null)
            setAnimationPhase('idle')
            setPendingLocation(null)
            setFadeContainerHeight(0)
        }
    }, [selectedLocation, onFilterChange])

    const handleFilterClick = (filterName: string) => {
        setActiveFilter(filterName)
        setActiveCard(null) // Reset active card when filter changes
        setAnimationPhase('idle')
        setFadeContainerHeight(0)
        // Find the filter ID from the name
        const filter = distributionData.find((f: Filter) => f.name === filterName)
        if (filter && onFilterChange) {
            onFilterChange(filter.id)
        }
    }

    const handleCardClick = (location: DistributionLocation) => {
        // Prevent clicks during animation
        if (animationPhase !== 'idle') return
        
        // Toggle card expansion
        if (activeCard === location.id) {
            setActiveCard(null)
            setAnimationPhase('idle')
            setFadeContainerHeight(0)
            // Reset planet rotation to initial state
            if (onLocationClick) {
                onLocationClick(null)
            }
        } else {
            // IMMEDIATE: Select point and rotate planet immediately
            if (onLocationClick) {
                onLocationClick(location)
            }
            
            // IMMEDIATE: Set filter immediately
            const regionFilterMap: { [key: string]: string } = {
                'Europe': 'Europe',
                'Africa': 'Africa',
                'America': 'America',
                'Asia': 'Asia'
            }
            const filterName = regionFilterMap[location.region] || 'All'
            setActiveFilter(filterName)
            
            // Notify parent about filter change immediately
            const filter = distributionData.find((f: Filter) => f.name === filterName)
            if (filter && onFilterChange) {
                onFilterChange(filter.id)
            }
            
            // Start fade-container animation
            setPendingLocation(location)
            setAnimationPhase('hiding')
            
            // Set activeCard immediately but keep it hidden
            setActiveCard(location.id)
            
            // Animate fade-container from bottom to top
            setFadeContainerHeight(100)
            
            // Phase 2 - After fade-container covers all cards, show selected card (700ms delay)
            setTimeout(() => {
                setAnimationPhase('showing')
                
                // Keep fade-container at 100% to hide base cards - DON'T remove it
                // setFadeContainerHeight(0) // Commented out - keep fade visible
                
                // Phase 3 - Animation complete but keep card visible (500ms delay)
                setTimeout(() => {
                    setAnimationPhase('idle')
                    setPendingLocation(null)
                    // Keep activeCard and fadeContainerHeight at 100% to hide base cards
                }, 500)
            }, 700)
        }
    }

    // Get locations for the active filter
    const activeFilterData = distributionData.find((f: Filter) => f.name === activeFilter)
    const allLocations = activeFilterData ? activeFilterData.locations : []
    
    // Show only the selected location when a card is active, otherwise show all locations
    const locations = activeCard 
        ? allLocations.filter(location => location.id === activeCard)
        : allLocations

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
                $hasActiveCard={!!activeCard}
            >
                {/* Fade Container Overlay */}
                <StyledFadeContainer
                    $height={fadeContainerHeight}
                    $animationPhase={animationPhase}
                />
                
                {/* All Cards - Always Visible and Untouched */}
                {allLocations.map((location) => (
                    <StyledCardWrapper key={location.id}>
                        <LocationCard 
                            location={location} 
                            onClick={() => handleCardClick(location)}
                            isExpanded={false} // No expansion for base cards
                        />
                    </StyledCardWrapper>
                ))}
                
                {/* Selected Card Instance - Appears from Top */}
                {activeCard && allLocations.find(loc => loc.id === activeCard) && (
                    <StyledSelectedCardWrapper
                        $animationPhase={animationPhase}
                    >
                        <LocationCard 
                            location={allLocations.find(loc => loc.id === activeCard)!}
                            onClick={() => handleCardClick(allLocations.find(loc => loc.id === activeCard)!)}
                            isExpanded={true}
                        />
                    </StyledSelectedCardWrapper>
                )}
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

const StyledCardsContainer = styled.div<{ $hasActiveCard: boolean }>`
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

const StyledFadeContainer = styled.div<{ 
    $height: number; 
    $animationPhase: 'idle' | 'hiding' | 'showing' 
}>`
    position: fixed;
    top: calc(${rm(113)} + ${rm(60)}); /* CountryPanel top + cards margin + filter height */
    left: calc(100vw - ${rm(440)} - ${rm(50)});
    right: ${rm(50)};
    width: ${rm(440)};
    height: ${({ $height }) => $height}%;
    background: linear-gradient(to top, 
        rgba(15, 15, 15, 1) 0%, 
        rgba(15, 15, 15, 1) 40%, 
        rgba(15, 15, 15, 1) 60%, 
        rgba(15, 15, 15, 1) 80%, 
        rgba(15, 15, 15, 0.95) 90%, 
        rgba(15, 15, 15, 0.9) 95%, 
        transparent 100%
    );
    backdrop-filter: blur(8px);
    z-index: 10;
    pointer-events: none;
    transition: height 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    
    ${({ $animationPhase }) => $animationPhase === 'showing' && `
        transition: height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1);
    `}
`

const StyledCardWrapper = styled.div`
    /* Base cards - always visible and untouched */
    margin-bottom: 10px;
    
    &:last-child {
        margin-bottom: 0;
    }
`

const StyledSelectedCardWrapper = styled.div<{ 
    $animationPhase: 'idle' | 'hiding' | 'showing' 
}>`
    position: fixed;
    top: calc(${rm(113)} + ${rm(60)}); /* CountryPanel top + cards margin + filter height */
    left: calc(100vw - ${rm(440)} - ${rm(50)});
    right: ${rm(50)};
    width: ${rm(440)};
    z-index: 20;
    overflow: hidden;
    
    /* Smooth slide down from top animation */
    transform: ${({ $animationPhase }) => {
        if ($animationPhase === 'hiding') {
            return 'translateY(-100%)'; // Start hidden above during fade
        }
        if ($animationPhase === 'showing') {
            return 'translateY(0)'; // Animate to final position
        }
        if ($animationPhase === 'idle') {
            return 'translateY(0)'; // Stay in final position
        }
        return 'translateY(-100%)'; // Default hidden state
    }};
    
    opacity: ${({ $animationPhase }) => {
        if ($animationPhase === 'hiding') {
            return 0; // Hidden during fade
        }
        if ($animationPhase === 'showing' || $animationPhase === 'idle') {
            return 1; // Visible when showing or idle
        }
        return 0; // Default hidden
    }};
    
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`