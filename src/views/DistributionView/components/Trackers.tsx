import { Tracker } from "./Tracker"
import { Location as DistributionLocation } from "../data/distributionData"

interface TrackerConfig {
    label: string
    position: [number, number, number]
    email: string
    address: string
    rotationAdjustment: [number, number, number] // Manual rotation adjustments [x, y, z]
}

interface TrackersProps {
    onLocationClick?: (location: DistributionLocation) => void
}

const trackerConfigs: TrackerConfig[] = [
    { label: "Austria", position: [-2.23, 0.97, 3.08], email: "austria@distributor.com", address: "Vienna, Austria", rotationAdjustment: [0.2, 0.4, 0] },
    { label: "Azerbaijan", position: [-0.75, 0.50, 3.82], email: "azerbaijan@distributor.com", address: "Baku, Azerbaijan", rotationAdjustment: [0.2, -0.1, 0] },
    { label: "Bahrain", position: [-0.50, -0.42, 3.88], email: "bahrain@distributor.com", address: "Manama, Bahrain", rotationAdjustment: [-0.14, -0.14, 0] },
    { label: "Benelux", position: [-2.46, 1.30, 2.77], email: "benelux@distributor.com", address: "Brussels, Belgium", rotationAdjustment: [0.25, 0.35, 0] },
    { label: "Bulgaria", position: [-1.80, 0.63, 3.43], email: "bulgaria@distributor.com", address: "Sofia, Bulgaria", rotationAdjustment: [0.2, 0.2, 0] },
    { label: "Denmark", position: [-2.19, 1.47, 2.91], email: "denmark@distributor.com", address: "Copenhagen, Denmark", rotationAdjustment: [0.27, 0.3, 0] },
    { label: "Croatia", position: [-2.25, 0.76, 3.13], email: "croatia@distributor.com", address: "Zagreb, Croatia", rotationAdjustment: [0.2, 0.3, 0] },
    { label: "Czech Republic", position: [-2.06, 1.15, 3.15], email: "czech@distributor.com", address: "Prague, Czech Republic", rotationAdjustment: [0.25, 0.3, 0] },
    { label: "Egypt", position: [-1.66, -0.46, 3.53], email: "egypt@distributor.com", address: "Cairo, Egypt", rotationAdjustment: [-0.1, 0.15, 0] },
    { label: "France", position: [-2.70, 1.02, 2.66], email: "france@distributor.com", address: "Paris, France", rotationAdjustment: [0.23, 0.62, 0] },
    { label: "Estonia", position: [-1.64, 1.60, 3.21], email: "estonia@distributor.com", address: "Tallinn, Estonia", rotationAdjustment: [0.4, 0.2, 0] },
    { label: "Germany", position: [-2.41, 1.10, 2.90], email: "germany@distributor.com", address: "Berlin, Germany", rotationAdjustment: [0.2, 0.4, 0] },
    { label: "Hungary", position: [-2.05, 0.85, 3.24], email: "hungary@distributor.com", address: "Budapest, Hungary", rotationAdjustment: [0.2, 0.4, 0] },
    { label: "Israel", position: [-1.40, -0.06, 3.67], email: "israel@distributor.com", address: "Tel Aviv, Israel", rotationAdjustment: [0, 0.1, 0] },
    { label: "Italy", position: [-2.41, 0.70, 3.02], email: "italy@distributor.com", address: "Rome, Italy", rotationAdjustment: [0.2, 0.4, 0] },
    { label: "Latvia", position: [-1.71, 1.48, 3.21], email: "latvia@distributor.com", address: "Riga, Latvia", rotationAdjustment: [0.4, 0.2, 0] },
    { label: "Malta", position: [-2.43, 0.21, 3.07], email: "malta@distributor.com", address: "Valletta, Malta", rotationAdjustment: [0.1, 0.4, 0] },
    { label: "Mexico", position: [-2.08, 2.46, -2.24], email: "mexico@distributor.com", address: "Mexico City, Mexico", rotationAdjustment: [0, 2.4, 0.1] },
    { label: "Morocco", position: [-3.15, 0.34, 2.32], email: "morocco@distributor.com", address: "Casablanca, Morocco", rotationAdjustment: [0, 0.7, 0] },
    { label: "Norway", position: [-2.15, 1.74, 2.78], email: "norway@distributor.com", address: "Oslo, Norway", rotationAdjustment: [0.35, 0.4, 0] },
    { label: "Poland", position: [-1.89, 1.27, 3.21], email: "poland@distributor.com", address: "Warsaw, Poland", rotationAdjustment: [0.28, 0.4, 0]},
    { label: "Qatar", position: [-0.47, -0.49, 3.86], email: "qatar@distributor.com", address: "Doha, Qatar", rotationAdjustment: [-0.14, -0.14, 0] },
    { label: "Saudi Arabia", position: [-0.88, -0.49, 3.79], email: "saudi@distributor.com", address: "Riyadh, Saudi Arabia", rotationAdjustment: [-0.1, -0.05, 0] },
    { label: "Spain", position: [-2.96, 0.77, 2.46], email: "spain@distributor.com", address: "Madrid, Spain", rotationAdjustment: [0.2, 0.7, 0] },
    { label: "Sweden", position: [-2.01, 1.61, 2.96], email: "sweden@distributor.com", address: "Stockholm, Sweden", rotationAdjustment: [0.3, 0.42, 0] },
    { label: "Switzerland", position: [-2.42, 0.91, 2.96], email: "switzerland@distributor.com", address: "Zurich, Switzerland", rotationAdjustment: [0.2, 0.4, 0] },
    { label: "Taiwan", position: [2.91, 1.25, 2.32], email: "taiwan@distributor.com", address: "Taipei, Taiwan", rotationAdjustment: [0, -1.2, 0] },
    { label: "UAE", position: [-0.35, -0.61, 3.87], email: "uae@distributor.com", address: "Dubai, UAE", rotationAdjustment: [-0.14, -0.14, 0] },
    { label: "UK", position: [-2.60, 1.46, 2.55], email: "uk@distributor.com", address: "London, UK", rotationAdjustment: [0.35, 0.6, 0] },
    { label: "USA", position: [-2.39, 2.85, -1.25], email: "usa@distributor.com", address: "New York, USA", rotationAdjustment: [0, 2.1, 0.3] },
    { label: "Seychelles", position: [0.02, -2.47, 3.05], email: "seychelles@distributor.com", address: "Victoria, Seychelles", rotationAdjustment: [-0.7, -0.1, 0] },
    { label: "Puerto-Rico", position: [-3.47, 1.37, -1.25], email: "puerto@distributor.com", address: "San Juan, Puerto Rico", rotationAdjustment: [0, 1.92, 0] },
    { label: "Canada", position: [-2.02, 3.31, -0.67], email: "canada@distributor.com", address: "Toronto, Canada", rotationAdjustment: [0, 2.1, 0.7] },
    { label: "Argentina", position: [-2.89, -1.17, -2.38], email: "argentina@distributor.com", address: "Buenos Aires, Argentina", rotationAdjustment: [0, 1.9, -0.7] },
    { label: "Brasil", position: [-3.57, -0.70, -1.46], email: "brasil@distributor.com", address: "São Paulo, Brazil", rotationAdjustment: [0, 1.7, -0.4] },
    { label: "Chile", position: [-2.60, -0.82, -2.82], email: "chile@distributor.com", address: "Santiago, Chile", rotationAdjustment: [0, 2.1, -0.55] },
    { label: "Peru", position: [-2.78, 0.23, -2.76], email: "peru@distributor.com", address: "Lima, Peru", rotationAdjustment: [0, 2.1, -0.4] },
    { label: "Columbia", position: [-3.06, 0.81, -2.32], email: "columbia@distributor.com", address: "Bogotá, Colombia", rotationAdjustment: [0, 2.1, -0.2]},
    { label: "South Korea", position: [2.53, 2.03, 2.21], email: "korea@distributor.com", address: "Seoul, South Korea", rotationAdjustment: [-0.15, -1.3, -0.2]},
    { label: "Dominican Republic", position: [-3.33, 1.55, -1.37], email: "dominican@distributor.com", address: "Santo Domingo, Dominican Republic", rotationAdjustment: [0, 1.9, 0] },
    { label: "Japan", position: [2.66, 2.25, 1.88], email: "japan@distributor.com", address: "Tokyo, Japan", rotationAdjustment: [0.1, -1.3, -0.2] },
]

// Export function to get rotation adjustment by label
export const getRotationAdjustmentByLabel = (label: string): [number, number, number] => {
    const config = trackerConfigs.find(config => config.label === label)
    return config?.rotationAdjustment || [0, 0, 0]
}

export const Trackers = ({ onLocationClick }: TrackersProps) => {
    return (
        <group scale={0.927}>
            {trackerConfigs.map((config) => (
                <Tracker 
                    key={config.label}
                    position={config.position} 
                    label={config.label}
                />
            ))}
        </group>
    )
}
