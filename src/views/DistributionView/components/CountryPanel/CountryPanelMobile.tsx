import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { useState, useEffect, useCallback } from "react"
import { distributionData, getFilterNames, Filter, getLocationsByFilter, Location as DistributionLocation } from "../../data/distributionData"
import { LocationCard } from "../LocationCard/LocationCard"
import { SelectedLocationCard } from "../LocationCard/SelectedLocationCard"
import { SelectedLocationCardMobile } from "../LocationCard/SelectedLocationCardMobile"

const filters = getFilterNames()



interface CountryPanelMobileProps {
    activeFilterId?: string
    onFilterChange?: (filterId: string) => void
    onLocationClick?: (location: DistributionLocation | null) => void
    selectedLocation?: DistributionLocation | null
}

export const CountryPanelMobile = ({ activeFilterId, onFilterChange, onLocationClick, selectedLocation }: CountryPanelMobileProps) => {
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
    const animateCardsOut = useCallback((locations: DistributionLocation[], selectedLocationId: string, newFilterName?: string) => {
        setAnimationPhase('hiding')
        setIsCardsAnimatingOut(true)
        
        // After all cards have started animating out, change filter and show the selected card
        const totalAnimationTime = Math.min(locations.length * 50 + 200, 600) // Max 600ms, faster timing
        setTimeout(() => {
            // Change filter after cards have animated out
            if (newFilterName) {
                setActiveFilter(newFilterName)
                
                // Notify parent about filter change after animation
                const filter = distributionData.find((f: Filter) => f.name === newFilterName)
                if (filter && onFilterChange) {
                    onFilterChange(filter.id)
                }
                
                // Get the location from the NEW filter's locations
                const newFilterData = distributionData.find((f: Filter) => f.name === newFilterName)
                const newLocations = newFilterData ? newFilterData.locations : []
                setDisplayedLocation(newLocations.find(loc => loc.id === selectedLocationId) || null)
            } else {
                // If no filter change, use the original locations
                setDisplayedLocation(locations.find(loc => loc.id === selectedLocationId) || null)
            }
            
            setHideAllCards(true)
            
            // Small delay to ensure card starts from bottom position before animating
            setTimeout(() => {
                setAnimationPhase('showing')
                
                // Mark animation as complete
                setTimeout(() => {
                    setAnimationPhase('idle')
                    setPendingLocation(null)
                }, 500)
            }, 50)
        }, totalAnimationTime)
    }, [onFilterChange])

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
            
            // Determine the new filter name but don't set it immediately
            const regionFilterMap: { [key: string]: string } = {
                'Europe': 'Europe',
                'Africa': 'Africa',
                'America': 'America',
                'Asia': 'Asia'
            }
            const newFilterName = regionFilterMap[selectedLocation.region] || 'All'
            
            // Get current locations for animation (from current filter, not new one)
            const activeFilterData = distributionData.find((f: Filter) => f.name === activeFilter)
            const currentLocations = activeFilterData ? activeFilterData.locations : []
            
            // Set activeCard immediately but start card animation sequence
            setActiveCard(selectedLocation.id)
            setPendingLocation(selectedLocation)
            
            // Start sequential card animation and pass new filter to change after animation
            animateCardsOut(currentLocations, selectedLocation.id, newFilterName)
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
            
            // Determine the new filter name but don't set it immediately
            const regionFilterMap: { [key: string]: string } = {
                'Europe': 'Europe',
                'Africa': 'Africa',
                'America': 'America',
                'Asia': 'Asia'
            }
            const newFilterName = regionFilterMap[location.region] || 'All'
            
            // Get current locations for animation (from current filter, not new one)
            const activeFilterData = distributionData.find((f: Filter) => f.name === activeFilter)
            const currentLocations = activeFilterData ? activeFilterData.locations : []
            
            // Set activeCard immediately but start card animation sequence
            setActiveCard(location.id)
            setPendingLocation(location)
            
            // Start sequential card animation and pass new filter to change after animation
            animateCardsOut(currentLocations, location.id, newFilterName)
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
                {/* Selected Card Instance - Sticky at Top */}
                {(activeCard || isFadingOut) && displayedLocation && (
                    <StyledSelectedCardWrapper>
                        <SelectedLocationCardMobile
                            location={displayedLocation}
                            onClick={() => handleCardClick(displayedLocation)}
                            isExpanded={true}
                            animationPhase={animationPhase}
                        />
                    </StyledSelectedCardWrapper>
                )}
                
                {/* All Cards with Individual Animations */}
                {allLocations.map((location, index) => {
                    return (
                        <StyledCardWrapper 
                            key={location.id}
                            $isAnimatingOut={isCardsAnimatingOut}
                            $isAnimatingIn={isCardsAnimatingIn}
                            $animationDelay={index * 50}
                            $isHidden={hideAllCards}
                            $isSelected={activeCard === location.id}
                        >
                        <LocationCard 
                            location={location} 
                            onClick={() => handleCardClick(location)}
                            isExpanded={false} // No expansion for base cards
                        />
                    </StyledCardWrapper>
                    )
                })}
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
    
    /* Safari font rendering fixes */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;

    /* Mask for transparency effect at the bottom - Safari compatible */
    -webkit-mask: linear-gradient(to bottom, black 0%, black calc(100% - ${rm(60)}), transparent 100%);
    mask: linear-gradient(to bottom, black 0%, black calc(100% - ${rm(60)}), transparent 100%);
    -webkit-mask-composite: source-over;
    mask-composite: intersect;

    ${media.md`
        position: relative;
        top: auto;
        right: auto;
        height: auto;
        width: 100%;
        margin-top: ${rm(40)};
        padding: 0 ${rm(16)};
        mask: none;
        -webkit-mask: none;
        z-index: 40;
    `}

    ${media.xsm`
        position: relative;
        top: auto;
        right: auto;
        height: auto;
        width: 100%;
        margin-top: ${rm(40)};
        padding: 0 ${rm(16)};
        mask: none;
        -webkit-mask: none;
    `}
`

const StyledTopContainer = styled.div`
    display: flex;
    width: 100%;
    gap: ${rm(4)};
    border: 1px solid #B7BCCA33;
    background-color: #6F768526;
    // -webkit-backdrop-filter: blur(32px);
    // backdrop-filter: blur(32px);
    border-radius: ${rm(8)};

    ${media.md`
        gap: ${rm(2)};
    `}

    ${media.xsm`
        gap: ${rm(2)};
        flex-wrap: wrap;
    `}

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

        ${media.md`
            font-size: ${rm(12)};
            padding: ${rm(12)} 0;
        `}

        ${media.xsm`
            font-size: ${rm(12)};
            padding: ${rm(10)} 0;
            width: calc(20% - ${rm(2)});
            min-width: ${rm(60)};
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
    position: relative;
    border-radius: ${rm(8)};
    
    /* Prevent scroll from bubbling to parent */
    overscroll-behavior: contain;
    
    ${media.md`
        // max-height: ${rm(800)};
        padding-bottom: ${rm(20)};
        // min-height: ${rm(800)};
    `}

    ${media.xsm`
        // max-height: ${rm(750)};
        padding-bottom: ${rm(20)};
        // min-height: ${rm(750)};
    `}
    
    /* Custom scrollbar styling - Safari compatible */
    &::-webkit-scrollbar {
        width: ${rm(6)};
        -webkit-appearance: none;
    }
    
    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: ${rm(3)};
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    }
    
    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: ${rm(3)};
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        transition: background 0.2s ease;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.4);
    }
    
    &::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(255, 255, 255, 0.1);
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
    $isHidden: boolean;
    $isSelected: boolean;
}>`
    /* Base cards - always visible and untouched */
    margin-bottom: 10px;
    
    /* CSS-based animation for better performance */
    opacity: ${({ $isAnimatingOut, $isAnimatingIn, $isHidden, $isSelected }) => {
        if ($isAnimatingOut) return 0;
        if ($isAnimatingIn) return 0;
        if ($isHidden && !$isSelected) return 0; // Hide unselected cards when hiding all
        return 1;
    }};
    
    transform: ${({ $isAnimatingOut, $isAnimatingIn, $isHidden, $isSelected }) => {
        if ($isAnimatingOut) return 'translateY(30%)';
        if ($isAnimatingIn) return 'translateY(30%)';
        if ($isHidden && !$isSelected) return 'translateY(30%)'; // Move unselected cards down when hiding
        return 'translateY(0)';
    }};
    
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: ${({ $animationDelay, $isAnimatingOut, $isAnimatingIn, $isHidden }) => {
        if ($isAnimatingOut) return `${$animationDelay}ms`;
        if ($isAnimatingIn) return `${$animationDelay}ms`;
        if ($isHidden) return `${$animationDelay}ms`; // Apply delay when hiding cards
        return '0ms';
    }};
    
    /* Ensure cards remain in layout but are visually hidden */
    visibility: ${({ $isHidden, $isSelected }) => {
        if ($isHidden && !$isSelected) return 'hidden';
        return 'visible';
    }};
    
    &:last-child {
        margin-bottom: 0;
    }
`

const StyledSelectedCardWrapper = styled.div`
    position: sticky;
    top: ${rm(100)};
    z-index: 20;
    margin-bottom: ${rm(10)};
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
    // -webkit-backdrop-filter: blur(32px);
    // backdrop-filter: blur(32px);
    border-radius: ${rm(8)};
    border: 1px solid #B7BCCA33;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

    ${media.md`
        position: sticky;
        width: 100%;
        margin-top: ${rm(12)};
    `}

    ${media.xsm`
        position: sticky;
        width: 100%;
        margin-top: ${rm(12)};
    `}
`
