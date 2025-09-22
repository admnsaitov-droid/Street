import { Html } from "@react-three/drei"
import styled from "styled-components"
import { useState } from "react"
import { DistMarker } from "./DistMarker"
import { useWindowWidth } from "@react-hook/window-size"

interface TrackerProps {
    position: [number, number, number]
    label: string
    name?: string // Display name for the tracker
    isActive?: boolean
    onClick?: () => void
}

export const Tracker = ({ position, label, name, isActive = false, onClick }: TrackerProps) => {
    const [isHovered, setIsHovered] = useState(false)

    const width = useWindowWidth()

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
    padding: 8px 12px;
    color: white;
    font-size: 14px;
    font-weight: 500;
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
        right: calc(100% - 1px);
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
    font-family: inherit;
`   