import { Html } from "@react-three/drei"
import styled from "styled-components"
import { MapMarker } from "@/views/ProjectsView/components/MapMarker"
import { rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"
import { useState, MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface TrackerProps {
    position: [number, number, number]
    label: string
    fromRotation: number
    toRotation: number
    currentRotationRef: MutableRefObject<number>
}

export const Tracker = ({ position, label, fromRotation, toRotation, currentRotationRef }: TrackerProps) => {
    const [isVisible, setIsVisible] = useState(true)

    useFrame(() => {
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
    })

    return (
        <group position={position}>
            {/* 3D positioned HTML element */}
            <Html
                center
                distanceFactor={3}
                position={[0, 0, 0]}
                zIndexRange={[100, 0]}
                style={{ 
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.2s ease-in-out'
                }}
            >
                <TrackerLabel>
                    {/* <TrackerIcon /> */}
                    <MapMarker />
                    <TrackerText>{label}</TrackerText>
                </TrackerLabel>
            </Html>
        </group>
    )
}

const TrackerLabel = styled.div`
    display: flex;
    align-items: center;
    // backdrop-filter: blur(10px);
    color: white;
    font-size: ${rm(16)};
    ${fontGolosText(400)};
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    display: flex;
    gap: ${rm(10)};

    >:nth-child(1) {
        transform: rotate(45deg);
    }
`

const TrackerText = styled.span`
    color: white;
    font-family: inherit;
`   