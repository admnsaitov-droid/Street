import { Tracker } from "./Tracker"
import { Location as DistributionLocation } from "../data/distributionData"
import { getAllDynamicLocations } from "../data/dynamicDataTransformer"
import { MutableRefObject } from "react"

interface TrackerConfig {
    label: string
    name: string // Display name for the LocationCard title
    position: [number, number, number]
    email: string
    address: string
    rotationAdjustment: [number, number, number] // Manual rotation adjustments [x, y, z]
    fromRotation: [number, number, number] // [x, y, z] rotation ranges
    toRotation: [number, number, number] // [x, y, z] rotation ranges
}

interface TrackersProps {
    onLocationClick?: (location: DistributionLocation | null) => void
    selectedLocation?: DistributionLocation | null
    currentRotationRef?: MutableRefObject<{ x: number; y: number; z: number }>
    cameraRotationRef?: MutableRefObject<{ x: number; y: number; z: number }>
    data?: any
}

const trackerConfigs: TrackerConfig[] = [
    { label: "Austria", name: "Austrian Distribution Center", position: [-2.23, 0.97, 3.08], email: "austria@distributor.com", address: "Vienna, Austria", rotationAdjustment: [0.2, 0.4, 0], fromRotation: [-0.83, -0.83, -0.83], toRotation: [1.27, 1.27, 1.27] },
    { label: "Azerbaijan", name: "Azerbaijan Distribution Hub", position: [-0.75, 0.50, 3.82], email: "azerbaijan@distributor.com", address: "Baku, Azerbaijan", rotationAdjustment: [0.2, -0.1, 0], fromRotation: [-1.0, -1.0, -1.0], toRotation: [1, 1, 1] },
    { label: "Bahrain", name: "Bahrain Distribution Center", position: [-0.50, -0.42, 3.88], email: "bahrain@distributor.com", address: "Manama, Bahrain", rotationAdjustment: [-0.14, -0.14, 0], fromRotation: [-1.0, -1.0, -1.0], toRotation: [0.8, 0.8, 0.8] },
    { label: "Benelux", name: "Benelux Regional Office", position: [-2.46, 1.30, 2.77], email: "benelux@distributor.com", address: "Brussels, Belgium", rotationAdjustment: [0.25, 0.35, 0], fromRotation: [-0.85, -0.85, -0.85], toRotation: [1.33, 1.33, 1.33] },
    { label: "Bulgaria", name: "Bulgarian Distribution Hub", position: [-1.80, 0.63, 3.43], email: "bulgaria@distributor.com", address: "Sofia, Bulgaria", rotationAdjustment: [0.2, 0.2, 0], fromRotation: [-1.2, -1.2, -1.2], toRotation: [1.45, 1.45, 1.45] },
    { label: "Denmark", name: "Danish Distribution Center", position: [-2.19, 1.47, 2.91], email: "denmark@distributor.com", address: "Copenhagen, Denmark", rotationAdjustment: [0.27, 0.3, 0], fromRotation: [-0.87, -0.87, -0.87], toRotation: [1.5, 1.5, 1.5] },
    { label: "Croatia", name: "Croatian Distribution Hub", position: [-2.25, 0.76, 3.13], email: "croatia@distributor.com", address: "Zagreb, Croatia", rotationAdjustment: [0.2, 0.3, 0], fromRotation: [-0.88, -0.88, -0.88], toRotation: [1.35, 1.35, 1.35] },
    { label: "Czech Republic", name: "Czech Distribution Center", position: [-2.06, 1.15, 3.15], email: "czech@distributor.com", address: "Prague, Czech Republic", rotationAdjustment: [0.25, 0.3, 0], fromRotation: [-0.83, -0.83, -0.83], toRotation: [1.48, 1.48, 1.48] },
    { label: "Egypt", name: "Egyptian Distribution Hub", position: [-1.66, -0.46, 3.53], email: "egypt@distributor.com", address: "Cairo, Egypt", rotationAdjustment: [-0.1, 0.15, 0], fromRotation: [-1.2, -1.2, -1.2], toRotation: [1.3, 1.3, 1.3] },
    { label: "France", name: "French Distribution Center", position: [-2.70, 1.02, 2.66], email: "france@distributor.com", address: "Paris, France", rotationAdjustment: [0.23, 0.62, 0], fromRotation: [-0.85, -0.85, -0.85], toRotation: [1.4, 1.4, 1.4] },
    { label: "Estonia", name: "Estonian Distribution Hub", position: [-1.64, 1.60, 3.21], email: "estonia@distributor.com", address: "Tallinn, Estonia", rotationAdjustment: [0.4, 0.2, 0], fromRotation: [-0.82, -0.82, -0.82], toRotation: [1.6, 1.6, 1.6] },
    { label: "Germany", name: "German Distribution Center", position: [-2.41, 1.10, 2.90], email: "germany@distributor.com", address: "Berlin, Germany", rotationAdjustment: [0.2, 0.4, 0], fromRotation: [-0.8, -0.8, -0.8], toRotation: [1.33, 1.33, 1.33] },
    { label: "Hungary", name: "Hungarian Distribution Hub", position: [-2.05, 0.85, 3.24], email: "hungary@distributor.com", address: "Budapest, Hungary", rotationAdjustment: [0.2, 0.4, 0], fromRotation: [-0.82, -0.82, -0.82], toRotation: [1.42, 1.42, 1.42] },
    { label: "Israel", name: "Israeli Distribution Center", position: [-1.40, -0.06, 3.67], email: "israel@distributor.com", address: "Tel Aviv, Israel", rotationAdjustment: [0, 0.1, 0], fromRotation: [-1.1, -1.1, -1.1], toRotation: [1, 1, 1] },
    { label: "Italy", name: "Italian Distribution Center", position: [-2.41, 0.70, 3.02], email: "italy@distributor.com", address: "Rome, Italy", rotationAdjustment: [0.2, 0.4, 0], fromRotation: [-0.81, -0.81, -0.81], toRotation: [1.37, 1.37, 1.37] },
    { label: "Latvia", name: "Latvian Distribution Hub", position: [-1.71, 1.48, 3.21], email: "latvia@distributor.com", address: "Riga, Latvia", rotationAdjustment: [0.4, 0.2, 0], fromRotation: [-0.88, -0.88, -0.88], toRotation: [1.56, 1.56, 1.56] },
    { label: "Malta", name: "Maltese Distribution Center", position: [-2.43, 0.21, 3.07], email: "malta@distributor.com", address: "Valletta, Malta", rotationAdjustment: [0.1, 0.4, 0], fromRotation: [-0.89, -0.89, -0.89], toRotation: [1.38, 1.38, 1.38] },
    { label: "Mexico", name: "Mexican Distribution Center", position: [-2.08, 2.46, -2.24], email: "mexico@distributor.com", address: "Mexico City, Mexico", rotationAdjustment: [0.15, 2.14, 0.3], fromRotation: [-0.2, 1.4, -0.2], toRotation: [0.9, 2.6, 2.2] },
    { label: "Morocco", name: "Moroccan Distribution Hub", position: [-3.15, 0.34, 2.32], email: "morocco@distributor.com", address: "Casablanca, Morocco", rotationAdjustment: [0, 0.7, 0], fromRotation: [-0.85, -0.85, -0.85], toRotation: [1.2, 1.2, 1.2] },
    { label: "Norway", name: "Norwegian Distribution Center", position: [-2.15, 1.74, 2.78], email: "norway@distributor.com", address: "Oslo, Norway", rotationAdjustment: [0.35, 0.4, 0], fromRotation: [-0.8, -0.8, -0.8], toRotation: [1.6, 1.6, 1.6] },
    { label: "Poland", name: "Polish Distribution Center", position: [-1.89, 1.27, 3.21], email: "poland@distributor.com", address: "Warsaw, Poland", rotationAdjustment: [0.28, 0.4, 0], fromRotation: [-0.85, -0.85, -0.85], toRotation: [1.7, 1.7, 1.7] },
    { label: "Qatar", name: "Qatari Distribution Hub", position: [-0.47, -0.49, 3.86], email: "qatar@distributor.com", address: "Doha, Qatar", rotationAdjustment: [-0.14, -0.14, 0], fromRotation: [-1.0, -1.0, -1.0], toRotation: [0.85, 0.85, 0.85] },
    { label: "Saudi Arabia", name: "Saudi Distribution Center", position: [-0.88, -0.49, 3.79], email: "saudi@distributor.com", address: "Riyadh, Saudi Arabia", rotationAdjustment: [-0.1, -0.05, 0], fromRotation: [-1.0, -1.0, -1.0], toRotation: [0.96, 0.96, 0.96] },
    { label: "Spain", name: "Spanish Distribution Center", position: [-2.96, 0.77, 2.46], email: "spain@distributor.com", address: "Madrid, Spain", rotationAdjustment: [0.2, 0.7, 0], fromRotation: [-0.82, -0.82, -0.82], toRotation: [1.3, 1.3, 1.3] },
    { label: "Sweden", name: "Swedish Distribution Center", position: [-2.01, 1.61, 2.96], email: "sweden@distributor.com", address: "Stockholm, Sweden", rotationAdjustment: [0.3, 0.42, 0], fromRotation: [-0.81, -0.81, -0.81], toRotation: [1.6, 1.6, 1.6] },
    { label: "Switzerland", name: "Swiss Distribution Center", position: [-2.42, 0.91, 2.96], email: "switzerland@distributor.com", address: "Zurich, Switzerland", rotationAdjustment: [0.2, 0.4, 0], fromRotation: [-0.87, -0.87, -0.87], toRotation: [1.5, 1.5, 1.5] },
    { label: "Taiwan", name: "Taiwanese Distribution Hub", position: [2.91, 1.25, 2.32], email: "taiwan@distributor.com", address: "Taipei, Taiwan", rotationAdjustment: [0, -1.2, 0], fromRotation: [-0.2, -2.34, 4.23], toRotation: [0.97, 0.115, 5.76] },
    { label: "UAE", name: "UAE Distribution Center", position: [-0.35, -0.61, 3.87], email: "uae@distributor.com", address: "Dubai, UAE", rotationAdjustment: [-0.14, -0.14, 0], fromRotation: [-0.9, -0.9, -0.9], toRotation: [0.9, 0.9, 0.9] },
    { label: "UK", name: "UK Distribution Center", position: [-2.60, 1.46, 2.55], email: "uk@distributor.com", address: "London, UK", rotationAdjustment: [0.35, 0.6, 0], fromRotation: [-0.88, -0.88, -0.88], toRotation: [1.4, 1.4, 1.4] },
    { label: "USA", name: "USA Distribution Center", position: [-2.39, 2.85, -1.25], email: "usa@distributor.com", address: "New York, USA", rotationAdjustment: [0.3, 2.05, 0.3], fromRotation: [-0.2, 1.4, -0.2], toRotation: [0.9, 2.6, 2.2] },
    { label: "Seychelles", name: "Seychelles Distribution Hub", position: [0.02, -2.47, 3.05], email: "seychelles@distributor.com", address: "Victoria, Seychelles", rotationAdjustment: [-0.7, -0.1, 0], fromRotation: [-1, -1, -1], toRotation: [0.8, 0.8, 0.8] },
    { label: "Puerto-Rico", name: "Puerto Rico Distribution Center", position: [-3.47, 1.37, -1.25], email: "puerto@distributor.com", address: "San Juan, Puerto Rico", rotationAdjustment: [0.05, 1.75, 0], fromRotation: [-0.2, 1.4, -0.2], toRotation: [0.9, 2.6, 2.2] },
    { label: "Canada", name: "Canadian Distribution Center", position: [-2.02, 3.31, -0.67], email: "canada@distributor.com", address: "Toronto, Canada", rotationAdjustment: [0.5, 2.05, 0.3], fromRotation: [-0.2, 1.4, -0.2], toRotation: [0.9, 2.6, 2.2] },
    { label: "Argentina", name: "Argentine Distribution Hub", position: [-2.89, -1.17, -2.38], email: "argentina@distributor.com", address: "Buenos Aires, Argentina", rotationAdjustment: [-0.45, 1.82, -0.4], fromRotation: [-1.2, 1.43, -0.2], toRotation: [0.93, 2.63, 2.2] },
    { label: "Brasil", name: "Brazilian Distribution Center", position: [-3.57, -0.70, -1.46], email: "brasil@distributor.com", address: "São Paulo, Brazil", rotationAdjustment: [-0.3, 1.7, -0.4], fromRotation: [-1.1, 1.44, -0.2], toRotation: [0.94, 2.64, 2.2] },
    { label: "Chile", name: "Chilean Distribution Center", position: [-2.60, -0.82, -2.82], email: "chile@distributor.com", address: "Santiago, Chile", rotationAdjustment: [-0.42, 1.93, -0.4], fromRotation: [-1.07, 1.39, -0.2], toRotation: [0.88, 2.58, 2.2] },
    { label: "Peru", name: "Peruvian Distribution Hub", position: [-2.78, 0.23, -2.76], email: "peru@distributor.com", address: "Lima, Peru", rotationAdjustment: [-0.24, 1.96, -0.4], fromRotation: [-1, 1.42, -0.2], toRotation: [0.91, 2.61, 2.2] },
    { label: "Columbia", name: "Colombian Distribution Center", position: [-3.06, 0.81, -2.32], email: "columbia@distributor.com", address: "Bogotá, Colombia", rotationAdjustment: [-0.13, 1.9, -0.2], fromRotation: [-0.93, 1.38, -0.2], toRotation: [0.905, 2.62, 2.2] },
    { label: "South Korea", name: "Korean Distribution Center", position: [2.53, 2.03, 2.21], email: "korea@distributor.com", address: "Seoul, South Korea", rotationAdjustment: [0.3, -1.3, -0.2], fromRotation: [-0.2, -2.39, 4.23], toRotation: [1.07, 0.17, 5.76] },
    { label: "Dominican Republic", name: "Dominican Distribution Center", position: [-3.33, 1.55, -1.37], email: "dominican@distributor.com", address: "Santo Domingo, Dominican Republic", rotationAdjustment: [0.05, 1.8, 0], fromRotation: [-0.17, 1.4, -0.19], toRotation: [0.92, 2.6, 2.17] },
    { label: "Japan", name: "Japanese Distribution Center", position: [2.66, 2.25, 1.88], email: "japan@distributor.com", address: "Tokyo, Japan", rotationAdjustment: [0.35, -1.3, -0.2], fromRotation: [-0.2, -2.37, 4.23], toRotation: [1, 0.12, 5.76] },
]

