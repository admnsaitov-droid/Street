import { rm } from "@/styles"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"
import styled from "styled-components"

interface InfoWindowProps {
    image: string
    title: string
    address: string
    linkText?: string
    onLinkClick?: () => void
    lat?: number
    lng?: number
    placeId?: string
}

const StyledInfoWindow = styled.div`
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(32px);
    border-radius: ${rm(10)};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border: 2px solid #B7BCCA33;
    overflow: hidden;
    // width: ${rm(324)};
    width: 100%;
    z-index: 1000;
`

const ImageContainer = styled.div`
    width: 100%;
    height: ${rm(180)};
    overflow: hidden;
`

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const AccentBar = styled.div`
    width: 100%;
    height: ${rm(4)};
    background: #ED1E2A;
`

const ContentContainer = styled.div<{ $noImage?: boolean }>`
    padding: ${({ $noImage }) => $noImage ? `${rm(20)} ${rm(16)} ${rm(16)}` : `${rm(16)} ${rm(8)}`};
`

const Title = styled.h3`
    font-size: ${rm(18)};
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 ${rm(8)} 0;
    line-height: 1.3;
`

const Address = styled.p`
    font-size: ${rm(14)};
    color: #666;
    margin: 0 0 ${rm(12)} 0;
    line-height: 1.4;
`

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${rm(8)};
`

const LinkButton = styled.button`
    background: none;
    border: none;
    color: #0066cc;
    font-size: ${rm(14)};
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    
    &:hover {
        color: #0052a3;
    }
    
    &:focus {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
    }
`

const GoogleMapsButton = styled.a`
    background: none;
    border: none;
    color: #0066cc;
    font-size: ${rm(14)};
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    text-align: left;
    
    &:hover {
        color: #0052a3;
    }
    
    &:focus {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
    }
`

export const InfoWindow = ({ 
    image, 
    title, 
    address, 
    linkText = "View details",
    onLinkClick,
    lat,
    lng,
    placeId
}: InfoWindowProps) => {

    console.log(image);

    // Generate Google Maps URL based on available data
    const getGoogleMapsUrl = () => {
        if (placeId) {
            // Use Place ID for most accurate location (shows as real business)
            // Note: Use destination_place_id parameter, not destination=place_id:
            return `https://www.google.com/maps/dir/?api=1&destination_place_id=${placeId}`
        } else if (title && address) {
            // Use title + address for best recognition (better than coordinates alone)
            // This format works well with Google Maps search
            return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(title + ", " + address)}`
        } else if (lat && lng) {
            // Fall back to coordinates only as last resort
            return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        }
        return null
    }

    const mapsUrl = getGoogleMapsUrl()

    const hasImage = !!image

    return (
        <StyledInfoWindow>
            {hasImage ? (
                <ImageContainer>
                    <Image src={getMediaStrapiPath(image)} alt={title} />
                </ImageContainer>
            ) : (
                <AccentBar />
            )}
            <ContentContainer $noImage={!hasImage}>
                <Title>{title}</Title>
                <Address>{address}</Address>
                <ButtonContainer>
                    {mapsUrl && (
                        <GoogleMapsButton
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open in Google Maps"
                        >
                            Adjust the route
                        </GoogleMapsButton>
                    )}
                </ButtonContainer>
            </ContentContainer>
        </StyledInfoWindow>
    )
}
