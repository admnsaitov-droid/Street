import { useEffect, useRef, useState, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import styled from "styled-components"
import { MapMarker } from "./MapMarker"

// Custom map styles for a dark theme
const mapStyles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212020"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#727272"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#101010"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#2a2a2a"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#2a2a2a"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#1a1a1a"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0f0f0f"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#151515"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1a1a1a"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#0f0f0f"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#323232"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3a3a3a"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#1a1a1a"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2a2a2a"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#1a1a1a"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2a2a2a"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#191919"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#727272"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#101010"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

interface ProjectsMapProps {
    center: { lat: number; lng: number }
    zoom: number
    markers: Array<{
        position: { lat: number; lng: number }
        title?: string
        content?: string
    }>
}

export const ProjectsMap = ({ 
    center,
    zoom,
    markers
}: ProjectsMapProps) => {
    // Use provided markers, or create a default marker at camera position if none provided
    const markersToUse = markers.length > 0 ? markers : [
        {
            position: center,
            title: "Location",
            content: `<div style='padding: 10px;'><h3>Location</h3><p>Current position</p></div>`
        }
    ]
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isInitializing, setIsInitializing] = useState(false)

    const initMap = useCallback(async () => {
        // Prevent multiple initializations
        if (isInitializing || map || error) {
            return
        }

        setIsInitializing(true)
        
        try {
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            
            if (!apiKey) {
                setError("Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.")
                setIsInitializing(false)
                return
            }

            const loader = new Loader({
                apiKey: apiKey,
                version: "weekly",
                libraries: ["places"]
            })

            const google = await loader.load()
            
            if (mapRef.current && !map) {
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

                // Add markers
                markersToUse.forEach((markerData) => {
                    // Create custom HTML marker
                    const markerElement = document.createElement('div')
                    markerElement.innerHTML = `
                        <div style="
                            width: 24px; 
                            height: 24px; 
                            background-color: rgba(255, 255, 255, 0.16); 
                            border: 1px solid rgba(255, 255, 255, 0.16); 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                        ">
                            <div style="
                                width: 10px; 
                                height: 10px; 
                                background-color: white;
                            "></div>
                        </div>
                    `
                    
                    const marker = new google.maps.Marker({
                        position: markerData.position,
                        map: mapInstance,
                        title: markerData.title || "Location",
                        icon: {
                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="rotate(45 24 24)">
                                        <rect x="12" y="12" width="24" height="24" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>
                                        <rect x="21" y="21" width="6" height="6" fill="white"/>
                                    </g>
                                </svg>
                            `),
                            scaledSize: new google.maps.Size(48, 48),
                            anchor: new google.maps.Point(24, 24)
                        }
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
        } finally {
            setIsInitializing(false)
        }
    }, [center, zoom, markersToUse, map, error, isInitializing])

    useEffect(() => {
        // Only initialize if we have a ref and no existing map
        if (mapRef.current && !map && !error && !isInitializing) {
            initMap()
        }
    }, [initMap, map, error, isInitializing])

    // Cleanup function to prevent memory leaks
    useEffect(() => {
        return () => {
            if (map) {
                // Clean up any event listeners or markers if needed
                setMap(null)
                setIsLoaded(false)
            }
        }
    }, [map])

    if (error) {
        return (
            <StyledProjectsMap>
            </StyledProjectsMap>
        )
    }

    return (
        <StyledProjectsMap>
            <MapContainer ref={mapRef} />
        </StyledProjectsMap>
    )
}

const StyledProjectsMap = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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