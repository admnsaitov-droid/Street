import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { ProductModel } from "./components/ProductModel"
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { SceneSkeleton } from "@/components/Skeleton/SceneSkeleton"
import { Suspense } from "react"
import { useLazyScene } from "@/hooks/useLazyScene"
import { SceneReadyDetector } from "@/views/DistributionView/components/SceneReadyDetector"
import { useWindowWidth } from "@react-hook/window-size"

interface ProductSceneProps {
    data?: any
    colors: {
        name: string
        color: string
    }[]
    accentColors?: {
        name: string
        color: string
    }[]
}

export const ProductScene = ({ data, colors, accentColors }: ProductSceneProps) => {
    const lazyScene = useLazyScene('product', {
        threshold: 0.2,
        rootMargin: '100px'
    })
    
    const width = useWindowWidth()

    return (
        <StyledContainer ref={lazyScene.containerRef}>
            <SceneSkeleton 
                isLoading={lazyScene.isLoading} 
                progress={lazyScene.progress} 
                theme="dark"
            />
            {data?.model && lazyScene.shouldLoad && (
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
                    frameloop={lazyScene.isInView ? "always" : "demand"}
                >
                    <Suspense fallback={null}>
                        <SceneReadyDetector sceneType="product" />
                        <OrbitControls 
                            enableZoom={false} 
                            enableRotate={true}
                            target={[0, 0, 0]}
                            minPolarAngle={Math.PI / 2 - 0.2}
                            maxPolarAngle={Math.PI / 2 - 0.2}
                        />
                        <ambientLight intensity={1} />
                        <PerspectiveCamera makeDefault position={[0, 15, -20]} fov={15} rotation={[0, 0, 0]} />
                        <fog attach="fog" color='#F8F9FC' near={40} far={70} />
                        <Environment
                            files="/models/testHdr4.hdr"
                            environmentIntensity={1}
                        />
                        <ProductModel model={data.model} colors={colors} accentColors={accentColors} params={{
                            position: width > 768 ? [0, -1, 0] : [0, -2, 0],
                            rotation: [0, 0, 0],
                            scale: 1.4
                        }} />
                    </Suspense>
                </StyledCanvas>
            )}
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    
    @media (max-width: 768px) {
        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 20%;
            height: 100%;
            border-radius: 0 10px 10px 0;
            z-index: 10;
            pointer-events: all;
        }
        
        &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 20%;
            height: 100%;
            border-radius: 10px 0 0 10px;
            z-index: 10;
            pointer-events: all;
        }
    }
`

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