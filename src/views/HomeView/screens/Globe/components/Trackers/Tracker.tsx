import { Html } from "@react-three/drei"
import styled from "styled-components"
import { MapMarker } from "@/views/ProjectsView/components/MapMarker"
import { rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"

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
                distanceFactor={3}
                position={[0, 0, 0]}
                occlude
                zIndexRange={[100, 0]}
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