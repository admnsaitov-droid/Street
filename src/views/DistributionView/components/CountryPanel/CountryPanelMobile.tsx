import { colors, media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import styled from "styled-components"
import { useState, useEffect, useCallback } from "react"
import { Filter, Location as DistributionLocation } from "../../data/distributionData"
import { transformDynamicData, getDynamicFilterNames } from "../../data/dynamicDataTransformer"
import { LocationCard } from "../LocationCard/LocationCard"
import { SelectedLocationCardMobile } from "../LocationCard/SelectedLocationCardMobile"
import { useScroll } from "@/layouts/ScrollLayout/useScroll"

interface CountryPanelMobileProps {
    activeFilterId?: string
    onFilterChange?: (filterId: string) => void
    onLocationClick?: (location: DistributionLocation | null) => void
    selectedLocation?: DistributionLocation | null
    data?: any
}

export const CountryPanelMobile = ({ activeFilterId, onFilterChange, onLocationClick, selectedLocation, data }: CountryPanelMobileProps) => {
    const [activeFilter, setActiveFilter] = useState('All')
    const [activeCard, setActiveCard] = useState<string | null>(null)
    const [displayedLocation, setDisplayedLocation] = useState<DistributionLocation | null>(null)
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const [isPopupClosing, setIsPopupClosing] = useState(false)
    const [popupLocation, setPopupLocation] = useState<DistributionLocation | null>(null)

    // Get dynamic data
    const distributionData = data?.distributionPage ? transformDynamicData(data) : []
    const filters = data?.distributionPage ? getDynamicFilterNames(data) : ['All']

    // Scroll control for popup
    const stopScroll = useScroll((state) => state.stop)
    const startScroll = useScroll((state) => state.start)

    // Simple popup logic - no complex animations needed

    // Control scrolling when popup is open
    useEffect(() => {
        if (isPopupVisible) {
            // Popup is open - stop background scrolling but allow popup content to scroll
            // We'll handle this with CSS instead of completely disabling scroll
            document.body.style.overflow = 'hidden'
        } else {
            // Popup is closed - restore scrolling
            document.body.style.overflow = 'unset'
            startScroll()
        }
        
        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isPopupVisible, startScroll])

    // Handle popup animation states
    useEffect(() => {
        if (activeCard && displayedLocation) {
            // Show popup with animation
            setPopupLocation(displayedLocation) // Save location data for popup
            setIsPopupVisible(true)
            setIsPopupClosing(false)
        } else if (isPopupVisible) {
            // Start closing animation - keep popupLocation data
            setIsPopupClosing(true)
            // Hide popup after animation completes
            const timer = setTimeout(() => {
                setIsPopupVisible(false)
                setIsPopupClosing(false)
                setPopupLocation(null) // Clear location data after animation
            }, 300) // Match animation duration
            return () => clearTimeout(timer)
        }
    }, [activeCard, displayedLocation, isPopupVisible])

    // Sync activeCard state with selectedLocation changes (from tracker clicks)
    useEffect(() => {
        if (selectedLocation) {
            // If this is the same location that's already active, don't change anything
            if (activeCard === selectedLocation.id) {
                return
            }
            
            // Determine the new filter name
            const regionFilterMap: { [key: string]: string } = {
                'Europe': 'Europe',
                'Africa': 'Africa',
                'America': 'America',
                'Asia': 'Asia'
            }
            const newFilterName = regionFilterMap[selectedLocation.region] || 'All'
            
            // Update filter if needed
            if (newFilterName !== activeFilter) {
                setActiveFilter(newFilterName)
                const filter = distributionData.find((f: Filter) => f.name === newFilterName)
                if (filter && onFilterChange) {
                    onFilterChange(filter.id)
                }
            }
            
            // Set active card and displayed location
            setActiveCard(selectedLocation.id)
            setDisplayedLocation(selectedLocation)
        } else {
            // Clear selection
            setActiveCard(null)
            setDisplayedLocation(null)
        }
    }, [selectedLocation, onFilterChange, activeCard, activeFilter])

    const handleFilterClick = useCallback((filterName: string) => {
        // If there's an active card, start the animation sequence
        if (activeCard) {
            // Step 1: Start closing the popup first
            setIsPopupClosing(true)
            
            // Step 2: After popup closes, change filter and show new cards
            setTimeout(() => {
                // Clear the selected card and notify parent
                setActiveCard(null)
                setDisplayedLocation(null)
                setIsPopupVisible(false)
                setIsPopupClosing(false)
                setPopupLocation(null)
                
                // Notify parent to clear selected location
                if (onLocationClick) {
                    onLocationClick(null)
                }
                
                // Change the filter
                setActiveFilter(filterName)
                
                // Find the filter ID from the name
                const filter = distributionData.find((f: Filter) => f.name === filterName)
                if (filter && onFilterChange) {
                    onFilterChange(filter.id)
                }
            }, 300) // Match the popup closing animation duration
        } else {
            // No active card, just change filter
            setActiveFilter(filterName)
            
            // Find the filter ID from the name
            const filter = distributionData.find((f: Filter) => f.name === filterName)
            if (filter && onFilterChange) {
                onFilterChange(filter.id)
            }
        }
    }, [activeCard, onFilterChange])

    const handleCardClick = useCallback((location: DistributionLocation) => {
        // Toggle card selection
        if (activeCard === location.id) {
            // Deselect card
            setActiveCard(null)
            setDisplayedLocation(null)
            if (onLocationClick) {
                onLocationClick(null)
            }
        } else {
            // Select card
            setActiveCard(location.id)
            setDisplayedLocation(location)
            if (onLocationClick) {
                onLocationClick(location)
            }
            
            // Update filter if needed
            const regionFilterMap: { [key: string]: string } = {
                'Europe': 'Europe',
                'Africa': 'Africa',
                'America': 'America',
                'Asia': 'Asia'
            }
            const newFilterName = regionFilterMap[location.region] || 'All'
            
            if (newFilterName !== activeFilter) {
                setActiveFilter(newFilterName)
                const filter = distributionData.find((f: Filter) => f.name === newFilterName)
                if (filter && onFilterChange) {
                    onFilterChange(filter.id)
                }
            }
        }
    }, [activeCard, onLocationClick, onFilterChange, activeFilter])

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
                {/* All Cards - Always Visible */}
                {locations.map((location, index) => {
                    return (
                        <StyledCardWrapper 
                            key={location.id}
                            $isSelected={activeCard === location.id}
                        >
                            <LocationCard 
                                location={location} 
                                onClick={() => handleCardClick(location)}
                                isExpanded={false}
                                locationText={data?.distributionPage?.locationText}
                                websiteText={data?.distributionPage?.websiteText}
                            />
                        </StyledCardWrapper>
                    )
                })}
            </StyledCardsContainer>
            
            {/* Popup Overlay for Selected Card */}
            {isPopupVisible && popupLocation && (
                <StyledPopupOverlay 
                    $isClosing={isPopupClosing}
                    onClick={() => handleCardClick(popupLocation)}
                >
                    <StyledPopupContent 
                        $isClosing={isPopupClosing}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SelectedLocationCardMobile
                            location={popupLocation}
                            onClick={() => handleCardClick(popupLocation)}
                            isExpanded={true}
                            locationText={data?.distributionPage?.locationText}
                            websiteText={data?.distributionPage?.websiteText}
                        />
                    </StyledPopupContent>
                </StyledPopupOverlay>
            )}
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

const StyledCardsContainer = styled.div`
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
    $isSelected: boolean;
}>`
    margin-bottom: 10px;
    
    /* Highlight selected card */
    opacity: ${({ $isSelected }) => $isSelected ? 0.7 : 1};
    transform: ${({ $isSelected }) => $isSelected ? 'scale(0.98)' : 'scale(1)'};
    transition: opacity 0.3s ease, transform 0.3s ease;
    
    &:last-child {
        margin-bottom: 0;
    }
`

const StyledPopupOverlay = styled.div<{ $isClosing: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 1000;
    padding: ${rm(16)};
    padding-top: ${rm(74)};
    opacity: ${({ $isClosing }) => $isClosing ? 0 : 1};
    transition: opacity 0.3s ease-out;
    
    animation: ${({ $isClosing }) => $isClosing ? 'none' : 'fadeIn 0.3s ease-out'};
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`

const StyledPopupContent = styled.div<{ $isClosing: boolean }>`
    width: 100%;
    max-width: ${rm(400)};
    height: 100%;
    // margin-top: ${rm(120)};
    overflow-y: auto;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
    border-radius: ${rm(8)};
    border: 1px solid #B7BCCA33;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    
    /* Ensure proper scrolling behavior */
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    
    /* Custom scrollbar styling for the popup */
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
    
    /* Firefox scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
    
    opacity: ${({ $isClosing }) => $isClosing ? 0 : 1};
    transform: ${({ $isClosing }) => $isClosing ? 'translateY(30px)' : 'translateY(0)'};
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    
    animation: ${({ $isClosing }) => $isClosing ? 'none' : 'slideUp 0.3s ease-out'};
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`
