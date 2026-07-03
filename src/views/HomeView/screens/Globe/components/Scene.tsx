import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { Atmosphere } from "./Atmosphere"
import { Composition } from "./Composition"
import { useInViewRef } from "@/hooks/useInViewRef"
import { Environment, PerspectiveCamera } from "@react-three/drei"
import { SceneSkeleton } from "@/components/Skeleton/SceneSkeleton"
import { Suspense } from "react"
import { useLazyScene } from "@/hooks/useLazyScene"
import { SceneReadyDetector } from "@/views/DistributionView/components/SceneReadyDetector"
import { media, rm } from "@/styles"
import { heightLvh } from "@/styles/utils"
import { useWindowWidth } from "@react-hook/window-size"

const rotationXSpeed = 0.0001
const rotationZSpeed = 0.00001
const mouseRotationIntensity = 0.05

export const Scene = () => {
    const [ref, inViewRef] = useInViewRef()
    const lazyScene = useLazyScene('home', {
        threshold: 0.1,
        rootMargin: '100px'
    })
    
    const width = useWindowWidth()

    const scenePosition: [number, number, number] = width > 768 ? [4, 0, -1] : [0, 0, 0]
    const cameraPosition: [number, number, number] = width > 768 ? [0, 0, 8] : [0, 0, 15]


    return (    
        <StyledContainer ref={lazyScene.containerRef}>
            <SceneSkeleton 
                isLoading={lazyScene.isLoading} 
                progress={lazyScene.progress} 
                className="globe-scene-skeleton" 
                // previewSrc="/globePreview.png"
            />
            {lazyScene.shouldLoad && (
                <StyledScene ref={ref} frameloop={lazyScene.isInView ? "always" : "demand"}>
                    <Suspense fallback={null}>
                        <SceneReadyDetector sceneType="home" />
                        <ambientLight intensity={1} color={0xFFE6AA} />
                        <Environment
                            files="/models/hdr/sky.hdr"
                            environmentIntensity={1}
                        />
                        <directionalLight position={[0, 10, 0]} intensity={1}/> 
                        <PerspectiveCamera makeDefault position={cameraPosition} fov={40}/>
                        <Atmosphere scale={5.7} position={scenePosition} />
                        <Composition 
                            scale={0.4} 
                            position={scenePosition} 
                            inView={inViewRef} 
                            rotationXSpeed={rotationXSpeed} 
                            rotationZSpeed={rotationZSpeed} 
                            mouseRotationIntensity={mouseRotationIntensity} 
                        />
                    </Suspense>
                </StyledScene>
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

    ${media.md`
        position: relative;
        ${heightLvh(100)};
        margin-bottom: ${rm(100)};
    `}

    .globe-scene-skeleton {
        background: black;
    }
    
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

const StyledScene = styled(Canvas)`
    width: 100%;
    height: 100%;
    position: absolute !important;
    top: 0;
    left: 0;
    z-index: 1;

    ${media.md`
        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(to bottom, black, transparent);
            z-index: 2;
            pointer-events: none;
        }
        
        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(to top, black, transparent);
            z-index: 2;
            pointer-events: none;
        }
    `}
`