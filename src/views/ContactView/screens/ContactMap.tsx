import { useEffect, useRef, useState, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import styled from "styled-components"
import { rm } from "@/styles"

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

interface ContactMapProps {
    center: { lat: number; lng: number }
    zoom: number
    markers: Array<{
        position: { lat: number; lng: number }
        title?: string
        content?: string
    }>
}

export const ContactMap = ({ 
    center,
    zoom,
    markers
}: ContactMapProps) => {
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
                                <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <foreignObject x="-2.64428" y="-2.65014" width="51.2886" height="51.2887"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(1.51px);clip-path:url(#bgblur_0_4743_7066_clip_path);height:100%;width:100%"></div></foreignObject><g data-figma-bg-blur-radius="3.01732">
                                    <rect x="23" y="0.367188" width="31.9995" height="31.9995" transform="rotate(45 23 0.367188)" fill="#ED1E2A"/>
                                    <rect x="23" y="1.25618" width="30.7422" height="30.7422" transform="rotate(45 23 1.25618)" stroke="white" stroke-opacity="0.16" stroke-width="1.25722"/>
                                    </g>
                                    <path d="M30.2547 23.2511V22.9759C31.1023 22.6059 31.8908 21.8446 31.8908 20.5713C31.8908 19.1514 30.7395 18 29.3195 18H25.3936H23.0117V28.2727H26.0741H29.4297C30.8497 28.2727 32.001 27.1213 32.001 25.7014C32.001 24.3732 31.143 23.6022 30.2551 23.2511H30.2547ZM28.8285 21.9121H26.0737V20.4737H28.8285V21.9121ZM28.9387 25.799H26.0737V24.3606H28.9387V25.799Z" fill="white"/>
                                    <path d="M19.1788 18H15.7494C14.231 18 13 19.231 13 20.7494V21.757C13 22.7747 13.7332 23.6446 14.7367 23.8163L18.8658 24.524V25.7864H16.0624V24.6078H13V25.5237C13 27.0421 14.231 28.2731 15.7494 28.2731H19.1788C20.6972 28.2731 21.9281 27.0421 21.9281 25.5237V24.516C21.9281 23.4983 21.1949 22.6285 20.1915 22.4567L16.0624 21.7491V20.4867H18.8658V21.6653H21.9281V20.7494C21.9281 19.231 20.6972 18 19.1788 18Z" fill="white"/>
                                    <defs>
                                    <clipPath id="bgblur_0_4743_7066_clip_path" transform="translate(2.64428 2.65014)"><rect x="23" y="0.367188" width="31.9995" height="31.9995" transform="rotate(45 23 0.367188)"/>
                                    </clipPath></defs>
                                    </svg>
                            `),
                            scaledSize: new google.maps.Size(46, 46),
                            anchor: new google.maps.Point(23, 23)
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
            <StyledContactMap>
            </StyledContactMap>
        )
    }

    return (
        <StyledContactMap>
            <MapContainer ref={mapRef} />
        </StyledContactMap>
    )
}

const StyledContactMap = styled.div`
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