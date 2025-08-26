import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { Atmosphere } from "./Atmosphere"
import { Composition } from "./Composition"
import { PerspectiveCamera } from "@react-three/drei"

const rotationXSpeed = 0.001
const rotationZSpeed = 0.001

const scenePosition: [number, number, number] = [-2.1, -1.5, -1]
const atmospherePosition: [number, number, number] = [-2.35, -1.5, -1]

export const DistributionScene = () => {
    return (
        <StyledScene>
            {/* <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <directionalLight position={[10, 10, 10]} /> */}
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <Atmosphere scale={5.8} position={atmospherePosition} />
            <Composition scale={3.4} position={scenePosition} rotationXSpeed={rotationXSpeed} rotationZSpeed={rotationZSpeed} />
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