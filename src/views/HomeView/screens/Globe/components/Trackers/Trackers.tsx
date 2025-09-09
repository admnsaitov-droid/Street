import { useControls } from "leva"
import { Tracker } from "./Tracker"

interface TrackerConfig {
    label: string
    defaultPosition: [number, number, number]
    defaultEnabled: boolean
}

const trackerConfigs: TrackerConfig[] = [
    { label: "Austria", defaultPosition: [2, 1, 2], defaultEnabled: true },
    { label: "France", defaultPosition: [-2.7, 0.4, 4.3], defaultEnabled: true },
    { label: "Brazil", defaultPosition: [0, -1, 2], defaultEnabled: true },
    { label: "Japan", defaultPosition: [1.5, 0, -2], defaultEnabled: true },
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
            step: 0.1, 
            min: -10, 
            max: 10 
        }
        return config
    }, {} as any)

    const controls = isDevelopment ? useControls("Trackers", levaConfig) : trackerConfigs.reduce((config, tracker) => {
        const key = tracker.label.toLowerCase()
        config[`${key}Enabled`] = tracker.defaultEnabled
        config[`${key}Position`] = tracker.defaultPosition
        return config
    }, {} as any)

    return (
        <group>
            {trackerConfigs.map((config) => {
                const key = config.label.toLowerCase()
                const enabled = controls[`${key}Enabled`] as boolean
                const position = controls[`${key}Position`] as [number, number, number]
                
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