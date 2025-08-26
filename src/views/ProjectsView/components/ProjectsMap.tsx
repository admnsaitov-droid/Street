import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import styled from "styled-components"

// Custom map styles for a dark theme
const mapStyles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8ec3b9"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1a3646"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#4b6878"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#64779f"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#4b6878"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#334e87"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#023e58"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#283d6a"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6f9ba5"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#023e58"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3C7680"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#304a7d"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#98a5be"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2c6675"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#255763"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#b0d5ce"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#023e58"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#98a5be"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1d2c4d"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#283d6a"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3a4762"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0e1626"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#4e6d70"
            }
        ]
    }
]

interface ProjectsMapProps {
    center?: { lat: number; lng: number }
    zoom?: number
    markers?: Array<{
        position: { lat: number; lng: number }
        title?: string
        content?: string
    }>
}

export const ProjectsMap = ({ 
    center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
    zoom = 12,
    markers = []
}: ProjectsMapProps) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const initMap = async () => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                
                if (!apiKey) {
                    setError("Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.")
                    return
                }

                const loader = new Loader({
                    apiKey: apiKey,
                    version: "weekly",
                    libraries: ["places"]
                })

                const google = await loader.load()
                
                if (mapRef.current) {
                    const mapInstance = new google.maps.Map(mapRef.current, {
                        center: center,
                        zoom: zoom,
                        styles: mapStyles,
                        disableDefaultUI: false,
                        zoomControl: true,
                        mapTypeControl: false,
                        scaleControl: true,
                        streetViewControl: false,
                        rotateControl: false,
                        fullscreenControl: true,
                        gestureHandling: 'cooperative'
                    })

                    setMap(mapInstance)
                    setIsLoaded(true)

                    // Add markers if provided
                    markers.forEach((markerData) => {
                        const marker = new google.maps.Marker({
                            position: markerData.position,
                            map: mapInstance,
                            title: markerData.title || "Location"
                        })

                        // Add info window if content is provided
                        if (markerData.content) {
                            const infoWindow = new google.maps.InfoWindow({
                                content: markerData.content
                            })

                            marker.addListener("click", () => {
                                infoWindow.open(mapInstance, marker)
                            })
                        }
                    })
                }
            } catch (err) {
                console.error("Error loading Google Maps:", err)
                setError("Failed to load Google Maps. Please check your API key and internet connection.")
            }
        }

        initMap()
    }, [center, zoom, markers])

    if (error) {
        return (
            <StyledProjectsMap>
                <ErrorMessage>{error}</ErrorMessage>
            </StyledProjectsMap>
        )
    }

    return (
        <StyledProjectsMap>
            <MapContainer ref={mapRef} />
            {!isLoaded && (
                <LoadingOverlay>
                    <LoadingText>Loading Map...</LoadingText>
                </LoadingOverlay>
            )}
        </StyledProjectsMap>
    )
}

const StyledProjectsMap = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
`

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
`

const LoadingOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(29, 44, 77, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
`

const LoadingText = styled.div`
    color: #8ec3b9;
    font-size: 18px;
    font-weight: 500;
`

const ErrorMessage = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ff6b6b;
    text-align: center;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    max-width: 80%;
    font-size: 14px;
    line-height: 1.4;
`