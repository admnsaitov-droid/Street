import { useControls } from "leva"
import { Tracker } from "./Tracker"
import { MutableRefObject } from "react"

interface TrackerConfig {
    label: string
    defaultPosition: [number, number, number]
    defaultEnabled: boolean
    fromRotation: number
    toRotation: number
}

const trackerConfigs: TrackerConfig[] = [
    { label: "Austria", defaultPosition: [-2.23, 0.97, 3.08], defaultEnabled: true, fromRotation: -0.83, toRotation: 1.5 },
    { label: "Azerbaijan", defaultPosition: [-0.75, 0.50, 3.82], defaultEnabled: true, fromRotation: -1.0, toRotation: 2.0 },
    { label: "Bahrain", defaultPosition: [-0.50, -0.42, 3.88], defaultEnabled: true, fromRotation: -1.0, toRotation: 2.0 },
    { label: "Benelux", defaultPosition: [-2.46, 1.30, 2.77], defaultEnabled: true, fromRotation: -0.85, toRotation: 1.5 },
    { label: "Bulgaria", defaultPosition: [-1.80, 0.63, 3.43], defaultEnabled: true, fromRotation: -1.2, toRotation: 1.8 },
    { label: "Denmark", defaultPosition: [-2.19, 1.47, 2.91], defaultEnabled: true, fromRotation: -0.87, toRotation: 1.5 },
    { label: "Croatia", defaultPosition: [-2.25, 0.76, 3.13], defaultEnabled: true, fromRotation: -0.88, toRotation: 1.5 },
    { label: "Czech Republic", defaultPosition: [-2.06, 1.15, 3.15], defaultEnabled: true, fromRotation: -0.83, toRotation: 1.6 },
    { label: "Egypt", defaultPosition: [-1.66, -0.46, 3.53], defaultEnabled: true, fromRotation: -1.2, toRotation: 1.8 },
    { label: "France", defaultPosition: [-2.70, 1.02, 2.66], defaultEnabled: true, fromRotation: -0.85, toRotation: 1.4 },
    { label: "Estonia", defaultPosition: [-1.64, 1.60, 3.21], defaultEnabled: true, fromRotation: -0.82, toRotation: 1.8 },
    { label: "Germany", defaultPosition: [-2.41, 1.10, 2.90], defaultEnabled: true, fromRotation: -0.8, toRotation: 1.5 },
    { label: "Hungary", defaultPosition: [-2.05, 0.85, 3.24], defaultEnabled: true, fromRotation: -0.82, toRotation: 1.6 },
    { label: "Israel", defaultPosition: [-1.40, -0.06, 3.67], defaultEnabled: true, fromRotation: -1.1, toRotation: 1.9 },
    { label: "Italy", defaultPosition: [-2.41, 0.70, 3.02], defaultEnabled: true, fromRotation: -0.81, toRotation: 1.5 },
    { label: "Latvia", defaultPosition: [-1.71, 1.48, 3.21], defaultEnabled: true, fromRotation: -0.88, toRotation: 1.8 },
    { label: "Malta", defaultPosition: [-2.43, 0.21, 3.07], defaultEnabled: true, fromRotation: -0.89, toRotation: 1.5 },
    { label: "Mexico", defaultPosition: [-2.08, 2.46, -2.24], defaultEnabled: true, fromRotation: 0.785, toRotation: 2.4 },
    { label: "Morocco", defaultPosition: [-3.15, 0.34, 2.32], defaultEnabled: true, fromRotation: -0.85, toRotation: 1.2 },
    { label: "Norway", defaultPosition: [-2.15, 1.74, 2.78], defaultEnabled: true, fromRotation: -0.8, toRotation: 1.6 },
    { label: "Poland", defaultPosition: [-1.89, 1.27, 3.21], defaultEnabled: true, fromRotation: -0.85, toRotation: 1.7 },
    { label: "Qatar", defaultPosition: [-0.47, -0.49, 3.86], defaultEnabled: true, fromRotation: -1.0, toRotation: 2.0 },
    { label: "Saudi Arabia", defaultPosition: [-0.88, -0.49, 3.79], defaultEnabled: true, fromRotation: -1.0, toRotation: 2.0 },
    { label: "Spain", defaultPosition: [-2.96, 0.77, 2.46], defaultEnabled: true, fromRotation: -0.82, toRotation: 1.3 },
    { label: "Sweden", defaultPosition: [-2.01, 1.61, 2.96], defaultEnabled: true, fromRotation: -0.81, toRotation: 1.6 },
    { label: "Switzerland", defaultPosition: [-2.42, 0.91, 2.96], defaultEnabled: true, fromRotation: -0.87, toRotation: 1.5 },
    { label: "Taiwan", defaultPosition: [2.91, 1.25, 2.32], defaultEnabled: true, fromRotation: 4.2, toRotation: 5.2 },
    { label: "UAE", defaultPosition: [-0.35, -0.61, 3.87], defaultEnabled: true, fromRotation: -0.9, toRotation: 2.1 },
    { label: "UK", defaultPosition: [-2.60, 1.46, 2.55], defaultEnabled: true, fromRotation: -0.88, toRotation: 1.4 },
    { label: "USA", defaultPosition: [-2.39, 2.85, -1.25], defaultEnabled: true, fromRotation: 0.8, toRotation: 2.4 },
    { label: "Seychelles", defaultPosition: [0.02, -2.47, 3.05], defaultEnabled: true, fromRotation: 0, toRotation: 2.2 },
    { label: "Puerto-Rico", defaultPosition: [-3.47, 1.37, -1.25], defaultEnabled: true, fromRotation: 0.685, toRotation: 2.4 },
    { label: "Canada", defaultPosition: [-2.02, 3.31, -0.67], defaultEnabled: true, fromRotation: 0.8, toRotation: 2.4 },
    { label: "Argentina", defaultPosition: [-2.89, -1.17, -2.38], defaultEnabled: true, fromRotation: 0.76, toRotation: 2.4 },
    { label: "Brasil", defaultPosition: [-3.57, -0.70, -1.46], defaultEnabled: true, fromRotation: 0.645, toRotation: 2.4 },
    { label: "Chile", defaultPosition: [-2.60, -0.82, -2.82], defaultEnabled: true, fromRotation: 0.83, toRotation: 2.45 },
    { label: "Peru", defaultPosition: [-2.78, 0.23, -2.76], defaultEnabled: true, fromRotation: 0.8, toRotation: 2.4 },
    { label: "Columbia", defaultPosition: [-3.06, 0.81, -2.32], defaultEnabled: true, fromRotation: 0.78, toRotation: 2.4 },
    { label: "South Korea", defaultPosition: [2.53, 2.03, 2.21], defaultEnabled: true, fromRotation: 4.27, toRotation: 5.27 },
    { label: "Dominican Republic", defaultPosition: [-3.33, 1.55, -1.37], defaultEnabled: true, fromRotation: 0.75, toRotation: 2.4 },
    { label: "Japan", defaultPosition: [2.66, 2.25, 1.88], defaultEnabled: true, fromRotation: 4.23, toRotation: 5.26 },
]

