import { Html } from "@react-three/drei"
import styled from "styled-components"
import { useState, MutableRefObject } from "react"
import { DistMarker } from "./DistMarker"
import { useFrame } from "@react-three/fiber"
import { fontGolosText } from "@/styles/fonts"
import { rm } from "@/styles"

interface TrackerProps {
    position: [number, number, number]
    label: string
    name?: string // Display name for the tracker
    isActive?: boolean
    onClick?: () => void
    fromRotation?: [number, number, number]
    toRotation?: [number, number, number]
    currentRotationRef?: MutableRefObject<{ x: number; y: number; z: number }>
    cameraRotationRef?: MutableRefObject<{ x: number; y: number; z: number }>
}

export const Tracker = ({ position, label, name, isActive = false, onClick, fromRotation, toRotation, currentRotationRef, cameraRotationRef }: TrackerProps) => {
    const [isVisible, setIsVisible] = useState(true)

    // Add rotation-based visibility logic for 3D rotation
    useFrame(() => {
        if (fromRotation !== undefined && toRotation !== undefined && currentRotationRef?.current !== undefined && cameraRotationRef?.current !== undefined) {
            const planetRotation = currentRotationRef.current
            const cameraRotation = cameraRotationRef.current
            
            // Combine planet rotation and camera rotation for total effective rotation
            const totalRotation = {
                x: planetRotation.x + cameraRotation.x,
                y: planetRotation.y + cameraRotation.y,
                z: planetRotation.z + cameraRotation.z
            }
            
            // Check visibility for X and Y axes only (OrbitControls doesn't affect Z)
            let visible = true
            
            for (let axis = 0; axis < 2; axis++) { // Only check X and Y (0 and 1)
                const axisNames = ['x', 'y'] as const
                const axisName = axisNames[axis]
                
                // Normalize rotation to 0-2π range
                const normalizedRotation = ((totalRotation[axisName] % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2)
                const normalizedFrom = ((fromRotation[axis] % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2)
                const normalizedTo = ((toRotation[axis] % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2)
                
                let axisVisible = false
                
                if (normalizedFrom <= normalizedTo) {
                    // Normal case: from 1 to 4 radians
                    axisVisible = normalizedRotation >= normalizedFrom && normalizedRotation <= normalizedTo
                } else {
                    // Wrap-around case: from 5 to 1 radians (crossing 0)
                    axisVisible = normalizedRotation >= normalizedFrom || normalizedRotation <= normalizedTo
                }
                
                // If any axis is not visible, the tracker is not visible
                if (!axisVisible) {
                    visible = false
                    break
                }
            }
            
            setIsVisible(visible)
        } else {
            // If no rotation parameters, always visible
            setIsVisible(true)
        }
    })

    const handleClick = () => {
        if (onClick) {
            onClick()
        }
    }

    return (
        <group position={position}>
            {/* 3D positioned HTML element */}
            <Html
                center
                distanceFactor={5}
                position={[0, 0, 0]}
                // occlude
                zIndexRange={[100, 0]}
                style={{ 
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.2s ease-in-out'
                }}
            >
                <TrackerContainer onClick={handleClick}>
                    <DistMarker isActive={isActive} />
                    <TrackerLabel>
                        <TrackerText>{label}</TrackerText>
                    </TrackerLabel>
                </TrackerContainer>
            </Html>
        </group>
    )
}

const TrackerContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    
    &:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease;
    }
`

const TrackerLabel = styled.div`
    display: flex;
    align-items: center;
    gap: ${rm(10)};
    margin-left: ${rm(8)};
    color: white;
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
`

const TrackerText = styled.span`
    color: white;
    ${fontGolosText(400)};
`   