import styled from "styled-components"

interface ProjectsMapEmbedProps {
    location?: string
    zoom?: number
    width?: string
    height?: string
    className?: string
}

export const ProjectsMapEmbed = ({ 
    location = "New York, NY", 
    zoom = 13,
    width = "100%",
    height = "100%",
    className
}: ProjectsMapEmbedProps) => {
    // Generate Google Maps embed URL
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(location)}&zoom=${zoom}`
    
    // Alternative: Use search-based embed (no API key required)
    const searchEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed&z=${zoom}`

    return (
        <StyledMapEmbed className={className}>
            <StyledIframe
                src={searchEmbedUrl}
                width={width}
                height={height}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${location}`}
            />
            <MapOverlay>
                <OverlayContent>
                    <LocationTitle>{location}</LocationTitle>
                    <LocationSubtitle>Click to interact with map</LocationSubtitle>
                </OverlayContent>
            </MapOverlay>
        </StyledMapEmbed>
    )
}

const StyledMapEmbed = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    background-color: #1d2c4d;
    
    &:hover {
        .map-overlay {
            opacity: 0;
            pointer-events: none;
        }
    }
`

const StyledIframe = styled.iframe`
    border: 0;
    filter: invert(90%) hue-rotate(180deg) saturate(0.8) brightness(0.9);
    transition: filter 0.3s ease;
    
    &:hover {
        filter: invert(90%) hue-rotate(180deg) saturate(1) brightness(1);
    }
`

const MapOverlay = styled.div.attrs({ className: 'map-overlay' })`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg, 
        rgba(29, 44, 77, 0.8) 0%, 
        rgba(14, 22, 38, 0.9) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    pointer-events: none;
`

const OverlayContent = styled.div`
    text-align: center;
    color: white;
    z-index: 2;
`

const LocationTitle = styled.h3`
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #8ec3b9;
`

const LocationSubtitle = styled.p`
    font-size: 14px;
    margin: 0;
    opacity: 0.8;
    color: #98a5be;
`
