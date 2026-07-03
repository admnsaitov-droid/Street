import { useEffect, useRef, useState, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import styled from "styled-components"
import { ThemeProvider } from "styled-components"
import { rm } from "@/styles"
import { InfoWindow } from "../../ProjectsView/components/InfoWindow"
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
                "color": "#202020"
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
                "color": "#2f2f2f"
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
                "color": "#383838"
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
}

interface ContactMapProps {
    center: { lat: number; lng: number }
    zoom: number
    markers: MarkerData[]
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
            title: "Paloheinä",
            address: "Helsinki, Finland",
            image: "/markerImage.png",
            linkText: "View details",
            onLinkClick: () => console.log("View details clicked")
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

                    // Create info window with React component
                    const infoWindowElement = document.createElement('div')
                    const root = createRoot(infoWindowElement)
                    
                    root.render(
                        <ThemeProvider theme={{}}>
                            <InfoWindow
                                image={markerData.image}
                                title={markerData.title}
                                address={markerData.address}
                                linkText={markerData.linkText}
                                onLinkClick={markerData.onLinkClick}
                                lat={markerData.position.lat}
                                lng={markerData.position.lng}
                            />
                        </ThemeProvider>
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