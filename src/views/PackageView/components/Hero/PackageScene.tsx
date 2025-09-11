import { Environment, EnvironmentMap, OrbitControls, PerspectiveCamera, useTexture } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { PackageModel } from "./PackageModel"

export const PackageScene = () => {    
    return (
        <StyledPackageScene>
            <OrbitControls enableZoom={false} />
            <PackageModel />
            {/* <ambientLight intensity={5} /> */}
            <PerspectiveCamera makeDefault position={[0, 15, -30]} fov={15} rotation={[0, 0, 0]} />
            <Environment
                files="/models/hadrMap.hdr"
                environmentIntensity={1}
            />
        </StyledPackageScene>
    )
}

const StyledPackageScene = styled(Canvas)`
    width: 100%;
    height: 100%;
    position: absolute !important;
    top: 0;
    left: 0;
    z-index: 1;
    cursor: grab;
    background-color: #F8F9FC;
`