interface TrackersProps {
    currentRotationRef: MutableRefObject<number>
}

export const Trackers = ({ currentRotationRef }: TrackersProps) => {
    // Only show GUI in development mode
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    // Dynamically create Leva controls
    const levaConfig = trackerConfigs.reduce((config, tracker) => {
        const key = tracker.label.toLowerCase()
        config[`${key}Enabled`] = tracker.defaultEnabled
        config[`${key}Position`] = { 
            value: tracker.defaultPosition, 
            step: 0.01, 
            min: -10, 
            max: 10 
        }
        return config
    }, {} as any)

    // const controls = useControls("Trackers", isDevelopment ? levaConfig : trackerConfigs.reduce((config, tracker) => {
    //     const key = tracker.label.toLowerCase()
    //     config[`${key}Enabled`] = tracker.defaultEnabled
    //     config[`${key}Position`] = tracker.defaultPosition
    //     return config
    // }, {} as any))

    const controls = trackerConfigs.reduce((config, tracker) => {
        const key = tracker.label.toLowerCase()
        config[`${key}Enabled`] = tracker.defaultEnabled
        config[`${key}Position`] = tracker.defaultPosition
        return config
    }, {} as any)

    return (
        <group renderOrder={3}>
            {trackerConfigs.map((config) => {
                const key = config.label.toLowerCase()
                const enabled = (controls as any)[`${key}Enabled`] as boolean
                const position = (controls as any)[`${key}Position`] as [number, number, number]
                
                return enabled ? (
                    <Tracker 
                        key={config.label}
                        position={position} 
                        label={config.label}
                        fromRotation={config.fromRotation}
                        toRotation={config.toRotation}
                        currentRotationRef={currentRotationRef}
                    />
                ) : null
            })}
        </group>
    )
}