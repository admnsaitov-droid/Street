import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { useState, useEffect, useCallback } from "react"
import { distributionData, getFilterNames, Filter, getLocationsByFilter, Location as DistributionLocation } from "../../data/distributionData"
import { LocationCard } from "../LocationCard/LocationCard"
import { SelectedLocationCard } from "../LocationCard/SelectedLocationCard"

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
    const [displayedLocation, setDisplayedLocation] = useState<DistributionLocation | null>(null)
    const [isFadingOut, setIsFadingOut] = useState(false)
    const [isCardsAnimatingOut, setIsCardsAnimatingOut] = useState(false)
    const [isCardsAnimatingIn, setIsCardsAnimatingIn] = useState(false)
    const [hideAllCards, setHideAllCards] = useState(false)

    // Helper function to animate cards out sequentially
    const animateCardsOut = useCallback((locations: DistributionLocation[], selectedLocationId: string) => {
        setAnimationPhase('hiding')
        setIsCardsAnimatingOut(true)
        
        // After all cards have started animating out, show the selected card
        const totalAnimationTime = locations.length * 100 + 400 // 400ms for the slide animation
        setTimeout(() => {
            setHideAllCards(true)
            setAnimationPhase('showing')
            setDisplayedLocation(locations.find(loc => loc.id === selectedLocationId) || null)
            
            // Mark animation as complete
            setTimeout(() => {
                setAnimationPhase('idle')
                setPendingLocation(null)
            }, 500)
        }, totalAnimationTime)
    }, [])

    // Helper function to animate cards back in when closing
    const animateCardsIn = useCallback((locations: DistributionLocation[]) => {
        // First show all cards but keep them hidden
        setHideAllCards(false)
        setIsCardsAnimatingIn(true)
        
        // Small delay to ensure DOM update, then trigger animation
        setTimeout(() => {
            setIsCardsAnimatingIn(false) // This will trigger the CSS animation
        }, 50)
    }, [])

    // Sync activeCard state with selectedLocation changes (from tracker clicks)
    useEffect(() => {
        if (selectedLocation) {
            // Prevent animation conflicts - only start new animation if not currently animating
            if (animationPhase !== 'idle') {
                return
            }
            
            // If this is the same location that's already active, don't restart animation
            if (activeCard === selectedLocation.id) {
                return
            }
            
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
            
            // Get current locations for animation
            const activeFilterData = distributionData.find((f: Filter) => f.name === filterName)
            const currentLocations = activeFilterData ? activeFilterData.locations : []
            
            // Set activeCard immediately but start card animation sequence
            setActiveCard(selectedLocation.id)
            setPendingLocation(selectedLocation)
            
            // Start sequential card animation
            animateCardsOut(currentLocations, selectedLocation.id)
        } else {
            // Start fade-out animation when deselecting
            if (activeCard) {
                setIsFadingOut(true)
                setAnimationPhase('hiding')
                
                // After fade-out animation completes, animate cards back in
                setTimeout(() => {
                    setActiveCard(null)
                    setAnimationPhase('idle')
                    setPendingLocation(null)
                    setDisplayedLocation(null)
                    setIsFadingOut(false)
                    setIsCardsAnimatingOut(false)
                    
                    // Get current locations for entrance animation
                    const activeFilterData = distributionData.find((f: Filter) => f.name === activeFilter)
                    const currentLocations = activeFilterData ? activeFilterData.locations : []
                    animateCardsIn(currentLocations)
                }, 500) // Match the fade-out duration
            } else {
                setActiveCard(null)
                setAnimationPhase('idle')
                setPendingLocation(null)
                setDisplayedLocation(null)
                setIsFadingOut(false)
                setIsCardsAnimatingOut(false)
                setIsCardsAnimatingIn(false)
                setHideAllCards(false)
                setIsCardsAnimatingIn(false)
            }
        }
    }, [selectedLocation, onFilterChange, animateCardsOut, animateCardsIn, animationPhase, activeCard, activeFilter])

    const handleFilterClick = useCallback((filterName: string) => {
        setActiveFilter(filterName)
        
        // Start fade-out animation if there's an active card
        if (activeCard) {
            setIsFadingOut(true)
            setAnimationPhase('hiding')
            
            // After fade-out animation completes, reset all states
            setTimeout(() => {
                setActiveCard(null)
                setAnimationPhase('idle')
                setDisplayedLocation(null)
                setIsFadingOut(false)
                setIsCardsAnimatingOut(false)
                setIsCardsAnimatingIn(false)
                setHideAllCards(false)
            }, 500)
        } else {
            setActiveCard(null)
            setAnimationPhase('idle')
            setDisplayedLocation(null)
            setIsFadingOut(false)
            setIsCardsAnimatingOut(false)
            setHideAllCards(false)
        }
        
        // Find the filter ID from the name
        const filter = distributionData.find((f: Filter) => f.name === filterName)
        if (filter && onFilterChange) {
            onFilterChange(filter.id)
        }
    }, [activeCard, onFilterChange])

    const handleCardClick = useCallback((location: DistributionLocation) => {
        // Prevent clicks during animation
        if (animationPhase !== 'idle') return
        
        // Toggle card expansion
        if (activeCard === location.id) {
            // Start fade-out animation when deselecting
            setIsFadingOut(true)
            setAnimationPhase('hiding')
            
            // Reset planet rotation to initial state
            if (onLocationClick) {
                onLocationClick(null)
            }
            
            // After fade-out animation completes, animate cards back in
            setTimeout(() => {
                setActiveCard(null)
                setAnimationPhase('idle')
                setDisplayedLocation(null)
                setIsFadingOut(false)
                setIsCardsAnimatingOut(false)
                
                // Get current locations for entrance animation
                const activeFilterData = distributionData.find((f: Filter) => f.name === activeFilter)
                const currentLocations = activeFilterData ? activeFilterData.locations : []
                animateCardsIn(currentLocations)
            }, 500) // Match the fade-out duration
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
            
            // Get current locations for animation
            const activeFilterData = distributionData.find((f: Filter) => f.name === filterName)
            const currentLocations = activeFilterData ? activeFilterData.locations : []
            
            // Set activeCard immediately but start card animation sequence
            setActiveCard(location.id)
            setPendingLocation(location)
            
            // Start sequential card animation
            animateCardsOut(currentLocations, location.id)
        }
    }, [animationPhase, activeCard, onLocationClick, onFilterChange, animateCardsOut, animateCardsIn, activeFilter])

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
                {/* All Cards with Individual Animations */}
                {!hideAllCards && allLocations.map((location, index) => {
                    return (
                        <StyledCardWrapper 
                            key={location.id}
                            $isAnimatingOut={isCardsAnimatingOut}
                            $isAnimatingIn={isCardsAnimatingIn}
                            $animationDelay={index * 100}
                        >
                        <LocationCard 
                            location={location} 
                            onClick={() => handleCardClick(location)}
                            isExpanded={false} // No expansion for base cards
                        />
                    </StyledCardWrapper>
                    )
                })}
                
                {/* Selected Card Instance - Appears from Top */}
                {(activeCard || isFadingOut) && (
                    <StyledSelectedCardWrapper>
                        <SelectedLocationCard
                            location={displayedLocation || allLocations.find(loc => loc.id === activeCard)!}
                            onClick={() => handleCardClick(allLocations.find(loc => loc.id === activeCard)!)}
                            isExpanded={true}
                            animationPhase={animationPhase}
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
    border-radius: ${rm(8)};
    
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


const StyledCardWrapper = styled.div<{ 
    $isAnimatingOut: boolean; 
    $isAnimatingIn: boolean;
    $animationDelay: number; 
}>`
    /* Base cards - always visible and untouched */
    margin-bottom: 10px;
    
    /* CSS-based animation for better performance */
    opacity: ${({ $isAnimatingOut, $isAnimatingIn }) => {
        if ($isAnimatingOut) return 0;
        if ($isAnimatingIn) return 0;
        return 1;
    }};
    
    transform: ${({ $isAnimatingOut, $isAnimatingIn }) => {
        if ($isAnimatingOut) return 'translateY(30%)';
        if ($isAnimatingIn) return 'translateY(-30%)';
        return 'translateY(0)';
    }};
    
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: ${({ $animationDelay, $isAnimatingOut, $isAnimatingIn }) => {
        if ($isAnimatingOut) return `${$animationDelay}ms`;
        if ($isAnimatingIn) return `${$animationDelay}ms`;
        return '0ms';
    }};
    
    &:last-child {
        margin-bottom: 0;
    }
`

const StyledSelectedCardWrapper = styled.div`
    position: fixed;
    top: calc(${rm(113)} + ${rm(60)}); /* CountryPanel top + cards margin + filter height */
    left: calc(100vw - ${rm(440)} - ${rm(50)});
    right: ${rm(50)};
    width: ${rm(440)};
    z-index: 20;
    overflow: hidden;
`