// Function to create tracker configs from dynamic data
const createTrackerConfigsFromDynamicData = (data: any): TrackerConfig[] => {
    if (!data?.distributionPage?.locations) return []
    
    return data.distributionPage.locations.map((location: any) => ({
        label: location.countryText,
        name: location.centerName,
        position: [location.scenePosition.x, location.scenePosition.y, location.scenePosition.z] as [number, number, number],
        email: location.mailItem,
        address: location.locationItem,
        rotationAdjustment: [location.rotationAdjustment.x, location.rotationAdjustment.y, location.rotationAdjustment.z] as [number, number, number],
        fromRotation: [location.fromRotation.x, location.fromRotation.y, location.fromRotation.z] as [number, number, number],
        toRotation: [location.toRotation.x, location.toRotation.y, location.toRotation.z] as [number, number, number]
    }))
}

// Export function to get rotation adjustment by label
export const getRotationAdjustmentByLabel = (label: string, data?: any): [number, number, number] => {
    if (data?.distributionPage?.locations) {
        const location = data.distributionPage.locations.find((loc: any) => loc.countryText === label)
        if (location) {
            return [location.rotationAdjustment.x, location.rotationAdjustment.y, location.rotationAdjustment.z]
        }
    }
    
    // Fallback to static configs
    const config = trackerConfigs.find(config => config.label === label)
    return config?.rotationAdjustment || [0, 0, 0]
}

