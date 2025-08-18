import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { PlanetModel } from "./PlanetModel"

export const Scene = () => {
    return (
        <StyledScene>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <directionalLight position={[10, 10, 10]} />
            <PlanetModel />
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