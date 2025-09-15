import { colors, rm } from "@/styles"
import { Html } from "@react-three/drei"
import styled from "styled-components"
import { useState } from "react"

interface TrackerProps {
    position: [number, number, number]
    label: string
}

export const Tracker = ({ position, label }: TrackerProps) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <group position={position}>
            {/* 3D positioned HTML element */}
            <Html
                center
                // distanceFactor={6}
                position={[0, 0, 0]}
                // occlude
                // zIndexRange={[100, 0]}
            >
                <StyledTracker
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    $isHovered={isHovered}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.00098 8H8.00098M8.00098 8H12.001M8.00098 8V4M8.00098 8V12" stroke="currentColor" stroke-width="1.33333" stroke-linecap="square" stroke-linejoin="round"/>
                    </svg>
                </StyledTracker>
            </Html>
        </group>
    )
}


const StyledTracker = styled.div<{ $isHovered: boolean }>`
    width: ${rm(32)};
    height: ${rm(32)};
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    ${({ $isHovered }) => $isHovered && `
        background: ${colors.blue};
        color: ${colors.white100};
    `}
    
    &:hover {
        background: ${colors.blue};
        color: ${colors.white100};
    }
`