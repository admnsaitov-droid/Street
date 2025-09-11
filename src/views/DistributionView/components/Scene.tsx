import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { Atmosphere } from "./Atmosphere"
import { Composition } from "./Composition"
import { PerspectiveCamera } from "@react-three/drei"
import { Location as DistributionLocation } from "../data/distributionData"

interface DistributionSceneProps {
    activeFilterId?: string
    onLocationClick?: (location: DistributionLocation) => void
    selectedLocation?: DistributionLocation | null
}

const rotationXSpeed = 0.001
const rotationZSpeed = 0.001

const scenePosition: [number, number, number] = [-2.1, -1.5, -1]
const atmospherePosition: [number, number, number] = [-2.35, -1.5, -1]

export const DistributionScene = ({ activeFilterId = 'all', onLocationClick, selectedLocation }: DistributionSceneProps) => {
    return (
        <StyledScene>
            {/* <pointLight position={[-2, 0, 5]} intensity={50} decay={0.9}/> */}
            <pointLight position={[-2, 0, 5]} intensity={35} decay={0.9}/>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40}/>
            <Atmosphere scale={6.3} position={atmospherePosition} />
            <Composition 
                scale={0.37} 
                position={scenePosition} 
                rotationXSpeed={rotationXSpeed} 
                rotationZSpeed={rotationZSpeed}
                activeFilterId={activeFilterId}
                onLocationClick={onLocationClick}
                selectedLocation={selectedLocation}
            />
        </StyledScene>
    )
}

const StyledScene = styled(Canvas)`
    width: 100%;
    height: 100%;
    position: absolute !important;
    top: 0;
    left: 0;
    z-index: 1;
`