export const Trackers = ({ onLocationClick, selectedLocation, currentRotationRef, cameraRotationRef, data }: TrackersProps) => {
    // Get tracker configs from dynamic data or fallback to static
    const trackerConfigs = data?.distributionPage ? createTrackerConfigsFromDynamicData(data) : []
    
    // Function to find corresponding location data for a tracker
    const getLocationForTracker = (trackerLabel: string): DistributionLocation | null => {
        if (data?.distributionPage) {
            const allLocations = getAllDynamicLocations(data)
            return allLocations.find((location: DistributionLocation) => location.name === trackerLabel) || null
        }
        return null
    }

    const handleTrackerClick = (trackerLabel: string) => {
        const location = getLocationForTracker(trackerLabel)
        if (location && onLocationClick) {
            // If the clicked tracker is already selected, deselect it
            if (selectedLocation?.name === trackerLabel) {
                onLocationClick(null)
            } else {
                // Otherwise, select the new location
                onLocationClick(location)
            }
        }
    }

    return (
        <group scale={0.927}>
            {trackerConfigs.map((config) => (
                <Tracker 
                    key={config.label}
                    position={config.position} 
                    label={config.label}
                    name={config.name}
                    isActive={selectedLocation?.name === config.label}
                    onClick={() => handleTrackerClick(config.label)}
                    fromRotation={config.fromRotation}
                    toRotation={config.toRotation}
                    currentRotationRef={currentRotationRef}
                    cameraRotationRef={cameraRotationRef}
                />
            ))}
        </group>
    )
}
