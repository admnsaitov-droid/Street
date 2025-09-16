import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { ProductModel } from "./components/ProductModel"
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

interface ProductSceneProps {
    data: any
    colors: {
        name: string
        color: string
    }[]
}

export const ProductScene = ({ data, colors }: ProductSceneProps) => {

    console.log('🔥 data', data)

    return (
        <StyledCanvas
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
                minPolarAngle={Math.PI / 2 - 0.2}
                maxPolarAngle={Math.PI / 2 - 0.2}
            />
            <ambientLight intensity={6} />
            <PerspectiveCamera makeDefault position={[0, 15, -20]} fov={20} rotation={[0, 0, 0]} />
            <fog attach="fog" color='#F8F9FC' near={30} far={70} />
            <Environment
                files="/models/testHdr4.hdr"
                environmentIntensity={1}
            />
            <ProductModel model={data?.model} colors={colors} params={{
                position: [0, -1, 0],
                rotation: [0, 0, 0],
                scale: 1.4
            }} />
        </StyledCanvas>
    )
}

const StyledCanvas = styled(Canvas)`
    width: 100%;
    height: 100%;
    position: absolute !important;
    top: 0;
    left: 0;
    z-index: 1;
    cursor: grab;
    background-color: #F8F9FC;
`