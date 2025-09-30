import { Environment, EnvironmentMap, OrbitControls, PerspectiveCamera, useTexture } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { PackageModel } from "./PackageModel"
import * as THREE from "three"
import { Tracker } from "./Tracker"
import { SceneSkeleton } from "@/components/Skeleton/SceneSkeleton"
import { Suspense } from "react"
import { useLazyScene } from "@/hooks/useLazyScene"
import { SceneReadyDetector } from "@/views/DistributionView/components/SceneReadyDetector"
import { useWindowWidth } from "@react-hook/window-size"

export const PackageScene = () => {
    const lazyScene = useLazyScene('package', {
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
                label="machine"
            />
            {lazyScene.shouldLoad && (
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
                    frameloop={lazyScene.isInView ? "always" : "demand"}
                >
                    <Suspense fallback={null}>
                        <SceneReadyDetector sceneType="package" />
                        <PackageModel />
                        <OrbitControls 
                            enableZoom={false} 
                            enableRotate={true}
                            target={[0, 0, 0]}
                            minPolarAngle={width <= 768 ? Math.PI / 2 - 0.3 : Math.PI / 2 - 0.5}
                            maxPolarAngle={width <= 768 ? Math.PI / 2 - 0.3 : Math.PI / 2 - 0.5}
                        />
                        {/* <ambientLight intensity={5} /> */}
                        <PerspectiveCamera makeDefault position={[0, 15, -30]} fov={36} rotation={[0, 0, 0]} />
                        <fog attach="fog" color='#F8F9FC' near={30} far={70} />
                        <Environment
                            files="/models/hadrMap.hdr"
                            environmentIntensity={1}
                        />
                        <group position={ width <= 768 ? [0, -3, 0] : [0, 0, 0]}>
                            <Tracker position={[0.5, 1.5, -0.8]} label="Package" />
                        </group>
                    </Suspense>
                </StyledPackageScene>
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