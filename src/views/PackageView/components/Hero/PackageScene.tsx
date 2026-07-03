import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import styled from "styled-components"
import { PackageModel } from "./PackageModel"
import * as THREE from "three"
import { Tracker } from "./Tracker"
import { SceneSkeleton } from "@/components/Skeleton/SceneSkeleton"
import { Suspense, useCallback, useMemo, useRef, useState, type MutableRefObject } from "react"
import { useLazyScene } from "@/hooks/useLazyScene"
import { SceneReadyDetector } from "@/views/DistributionView/components/SceneReadyDetector"
import { useWindowWidth } from "@react-hook/window-size"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { media, rm } from "@/styles"
import { fontGolosText } from "@/styles/fonts"

interface PackageSceneProps {
    packageType: 'large' | 'medium' | 'small'
    packageModelPath: string
}

interface CameraLerpProps {
    controlsRef: MutableRefObject<OrbitControlsImpl | null>
    cameraRef: MutableRefObject<THREE.PerspectiveCamera | null>
    desiredDistanceRef: MutableRefObject<number | null>
    desiredTargetRef: MutableRefObject<THREE.Vector3 | null>
    desiredPositionRef: MutableRefObject<THREE.Vector3 | null>
}

const PACKAGE_MIN_DISTANCE = 10
const PACKAGE_MAX_DISTANCE = 40

const CameraLerp = ({ controlsRef, cameraRef, desiredDistanceRef, desiredTargetRef, desiredPositionRef }: CameraLerpProps) => {
    useFrame(() => {
        if (!cameraRef.current || !controlsRef.current) return

        const controls = controlsRef.current
        const camera = cameraRef.current
        const target = controls.target.clone()

        let needsUpdate = false

        if (desiredTargetRef.current) {
            const nextTarget = target.clone().lerp(desiredTargetRef.current, 0.12)
            controls.target.copy(nextTarget)
            needsUpdate = true

            if (nextTarget.distanceTo(desiredTargetRef.current) < 0.01) {
                desiredTargetRef.current = null
            }
        }

        if (desiredPositionRef.current) {
            const nextPosition = camera.position.clone().lerp(desiredPositionRef.current, 0.12)
            camera.position.copy(nextPosition)
            needsUpdate = true

            if (nextPosition.distanceTo(desiredPositionRef.current) < 0.05) {
                desiredPositionRef.current = null
            }
        } else {
            const direction = camera.position.clone().sub(controls.target)
            const currentDistance = direction.length()
            let nextDistance = currentDistance

            if (desiredDistanceRef.current !== null) {
                const desiredDistance = desiredDistanceRef.current
                nextDistance = THREE.MathUtils.lerp(currentDistance, desiredDistance, 0.12)

                if (Math.abs(nextDistance - desiredDistance) < 0.05) {
                    desiredDistanceRef.current = null
                }

                needsUpdate = true
            }

            if (needsUpdate) {
                const normalizedDirection = direction.normalize()
                camera.position.copy(controls.target.clone().add(normalizedDirection.multiplyScalar(nextDistance)))
            }
        }

        if (needsUpdate) controls.update()
    })

    return null
}

