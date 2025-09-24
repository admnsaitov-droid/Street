import { Html } from "@react-three/drei"
import styled from "styled-components"
import { useState, MutableRefObject } from "react"
import { DistMarker } from "./DistMarker"
import { useWindowWidth } from "@react-hook/window-size"
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
    const [isHovered, setIsHovered] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    const width = useWindowWidth()

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
                <TrackerContainer
                    onMouseEnter={() => {
                        if (width <= 768) return;
                        setIsHovered(true)
                    }}
                    onMouseLeave={() => {
                        if (width <= 768) return;
                        setIsHovered(false)
                    }}
                    onClick={handleClick}
                >
                    <DistMarker isActive={isActive} />
                    {isHovered && (
                        <TrackerLabel>
                            <TrackerText>{label}</TrackerText>
                        </TrackerLabel>
                    )}
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
    position: absolute;
    left: calc(100% + 16px);
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: ${rm(4)} ${rm(8)};
    color: white;
    font-size: ${rm(14)};
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    z-index: 1000;
    opacity: 0;
    animation: fadeIn 0.2s ease-out forwards;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-50%) translateX(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
        }
    }

    &::before {
        content: '';
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6px 6px 6px 0;
        border-color: transparent rgba(255, 255, 255, 0.2) transparent transparent;
    }

    &::after {
        content: '';
        position: absolute;
        right: calc(100% + 0.1px);
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5px 5px 5px 0;
        border-color: transparent rgba(0, 0, 0, 0.8) transparent transparent;
    }
`

const TrackerText = styled.span`
    color: white;
    ${fontGolosText(400)};
`   