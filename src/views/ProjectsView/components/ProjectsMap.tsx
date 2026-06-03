import { useEffect, useRef, useState, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import styled from "styled-components"
import { MapMarker } from "./MapMarker"
import { InfoWindow } from "./InfoWindow"
import { createRoot } from "react-dom/client"

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
                "color": "#1a1a1a"
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
                "color": "#3c3c3c"
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
                "color": "#0e0e0e"
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

interface MarkerData {
    position: { lat: number; lng: number }
    title: string
    address: string
    image: string
    linkText?: string
    onLinkClick?: () => void
    placeId?: string // Google Maps Place ID for better location recognition
}

interface ProjectsMapProps {
    center: { lat: number; lng: number }
    zoom: number
    markers: MarkerData[]
}

export const ProjectsMap = ({ 
    center,
    zoom,
    markers
}: ProjectsMapProps) => {
    // Default Place ID for StreetBarbell Outdoor Gym Utenberg
    // Extracted from: 0x478ffb000904357d:0xe8d6436e57ee01b1
    // For other locations, get Place ID from: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
    const DEFAULT_PLACE_ID = "ChIJfTUJAAtv-EcRsQHuV24204g" // StreetBarbell Outdoor Gym Utenberg
    const DEFAULT_TITLE = "StreetBarbell Outdoor Gym Utenberg"
    const DEFAULT_ADDRESS = "Utenbergstrasse, 6078 Lungern, fffland"
    
    // Use provided markers, or create a default marker at camera position if none provided
    const markersToUse = markers.length > 0 
        ? markers.map(marker => ({
            ...marker,
            // Don't override placeId - let each marker use its own
            // The InfoWindow will fall back to title+address if no placeId
          }))
        : [
            {
                position: center,
                title: DEFAULT_TITLE,
                address: DEFAULT_ADDRESS,
                image: "/markerImage.png",
                linkText: "View details",
                onLinkClick: () => console.log("View details clicked"),
                placeId: DEFAULT_PLACE_ID
            }
          ]
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isInitializing, setIsInitializing] = useState(false)
    const openInfoWindowRef = useRef<google.maps.InfoWindow | null>(null)

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
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    gestureHandling: 'cooperative',
                    disableDoubleClickZoom: false,
                    // Ensure the My Location button is disabled
                    clickableIcons: false,
                })

                setMap(mapInstance)
                setIsLoaded(true)

                // Add click listener to close InfoWindow when clicking outside
                mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
                    console.log("Map clicked, openInfoWindow:", openInfoWindowRef.current);
                    if (openInfoWindowRef.current) {
                        console.log("Closing InfoWindow");
                        openInfoWindowRef.current.close();
                        openInfoWindowRef.current = null;
                    }
                });

                // Add markers
                markersToUse.forEach((markerData) => {
                    const marker = new google.maps.Marker({
                        position: markerData.position,
                        map: mapInstance,
                        title: markerData.title,
                        icon: {
                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <g transform="rotate(45 24 24)">
                                        <rect x="12" y="12" width="24" height="24" fill="rgba(237,30,42,0.16)" stroke="rgba(237,30,42,0.16)" stroke-width="1"/>
                                        <rect x="21" y="21" width="6" height="6" fill="#ED1E2A"/>
                                    </g>
                                </svg>
                            `),
                            scaledSize: new google.maps.Size(48, 48),
                            anchor: new google.maps.Point(24, 24)
                        }
                    })

                    // Create info window with React component
                    const infoWindowElement = document.createElement('div')
                    const root = createRoot(infoWindowElement)
                    
                    root.render(
                        <InfoWindow
                            image={markerData.image}
                            title={markerData.title}
                            address={markerData.address}
                            linkText={markerData.linkText}
                            onLinkClick={markerData.onLinkClick}
                            lat={markerData.position.lat}
                            lng={markerData.position.lng}
                            placeId={markerData.placeId}
                        />
                    )

                    const infoWindow = new google.maps.InfoWindow({
                        content: infoWindowElement
                    })

                    marker.addListener("click", () => {
                        // Close any previously open InfoWindow
                        if (openInfoWindowRef.current) {
                            openInfoWindowRef.current.close();
                        }
                        
                        // Open the new InfoWindow
                        infoWindow.open(mapInstance, marker);
                        openInfoWindowRef.current = infoWindow;
                    })
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
  
  /* Hide Google logo */
  .gm-style div a img[src*="google_white"] {
    display: none !important;
  }

  div gmp-internal-camera-control {
    display: none !important;
  }
  
  /* Hide the entire logo container */
  .gm-style-cc {
    display: none !important;
  }
  
  /* Hide the My Location button specifically */
  .gm-control-active.gm-fullscreen-control,
  button[title*="My Location"],
  button[title*="Show your current location"],
  .gm-svpc {
    display: none !important;
  }
  
  /* Hide any remaining Google branding */
  a[href^="http://maps.google.com/maps"],
  a[href^="https://maps.google.com/maps"] {
    display: none !important;
  }
  
  /* Hide Google logo text alternative */
  .gm-style .gm-style-cc span,
  .gm-style .gm-style-cc a {
    display: none !important;
  }
  
  /* Hide the terms of use link */
  .gm-style-pbc {
    display: none !important;
  }
  
  /* Hide InfoWindow close button */
  .gm-style .gm-style-iw-c {
    padding: 0 !important;
  }

  .gm-style-iw-chr {
    display: none !important;
  }
  
  .gm-style .gm-style-iw-d {
    overflow: hidden !important;
  }
  
  /* Hide the close button */
  .gm-style .gm-style-iw-tc::after {
    display: none !important;
  }
  
  .gm-style .gm-style-iw-tc {
    display: none !important;
  }
  
  /* Hide the bottom triangle pointer */
  .gm-style .gm-style-iw-tc::before {
    display: none !important;
  }
  
  /* Remove padding from InfoWindow content */
  .gm-style .gm-style-iw-c {
    padding: 0 !important;
    margin: 0 !important;
  }
  
  /* IMPORTANT: Ensure zoom controls remain visible */
  .gmnoprint .gm-style-mtc,
  .gmnoprint .gm-bundled-control,
  .gmnoprint .gm-bundled-control-on-bottom {
    display: block !important;
  }
  
  /* Ensure zoom buttons remain visible */
  .gm-control-active.gm-zoom-control,
  .gmnoprint .gmnoscreen .gm-style-mtc,
  .gmnoprint .gmnoscreen .gm-bundled-control {
    display: block !important;
  }
`