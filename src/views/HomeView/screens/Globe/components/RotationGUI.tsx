import { useControls, button } from "leva"
import { useRef } from "react"

export const useRotationControls = () => {
    const currentRotationRef = useRef({ x: 0, y: 0, z: 0 })
    
    // Only show GUI in development mode
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    // isDevelopment ? useControls("Globe Rotation", {
    //     // Current rotation display (read-only)
    //     currentRotation: {
    //         value: { x: 0, y: 0, z: 0 },
    //         render: () => false, // Hide from GUI but keep in controls object
    //     },
    //     // Manual rotation controls
    //     manualRotationX: {
    //         value: 0,
    //         min: -Math.PI,
    //         max: Math.PI,
    //         step: 0.01,
    //         label: "Manual X Rotation"
    //     },
    //     manualRotationY: {
    //         value: 0,
    //         min: -Math.PI,
    //         max: Math.PI,
    //         step: 0.01,
    //         label: "Manual Y Rotation"
    //     },
    //     manualRotationZ: {
    //         value: 0,
    //         min: -Math.PI,
    //         max: Math.PI,
    //         step: 0.01,
    //         label: "Manual Z Rotation"
    //     },
    //     // Auto rotation controls
    //     rotationXSpeed: {
    //         value: 0.001,
    //         min: -0.01,
    //         max: 0.01,
    //         step: 0.0001,
    //         label: "X Rotation Speed"
    //     },
    //     rotationYSpeed: {
    //         value: 0.001,
    //         min: -0.01,
    //         max: 0.01,
    //         step: 0.0001,
    //         label: "Y Rotation Speed"
    //     },
    //     rotationZSpeed: {
    //         value: 0.001,
    //         min: -0.01,
    //         max: 0.01,
    //         step: 0.0001,
    //         label: "Z Rotation Speed"
    //     },
    //     mouseIntensity: {
    //         value: 0.05,
    //         min: 0,
    //         max: 0.2,
    //         step: 0.01,
    //         label: "Mouse Intensity"
    //     },
    //     rotationSmoothing: {
    //         value: 3,
    //         min: 0.1,
    //         max: 10,
    //         step: 0.1,
    //         label: "Rotation Smoothing"
    //     },
    //     enableAutoRotation: {
    //         value: true,
    //         label: "Enable Auto Rotation"
    //     },
    //     enableMouseControl: {
    //         value: true,
    //         label: "Enable Mouse Control"
    //     },
    //     // Buttons
    //     resetRotation: button(() => {
    //         controls.manualRotationX = 0
    //         controls.manualRotationY = 0
    //         controls.manualRotationZ = 0
    //         currentRotationRef.current = { x: 0, y: 0, z: 0 }
    //     }),
    //     copyValues: button(() => {
    //         const values = {
    //             x: currentRotationRef.current.x,
    //             y: currentRotationRef.current.y,
    //             z: currentRotationRef.current.z
    //         }
    //         console.log("Current rotation values:", values)
    //         navigator.clipboard.writeText(JSON.stringify(values))
    //         alert("Rotation values copied to clipboard and console!")
    //     })
    // }) : 

    const controls ={
        // Default values for production (no GUI)
        currentRotation: { x: 0, y: 0, z: 0 },
        manualRotationX: 0,
        manualRotationY: 0,
        manualRotationZ: 0,
        rotationXSpeed: 0.001,
        rotationYSpeed: 0.001,
        rotationZSpeed: 0.001,
        mouseIntensity: 0.05,
        rotationSmoothing: 3,
        enableAutoRotation: true,
        enableMouseControl: true,
        resetRotation: () => {},
        copyValues: () => {}
    }

    return { ...controls, currentRotationRef }
}
