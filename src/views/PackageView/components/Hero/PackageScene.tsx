import { Environment, EnvironmentMap, OrbitControls, PerspectiveCamera, useTexture } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { PackageModel } from "./PackageModel"
import * as THREE from "three"

export const PackageScene = () => {    
    return (
        <StyledPackageScene
            gl={{
                powerPreference: "high-performance",
                alpha: true,
                antialias: true,
                toneMappingExposure: Math.pow(2, 0),
                toneMapping: THREE.ACESFilmicToneMapping,
                outputColorSpace: THREE.SRGBColorSpace,
                preserveDrawingBuffer: true,
            }}
        >
            <OrbitControls 
                enableZoom={false} 
                enableRotate={true}
                target={[0, 0, 0]}
                minPolarAngle={Math.PI / 2 - 0.5}
                maxPolarAngle={Math.PI / 2 - 0.5}
            />
            <PackageModel />
            {/* <ambientLight intensity={5} /> */}
            <PerspectiveCamera makeDefault position={[0, 15, -30]} fov={36} rotation={[0, 0, 0]} />
            <fog attach="fog" color='#F8F9FC' near={30} far={70} />
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