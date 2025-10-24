import { Canvas } from "@react-three/fiber"
import styled from "styled-components"
import { Atmosphere } from "./Atmosphere"
import { Composition } from "./Composition"
import { Environment, PerspectiveCamera } from "@react-three/drei"
import { Location as DistributionLocation } from "../data/distributionData"
import { SceneSkeleton } from "@/components/Skeleton/SceneSkeleton"
import { Suspense } from "react"
import { useLazyScene } from "@/hooks/useLazyScene"
import { SceneReadyDetector } from "./SceneReadyDetector"
import { media, rm } from "@/styles"
import { useWindowWidth } from "@react-hook/window-size"
import { heightLvh } from "@/styles/utils"

interface DistributionSceneProps {
    activeFilterId?: string
    onLocationClick?: (location: DistributionLocation | null) => void
    selectedLocation?: DistributionLocation | null
    data?: any
}

const rotationXSpeed = 0.001
const rotationZSpeed = 0.001

const scenePosition: [number, number, number] = [-2.1, -1.5, -1]
const atmospherePosition: [number, number, number] = [-2.35, -1.5, -1]

export const DistributionScene = ({ activeFilterId = 'all', onLocationClick, selectedLocation, data }: DistributionSceneProps) => {
    const lazyScene = useLazyScene('distribution', {
        threshold: 0.1,
        rootMargin: '100px'
    })

    const width = useWindowWidth()

    return (
        <StyledContainer ref={lazyScene.containerRef}>
            <SceneSkeleton 
                isLoading={lazyScene.isLoading} 
                progress={lazyScene.progress} 
                className="distribution-scene-skeleton" 
                position={width > 768 ? "left" : "center"}
            />
            {lazyScene.shouldLoad && (
                <StyledScene frameloop={lazyScene.isInView ? "always" : "demand"}>
                    <Suspense fallback={null}>
                        <SceneReadyDetector sceneType="distribution" />
                        <ambientLight intensity={2} color={0xFFFFFF} />
                        <Environment
                            files="/models/hdr/adams.hdr"
                            environmentIntensity={1}
                        />
                        <directionalLight position={[0, 10, 0]} intensity={1}/> 
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
                            width={width}
                            data={data}
                        />
                    </Suspense>
                </StyledScene>
                
            )}
            <StyledMobileFadeContainer />
        </StyledContainer>
    )
}

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: black;
    overflow: hidden;

    .distribution-scene-skeleton {
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
    width: calc(100% + 50rem) !important;
    height: calc(100% + 10rem) !important;
    transform: translate(-50rem, 0rem) !important;
    position: absolute !important;
    top: 0;
    left: 0;
    z-index: 1;

    ${media.xsm`
        left: 25rem
    `}
`
// 
const StyledMobileFadeContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${rm(120)};
    z-index: 10;
    background: linear-gradient(to top, black 0%, transparent 100%);
    pointer-events: none;
    display: none;
    
    ${media.md`
        display: block;
        height: ${rm(100)};
    `}
    
    ${media.xsm`
        display: block;
        height: ${rm(80)};
    `}
`