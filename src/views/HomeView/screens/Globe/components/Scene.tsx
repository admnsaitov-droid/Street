import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { Atmosphere } from "./Atmosphere"
import { Composition } from "./Composition"
import { useInViewRef } from "@/hooks/useInViewRef"
import { PerspectiveCamera } from "@react-three/drei"

const scenePosition: [number, number, number] = [4, 0, -1]
const rotationXSpeed = 0.001
const rotationZSpeed = 0.0001
const mouseRotationIntensity = 0.05

export const Scene = () => {
    const [ref, inViewRef] = useInViewRef()

    return (
        <StyledScene ref={ref}>
            <pointLight position={[-2, 0, 5]} intensity={50} decay={0.9}/>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40}/>
            <Atmosphere scale={5.7} position={scenePosition} />
            <Composition scale={0.4} position={scenePosition} inView={inViewRef} rotationXSpeed={rotationXSpeed} rotationZSpeed={rotationZSpeed} mouseRotationIntensity={mouseRotationIntensity} />
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