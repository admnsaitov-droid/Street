import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { ProductModel } from "./components/ProductModel"
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { useSceneManager } from "@/hooks/useSceneManager"
import { SceneSkeleton } from "@/components/Skeleton/SceneSkeleton"
import { Suspense, useEffect } from "react"

interface ProductSceneProps {
    data?: any
    colors: {
        name: string
        color: string
    }[]
}

export const ProductScene = ({ data, colors }: ProductSceneProps) => {
    const sceneManager = useSceneManager({
        threshold: 0.2,
        rootMargin: '100px',
        renderDelay: 150,
        minLoadingTime: 800
    })

    // Mark scene as ready when model data is loaded
    useEffect(() => {
        if (data?.model && sceneManager.shouldRender) {
            // Simulate loading time for model
            const timer = setTimeout(() => {
                sceneManager.setSceneReady()
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [data?.model, sceneManager.shouldRender, sceneManager])

    return (
        <StyledContainer ref={sceneManager.containerRef}>
            <SceneSkeleton isLoading={sceneManager.isLoading} />
            {data?.model && (
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
                    frameloop={sceneManager.isInView ? "always" : "demand"}
                >
                    <Suspense fallback={null}>
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
                        <ProductModel model={data.model} colors={colors} params={{
                            position: [0, -1, 0],
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