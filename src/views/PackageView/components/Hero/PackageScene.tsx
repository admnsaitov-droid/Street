import { Environment, EnvironmentMap, OrbitControls, PerspectiveCamera, useTexture } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { PackageModel } from "./PackageModel"
import * as THREE from "three"
import { Tracker } from "./Tracker"
import { useSceneManager } from "@/hooks/useSceneManager"
import { SceneSkeleton } from "@/components/Skeleton/SceneSkeleton"
import { Suspense, useEffect } from "react"

export const PackageScene = () => {
    const sceneManager = useSceneManager({
        threshold: 0.2,
        rootMargin: '100px',
        renderDelay: 200,
        minLoadingTime: 600
    })

    // Mark scene as ready after initial load
    useEffect(() => {
        if (sceneManager.shouldRender) {
            const timer = setTimeout(() => {
                sceneManager.setSceneReady()
            }, 400)
            return () => clearTimeout(timer)
        }
    }, [sceneManager.shouldRender, sceneManager])

    return (
        <StyledContainer ref={sceneManager.containerRef}>
            <SceneSkeleton isLoading={sceneManager.isLoading} />
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
                frameloop={sceneManager.isInView ? "always" : "demand"}
            >
                <Suspense fallback={null}>
                    <PackageModel />
                    <OrbitControls 
                        enableZoom={false} 
                        enableRotate={true}
                        target={[0, 0, 0]}
                        minPolarAngle={Math.PI / 2 - 0.5}
                        maxPolarAngle={Math.PI / 2 - 0.5}
                    />
                    {/* <ambientLight intensity={5} /> */}
                    <PerspectiveCamera makeDefault position={[0, 15, -30]} fov={36} rotation={[0, 0, 0]} />
                    <fog attach="fog" color='#F8F9FC' near={30} far={70} />
                    <Environment
                        files="/models/hadrMap.hdr"
                        environmentIntensity={1}
                    />
                    <Tracker position={[0.5, 1.5, -0.8]} label="Package" />
                </Suspense>
            </StyledPackageScene>
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