export const PackageScene = ({ packageType, packageModelPath }: PackageSceneProps) => {
    const lazyScene = useLazyScene('package', {
        threshold: 0.2,
        rootMargin: '100px'
    })

    const width = useWindowWidth()
    const controlsRef = useRef<OrbitControlsImpl | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const desiredDistanceRef = useRef<number | null>(null)
    const desiredTargetRef = useRef<THREE.Vector3 | null>(null)
    const desiredPositionRef = useRef<THREE.Vector3 | null>(null)
    const [showZoomHint, setShowZoomHint] = useState(true)

    const typeBasedCameraPosition: [number, number, number] = packageType === 'large' ? [0, 15, -30] : packageType === 'medium' ? [0, 10, -20] : [0, 8, -15]
    const typeBasedCameraFov: number = packageType === 'large' ? 30 : packageType === 'medium' ? 40 : 40

    const initialCameraPosition = useMemo(() => new THREE.Vector3(...typeBasedCameraPosition), [packageType])
    const initialTarget = useMemo(() => new THREE.Vector3(0, 0, 0), [])
    const initialDistance = useMemo(
        () => initialCameraPosition.clone().sub(initialTarget).length(),
        [initialCameraPosition, initialTarget]
    )

    const updateCameraPosition = useCallback((factor: number) => {
        if (!cameraRef.current || !controlsRef.current) return

        const controls = controlsRef.current
        const camera = cameraRef.current
        const target = controls.target.clone()

        const direction = camera.position.clone().sub(target)
        const newDirection = direction.multiplyScalar(factor)

        const newDistance = Math.min(Math.max(newDirection.length(), PACKAGE_MIN_DISTANCE), PACKAGE_MAX_DISTANCE)

        desiredDistanceRef.current = newDistance
    }, [])

    const handleZoomIn = useCallback(() => {
        setShowZoomHint(false)
        updateCameraPosition(0.8)
    }, [updateCameraPosition])

    const handleZoomOut = useCallback(() => {
        setShowZoomHint(false)
        updateCameraPosition(1.25)
    }, [updateCameraPosition])

    const handleResetView = useCallback(() => {
        if (!cameraRef.current || !controlsRef.current) return

        desiredDistanceRef.current = null
        desiredPositionRef.current = initialCameraPosition.clone()
        desiredTargetRef.current = initialTarget.clone()
    }, [initialCameraPosition, initialTarget])

    return (
        <StyledContainer ref={lazyScene.containerRef}>
            <SceneSkeleton 
                isLoading={lazyScene.isLoading} 
                progress={lazyScene.progress} 
                theme="dark"
                label="machine"
            />
            <StyledActions>
                <div className="buttonWrapper zoomOut" onClick={handleZoomOut}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5957 2.01172C18.1863 2.24437 21.8369 6.04008 21.8369 10.6885L21.8262 11.1348C21.5937 15.7253 17.7976 19.3756 13.1494 19.376L12.7021 19.3652C10.8507 19.2714 9.15288 18.5967 7.78516 17.5215L2.48633 22.8223L1.31641 21.6523L6.58691 16.3799C5.35446 14.96 4.57408 13.1374 4.47266 11.1348L4.46094 10.6885C4.46094 5.89016 8.3511 2 13.1494 2L13.5957 2.01172ZM13.1494 3.65527C9.26507 3.65527 6.11621 6.80413 6.11621 10.6885C6.11641 14.5727 9.26519 17.7217 13.1494 17.7217C17.0333 17.7213 20.1824 14.5724 20.1826 10.6885C20.1826 6.80436 17.0334 3.65565 13.1494 3.65527ZM16.8721 11.5156H9.42578V9.86133H16.8721V11.5156Z" fill="currentColor"/>
                    </svg>
                </div>
                <div className="buttonWrapper reset" onClick={handleResetView}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.936 8.21236C17.7699 9.29893 18.222 10.6303 18.2222 12H20C20 10.4556 19.5529 8.9443 18.7129 7.64841C17.8728 6.35252 16.6757 5.32748 15.2659 4.69702C13.8561 4.06655 12.294 3.85761 10.7681 4.09542C9.2422 4.33324 7.81774 5.00763 6.66667 6.0372V4.88873H4.88889V9.33327H9.33333V7.55546H7.64533C8.27418 6.93926 9.02663 6.46353 9.85297 6.15971C10.6793 5.85589 11.5607 5.7309 12.4389 5.79299C13.3172 5.85508 14.1722 6.10284 14.9476 6.5199C15.7229 6.93695 16.401 7.51382 16.9369 8.21236H16.936ZM7.064 15.7876C6.23008 14.7011 5.77796 13.3697 5.77778 12H4C4.00003 13.5444 4.44706 15.0557 5.28711 16.3516C6.12715 17.6475 7.32432 18.6725 8.7341 19.303C10.1439 19.9334 11.706 20.1424 13.2319 19.9046C14.7578 19.6668 16.1823 18.9924 17.3333 17.9628V19.1113H19.1111V14.6667H14.6667V16.4445H16.3547C15.7258 17.0605 14.9733 17.5359 14.1471 17.8396C13.3209 18.1432 12.4396 18.2681 11.5616 18.2061C10.6835 18.144 9.82859 17.8963 9.0533 17.4794C8.27802 17.0625 7.59999 16.4859 7.064 15.7876Z" fill="currentColor"/>
                    </svg>
                </div>
                <div className="buttonWrapper zoomIn" onClick={handleZoomIn}>
                    {showZoomHint && <div className="tooltip">Zoom in</div>}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5957 2.01172C18.1863 2.24437 21.8369 6.04008 21.8369 10.6885L21.8262 11.1348C21.5937 15.7253 17.7976 19.3756 13.1494 19.376L12.7021 19.3652C10.8507 19.2714 9.15288 18.5967 7.78516 17.5215L2.48633 22.8223L1.31641 21.6523L6.58691 16.3799C5.35446 14.96 4.57408 13.1374 4.47266 11.1348L4.46094 10.6885C4.46094 5.89016 8.3511 2 13.1494 2L13.5957 2.01172ZM13.1494 3.65527C9.26507 3.65527 6.11621 6.80413 6.11621 10.6885C6.11641 14.5727 9.26519 17.7217 13.1494 17.7217C17.0333 17.7213 20.1824 14.5724 20.1826 10.6885C20.1826 6.80436 17.0334 3.65565 13.1494 3.65527ZM13.9766 9.86133H16.8721V11.5156H13.9766V14.4121H12.3213V11.5156H9.42578V9.86133H12.3213V6.96484H13.9766V9.86133Z" fill="currentColor"/>
                    </svg>
                </div>
            </StyledActions>
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
                        <PackageModel packageType={packageType} modelPath={packageModelPath} />
                        <OrbitControls 
                            ref={controlsRef}
                            enableZoom={width <= 768}
                            enableRotate={true}
                            enablePan={false}
                            touches={{
                                ONE: THREE.TOUCH.ROTATE,
                                TWO: THREE.TOUCH.DOLLY_PAN
                            }}
                            minDistance={PACKAGE_MIN_DISTANCE}
                            maxDistance={PACKAGE_MAX_DISTANCE}
                            target={[0, 0, 0]}
                            minPolarAngle={Math.PI / 2 - 2}
                            maxPolarAngle={Math.PI / 2 - 0.1}
                        />
                        <PerspectiveCamera 
                            ref={cameraRef}
                            makeDefault 
                            position={typeBasedCameraPosition} 
                            fov={typeBasedCameraFov} 
                            rotation={[0, 0, 0]} 
                        />
                        <CameraLerp 
                            controlsRef={controlsRef}
                            cameraRef={cameraRef}
                            desiredDistanceRef={desiredDistanceRef}
                            desiredTargetRef={desiredTargetRef}
                            desiredPositionRef={desiredPositionRef}
                        />
                        <fog attach="fog" color='#F8F9FC' near={30} far={70} />
                        <Environment
                            files="/models/hadrMap.hdr"
                            environmentIntensity={1}
                        />
                        {/* <group position={width <= 768 ? [0, -3, 0] : [0, 0, 0]}>
                            <Tracker position={[0.5, 1.5, -0.8]} label="Package" />
                        </group> */}
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

const StyledActions = styled.div`
    position: absolute;
    bottom: ${rm(50)};
    left: 50%;
    z-index: 20;
    transform: translateX(-50%);
    display: flex;
    gap: ${rm(6)};
    padding: ${rm(6)};
    background: #FFFFFF66;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: ${rm(4)};

    ${media.xsm`
        bottom: ${rm(12)};
    `}

    .buttonWrapper {
        width: ${rm(44)};
        height: ${rm(44)};
        display: flex;
        align-items: center;
        justify-content: center;
        background: #FFFFFF;
        border-radius: ${rm(4)};
        cursor: pointer;
        transition: color 0.3s ease;
        position: relative;

        &:hover {
            svg{
                fill: #0040DD;
                color: #0040DD;
            }
        }

        svg{
            width: ${rm(24)};
            height: ${rm(24)};

            transition: color 0.3s ease, fill 0.3s ease;
        }

        .tooltip{
            position: absolute;
            bottom: calc(100% + ${rm(6)});
            left: 50%;
            transform: translateX(-50%);
            background: #0B57D0;
            color: #fff;
            padding: ${rm(6)} ${rm(10)};
            border-radius: ${rm(4)};
            font-size: ${rm(12)};
            white-space: nowrap;
            box-shadow: 0 6px 18px rgba(0,0,0,0.16);
            ${fontGolosText(400)};

            &:after{
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: ${rm(6)} solid transparent;
                border-right: ${rm(6)} solid transparent;
                border-top: ${rm(6)} solid #0B57D0;
            }
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