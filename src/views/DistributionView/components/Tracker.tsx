import { Html } from "@react-three/drei"
import styled from "styled-components"
import { DistMarker } from "./DistMarker"

interface TrackerProps {
    position: [number, number, number]
    label: string
}

export const Tracker = ({ position, label }: TrackerProps) => {
    return (
        <group position={position}>
            {/* 3D positioned HTML element */}
            <Html
                center
                distanceFactor={6}
                position={[0, 0, 0]}
                occlude
                zIndexRange={[100, 0]}
            >
                <DistMarker />
            </Html>
        </group>
    )
}

const TrackerLabel = styled.div`
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
`

const TrackerIcon = styled.div`
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    transform: rotate(45deg);
`

const TrackerText = styled.span`
    color: white;
    font-family: inherit;
`   