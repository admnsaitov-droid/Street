import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { Atmosphere } from "./Atmosphere"
import { Composition } from "./Composition"
import { useInViewRef } from "@/hooks/useInViewRef"

const rotationXSpeed = 0.001
const rotationZSpeed = 0.001

const scenePosition: [number, number, number] = [4, 0, -1]

export const Scene = () => {
    const [ref, inViewRef] = useInViewRef()

    return (
        <StyledScene ref={ref}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <directionalLight position={[10, 10, 10]} />
            <Atmosphere scale={8.4} position={scenePosition} />
            <Composition scale={5} position={scenePosition} rotationXSpeed={rotationXSpeed} rotationZSpeed={rotationZSpeed} inView={inViewRef} />
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