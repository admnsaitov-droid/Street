import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { Atmosphere } from "./Atmosphere"
import { Composition } from "./Composition"
import { useInViewRef } from "@/hooks/useInViewRef"
import { PerspectiveCamera } from "@react-three/drei"
import { useSceneManager } from "@/hooks/useSceneManager"
import { SceneSkeleton } from "@/components/Skeleton/SceneSkeleton"
import { Suspense, useEffect } from "react"

const scenePosition: [number, number, number] = [4, 0, -1]
const rotationXSpeed = 0.0001
const rotationZSpeed = 0.00001
const mouseRotationIntensity = 0.05

export const Scene = () => {
    const [ref, inViewRef] = useInViewRef()
    const sceneManager = useSceneManager({
        threshold: 0.1,
        rootMargin: '100px',
        renderDelay: 100,
        minLoadingTime: 700
    })

    // Mark scene as ready after initial load
    useEffect(() => {
        if (sceneManager.shouldRender) {
            const timer = setTimeout(() => {
                sceneManager.setSceneReady()
            }, 600)
            return () => clearTimeout(timer)
        }
    }, [sceneManager.shouldRender, sceneManager])

    return (
        <StyledContainer ref={sceneManager.containerRef}>
            <SceneSkeleton isLoading={sceneManager.isLoading} />
            <StyledScene ref={ref} frameloop={sceneManager.isInView ? "always" : "demand"}>
                <Suspense fallback={null}>
                    <ambientLight intensity={18} />
                    <pointLight position={[-2, 0, 5]} intensity={50} decay={1.8}/>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40}/>
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

const StyledScene = styled(Canvas)`
    width: 100%;
    height: 100%;
    position: absolute !important;
    top: 0;
    left: 0;
    z-index: 1;
`