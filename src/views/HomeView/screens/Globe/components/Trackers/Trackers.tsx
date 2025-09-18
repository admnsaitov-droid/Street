import { useControls } from "leva"
import { Tracker } from "./Tracker"

interface TrackerConfig {
    label: string
    defaultPosition: [number, number, number]
    defaultEnabled: boolean
}

const trackerConfigs: TrackerConfig[] = [
    { label: "Austria", defaultPosition: [-2.23, 0.97, 3.08], defaultEnabled: true },
    { label: "Azerbaijan", defaultPosition: [-0.75, 0.50, 3.82], defaultEnabled: true },
    { label: "Bahrain", defaultPosition: [-0.50, -0.42, 3.88], defaultEnabled: true },
    { label: "Benelux", defaultPosition: [-2.46, 1.30, 2.77], defaultEnabled: true },
    { label: "Bulgaria", defaultPosition: [-1.80, 0.63, 3.43], defaultEnabled: true },
    { label: "Denmark", defaultPosition: [-2.19, 1.47, 2.91], defaultEnabled: true },
    { label: "Croatia", defaultPosition: [-2.25, 0.76, 3.13], defaultEnabled: true },
    { label: "Czech Republic", defaultPosition: [-2.06, 1.15, 3.15], defaultEnabled: true },
    { label: "Egypt", defaultPosition: [-1.66, -0.46, 3.53], defaultEnabled: true },
    { label: "France", defaultPosition: [-2.70, 1.02, 2.66], defaultEnabled: true },
    { label: "Estonia", defaultPosition: [-1.64, 1.60, 3.21], defaultEnabled: true },
    { label: "Germany", defaultPosition: [-2.41, 1.10, 2.90], defaultEnabled: true },
    { label: "Hungary", defaultPosition: [-2.05, 0.85, 3.24], defaultEnabled: true },
    { label: "Israel", defaultPosition: [-1.40, -0.06, 3.67], defaultEnabled: true },
    { label: "Italy", defaultPosition: [-2.41, 0.70, 3.02], defaultEnabled: true },
    { label: "Latvia", defaultPosition: [-1.71, 1.48, 3.21], defaultEnabled: true },
    { label: "Malta", defaultPosition: [-2.43, 0.21, 3.07], defaultEnabled: true },
    { label: "Mexico", defaultPosition: [-2.08, 2.46, -2.24], defaultEnabled: true },
    { label: "Morocco", defaultPosition: [-3.15, 0.34, 2.32], defaultEnabled: true },
    { label: "Norway", defaultPosition: [-2.15, 1.74, 2.78], defaultEnabled: true },
    { label: "Poland", defaultPosition: [-1.89, 1.27, 3.21], defaultEnabled: true },
    { label: "Qatar", defaultPosition: [-0.47, -0.49, 3.86], defaultEnabled: true },
    { label: "Saudi Arabia", defaultPosition: [-0.88, -0.49, 3.79], defaultEnabled: true },
    { label: "Spain", defaultPosition: [-2.96, 0.77, 2.46], defaultEnabled: true },
    { label: "Sweden", defaultPosition: [-2.01, 1.61, 2.96], defaultEnabled: true },
    { label: "Switzerland", defaultPosition: [-2.42, 0.91, 2.96], defaultEnabled: true },
    { label: "Taiwan", defaultPosition: [2.91, 1.25, 2.32], defaultEnabled: true },
    { label: "UAE", defaultPosition: [-0.35, -0.61, 3.87], defaultEnabled: true },
    { label: "UK", defaultPosition: [-2.60, 1.46, 2.55], defaultEnabled: true },
    { label: "USA", defaultPosition: [-2.39, 2.85, -1.25], defaultEnabled: true },
    { label: "Seychelles", defaultPosition: [0.02, -2.47, 3.05], defaultEnabled: true },
    { label: "Puerto-Rico", defaultPosition: [-3.47, 1.37, -1.25], defaultEnabled: true },
    { label: "Canada", defaultPosition: [-2.02, 3.31, -0.67], defaultEnabled: true },
    { label: "Argentina", defaultPosition: [-2.89, -1.17, -2.38], defaultEnabled: true },
    { label: "Brasil", defaultPosition: [-3.57, -0.70, -1.46], defaultEnabled: true },
    { label: "Chile", defaultPosition: [-2.60, -0.82, -2.82], defaultEnabled: true },
    { label: "Peru", defaultPosition: [-2.78, 0.23, -2.76], defaultEnabled: true },
    { label: "Columbia", defaultPosition: [-3.06, 0.81, -2.32], defaultEnabled: true },
    { label: "South Korea", defaultPosition: [2.53, 2.03, 2.21], defaultEnabled: true },
    { label: "Dominican Republic", defaultPosition: [-3.33, 1.55, -1.37], defaultEnabled: true },
    { label: "Japan", defaultPosition: [2.66, 2.25, 1.88], defaultEnabled: true },
]

export const Trackers = () => {
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
        <group>
            {trackerConfigs.map((config) => {
                const key = config.label.toLowerCase()
                const enabled = (controls as any)[`${key}Enabled`] as boolean
                const position = (controls as any)[`${key}Position`] as [number, number, number]
                
                return enabled ? (
                    <Tracker 
                        key={config.label}
                        position={position} 
                        label={config.label} 
                    />
                ) : null
            })}
        </group>
    )
}