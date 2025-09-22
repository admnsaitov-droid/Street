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
    fromRotation?: number
    toRotation?: number
    currentRotationRef?: MutableRefObject<number>
}

export const Tracker = ({ position, label, name, isActive = false, onClick, fromRotation, toRotation, currentRotationRef }: TrackerProps) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    const width = useWindowWidth()

    // Add rotation-based visibility logic (same as Globe trackers)
    useFrame(() => {
        if (fromRotation !== undefined && toRotation !== undefined && currentRotationRef?.current !== undefined) {
            // Normalize rotation to 0-2π range
            const normalizedRotation = ((currentRotationRef.current % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2)
            const normalizedFrom = ((fromRotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2)
            const normalizedTo = ((toRotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2)
            
            let visible = false
            
            if (normalizedFrom <= normalizedTo) {
                // Normal case: from 1 to 4 radians
                visible = normalizedRotation >= normalizedFrom && normalizedRotation <= normalizedTo
            } else {
                // Wrap-around case: from 5 to 1 radians (crossing 0)
                visible = normalizedRotation >= normalizedFrom || normalizedRotation <= normalizedTo
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