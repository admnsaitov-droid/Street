import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { Atmosphere } from "./Atmosphere"
import { Composition } from "./Composition"
import { PerspectiveCamera } from "@react-three/drei"
import { Location as DistributionLocation } from "../data/distributionData"
import { useSceneManager } from "@/hooks/useSceneManager"
import { SceneSkeleton } from "@/components/Skeleton/SceneSkeleton"
import { Suspense, useEffect } from "react"

interface DistributionSceneProps {
    activeFilterId?: string
    onLocationClick?: (location: DistributionLocation) => void
    selectedLocation?: DistributionLocation | null
}

const rotationXSpeed = 0.001
const rotationZSpeed = 0.001

const scenePosition: [number, number, number] = [-2.1, -1.5, -1]
const atmospherePosition: [number, number, number] = [-2.35, -1.5, -1]

export const DistributionScene = ({ activeFilterId = 'all', onLocationClick, selectedLocation }: DistributionSceneProps) => {
    const sceneManager = useSceneManager({
        threshold: 0.1,
        rootMargin: '100px',
        renderDelay: 150,
        minLoadingTime: 750
    })

    // Mark scene as ready after initial load
    useEffect(() => {
        if (sceneManager.shouldRender) {
            const timer = setTimeout(() => {
                sceneManager.setSceneReady()
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [sceneManager.shouldRender, sceneManager])

    return (
        <StyledContainer ref={sceneManager.containerRef}>
            <SceneSkeleton isLoading={sceneManager.isLoading} />
            <StyledScene frameloop={sceneManager.isInView ? "always" : "demand"}>
                <Suspense fallback={null}>
                    {/* <pointLight position={[-2, 0, 5]} intensity={50} decay={0.9}/> */}
                    <ambientLight intensity={18} />
                    <pointLight position={[-2, 0, 5]} intensity={15} decay={1.8}/>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40}/>
                    <Atmosphere scale={6.3} position={atmospherePosition} />
                    <Composition 
                        scale={0.37} 
                        position={scenePosition} 
                        rotationXSpeed={rotationXSpeed} 
                        rotationZSpeed={rotationZSpeed}
                        activeFilterId={activeFilterId}
                        onLocationClick={onLocationClick}
                        selectedLocation={selectedLocation}
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