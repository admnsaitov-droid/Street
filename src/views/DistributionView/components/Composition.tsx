import { useRef, useEffect, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Group } from "three"
import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"
import { PlanetModel } from "./PlanetModel"
import { Trackers } from "./Trackers"
import { Stars } from "./Stars"
import { getSpecificSpherePositions } from "@/utils/spherePosition"
import { Location as DistributionLocation } from "../data/distributionData"
import { getDynamicLocationsByFilter } from "../data/dynamicDataTransformer"
import { getRotationAdjustmentByLabel } from "./Trackers"
import SphereClouds from "@/components/Clouds/SphereClouds"

interface CompositionProps {
    scale: number
    position: [number, number, number]
    rotationXSpeed: number
    rotationZSpeed: number
    activeFilterId?: string
    onLocationClick?: (location: DistributionLocation | null) => void
    selectedLocation?: DistributionLocation | null
    width: number
    data?: any
}

const mouseRotationIntensity = 0.05

export const Composition = ({ scale, position, rotationXSpeed, rotationZSpeed, activeFilterId = 'all', onLocationClick, selectedLocation, width, data }: CompositionProps) => {
    const groupRef = useRef<Group>(null)
    const planetGroupRef = useRef<Group>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const baseRotation = useRef({ x: 0, z: 0 })
    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0, z: 0 })
    const [isRotating, setIsRotating] = useState(false)
    const [targetZoom, setTargetZoom] = useState(width <= 768 ? 16 : 10) // Default camera distance - 2x smaller on mobile
    const [isZooming, setIsZooming] = useState(false)
    const currentRotationRef = useRef({ x: 0, y: 0, z: 0 })
    const cameraRotationRef = useRef({ x: 0, y: 0, z: 0 })
    const lastLogTime = useRef(0)
    const [isProgrammaticControl, setIsProgrammaticControl] = useState(false)
    const [isZoomedIn, setIsZoomedIn] = useState(false)
    const zoomCheckTimeout = useRef<NodeJS.Timeout | null>(null)
    const lastCameraPosition = useRef<THREE.Vector3>(new THREE.Vector3())
    const isUserRotating = useRef(false)
    const rotationTimeout = useRef<NodeJS.Timeout | null>(null)
    
    // Access camera for zoom control
    const { camera } = useThree()
    
    // Ref for OrbitControls to access its methods
    const controlsRef = useRef<any>(null)

    // Function to handle zoom out and deactivate tracker
    const handleZoomOutAndDeactivate = () => {
        console.log('User rotating while zoomed in - zooming out and deactivating tracker')
        
        // Enable programmatic control
        setIsProgrammaticControl(true)
        
        // Preserve current camera rotation but zoom out
        if (camera) {
            const currentSpherical = new THREE.Spherical()
            currentSpherical.setFromVector3(camera.position)
            
            // Convert camera spherical coordinates back to planet rotation coordinates
            setTargetRotation({ 
                x: Math.PI/2 - currentSpherical.phi, // Convert phi back to X
                y: -currentSpherical.theta, // Invert theta back to Y
                z: 0 
            })
            setTargetZoom(width <= 768 ? 16 : 10) // Reset to default zoom distance - 2x smaller on mobile
            setIsRotating(true)
            setIsZooming(true)
            setIsZoomedIn(false) // Mark as not zoomed in
        } else {
            // Fallback to default view if camera not available
            setTargetRotation({ x: 0, y: 0, z: 0 })
            setTargetZoom(width <= 768 ? 16 : 10)
            setIsRotating(true)
            setIsZooming(true)
            setIsZoomedIn(false)
        }
        
        // Deactivate the tracker by calling onLocationClick with null
        if (onLocationClick) {
            onLocationClick(null)
        }
    }


    // Handle location click to rotate planet
    const handleLocationClick = (location: DistributionLocation | null) => {
        if (onLocationClick) {
            onLocationClick(location)
        }
        
        // Enable programmatic control
        setIsProgrammaticControl(true)
        
        if (location === null) {
            // Reset to initial rotation and zoom
            console.log('Resetting to initial rotation and zoom')
            setTargetRotation({ x: 0, y: 0, z: 0 })
            setTargetZoom(width <= 768 ? 16 : 10) // Reset to default zoom - 2x smaller on mobile
            setIsRotating(true)
            setIsZooming(true)
            setIsZoomedIn(false) // Mark as not zoomed in
        } else {
            // Use only manual rotation adjustments from trackerConfigs (ignore base targetRotation)
            const [targetX, targetY, targetZ] = getRotationAdjustmentByLabel(location.name, data)
            
            console.log('Location:', location.name)
            console.log('Using only manual rotation adjustment:', [targetX, targetY, targetZ])
            console.log('(Base targetRotation ignored:', location.targetRotation, ')')
            
            setTargetRotation({ x: targetX, y: targetY, z: targetZ })
            
            // Adjust zoom based on continent - America gets less zoom (more zoomed out) - 2x smaller on mobile
            const zoomLevel = location.region === 'America' ? (width <= 768 ? 14 : 9) : (width <= 768 ? 10 : 7)
            console.log('Region:', location.region, 'Zoom level:', zoomLevel)
            setTargetZoom(zoomLevel)
            
            setIsRotating(true)
            setIsZooming(true)
            setIsZoomedIn(true) // Mark as zoomed in
        }
    }

    useEffect(() => {
        // Initialize camera position tracking
        if (camera) {
            lastCameraPosition.current.copy(camera.position)
        }
        
        return () => {
            // window.removeEventListener('mousemove', handleMouseMove)
            if (zoomCheckTimeout.current) {
                clearTimeout(zoomCheckTimeout.current)
            }
            if (rotationTimeout.current) {
                clearTimeout(rotationTimeout.current)
            }
        }
    }, [camera])

    // Handle selected location changes
    useEffect(() => {
        if (selectedLocation) {
            handleLocationClick(selectedLocation)
        } else if (selectedLocation === null) {
            // Explicitly handle null case for reset
            handleLocationClick(null)
        }
    }, [selectedLocation])

    // Effect to ensure OrbitControls are properly configured when state changes
    useEffect(() => {
        if (controlsRef.current && !isProgrammaticControl) {
            // Force update when coming out of programmatic control
            controlsRef.current.update()
        }
    }, [isProgrammaticControl, isZoomedIn])

    // Effect to add event listeners for OrbitControls
    useEffect(() => {
        if (controlsRef.current) {
            const controls = controlsRef.current
            
            const handleStart = () => {
                if (isZoomedIn && !isProgrammaticControl) {
                    console.log('User started interacting with controls while zoomed in')
                    // Clear any existing timeout
                    if (rotationTimeout.current) {
                        clearTimeout(rotationTimeout.current)
                    }
                    
                    // Set a timeout to zoom out if user continues interacting
                    rotationTimeout.current = setTimeout(() => {
                        if (isZoomedIn && !isProgrammaticControl) {
                            console.log('User continued interacting - zooming out and deactivating')
                            handleZoomOutAndDeactivate()
                        }
                        rotationTimeout.current = null
                    }, 600) // Reduced delay for more responsive feel
                }
            }
            
            const handleEnd = () => {
                // Clear timeout when user stops interacting
                if (rotationTimeout.current) {
                    clearTimeout(rotationTimeout.current)
                    rotationTimeout.current = null
                }
            }
            
            controls.addEventListener('start', handleStart)
            controls.addEventListener('end', handleEnd)
            
            return () => {
                controls.removeEventListener('start', handleStart)
                controls.removeEventListener('end', handleEnd)
            }
        }
    }, [isZoomedIn, isProgrammaticControl])

    useFrame((state, delta) => {

        // Track zoom level in real-time for auto-rotation control
        if (!isProgrammaticControl && camera) {
            const currentDistance = camera.position.length()
            // Adjust threshold based on selected location's region - 2x smaller on mobile
            const zoomThreshold = selectedLocation?.region === 'America' ? (width <= 768 ? 14 : 9.0) : (width <= 768 ? 10 : 8.5)
            const shouldBeZoomedIn = currentDistance < zoomThreshold
            
            if (shouldBeZoomedIn !== isZoomedIn) {
                // Clear any existing timeout
                if (zoomCheckTimeout.current) {
                    clearTimeout(zoomCheckTimeout.current)
                    zoomCheckTimeout.current = null
                }
                
                // Add a small delay to prevent flickering when zooming out
                if (!shouldBeZoomedIn) {
                    console.log('Zooming out - will enable auto-rotation in 300ms')
                    zoomCheckTimeout.current = setTimeout(() => {
                        setIsZoomedIn(shouldBeZoomedIn)
                        zoomCheckTimeout.current = null
                        console.log('Auto-rotation enabled after zoom out')
                    }, 300) // Reduced delay for better responsiveness
                } else {
                    // Immediate update when zooming in
                    console.log('Zooming in - disabling auto-rotation immediately')
                    setIsZoomedIn(shouldBeZoomedIn)
                }
            }
            
            // Update last position for next frame (simplified tracking)
            if (isZoomedIn && !isProgrammaticControl) {
                lastCameraPosition.current.copy(camera.position)
            }
        }

        if (groupRef.current) {
            // Update base rotation
            baseRotation.current.x += 0
            baseRotation.current.z += 0

            // Calculate target rotation (base + mouse influence)
            const targetX = baseRotation.current.x + mouseRef.current.y * mouseRotationIntensity
            const targetZ = baseRotation.current.z + mouseRef.current.x * mouseRotationIntensity

            // Interpolate to target rotation
            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                targetX,
                delta * 3
            )
            groupRef.current.rotation.z = THREE.MathUtils.lerp(
                groupRef.current.rotation.z,
                targetZ,
                delta * 3
            )
            
            // Update the rotation ref for trackers (track all three axes)
            if (planetGroupRef.current) {
                currentRotationRef.current = {
                    x: planetGroupRef.current.rotation.x,
                    y: planetGroupRef.current.rotation.y,
                    z: planetGroupRef.current.rotation.z
                }
            }

            // Track camera rotation from OrbitControls
            if (camera) {
                const spherical = new THREE.Spherical()
                spherical.setFromVector3(camera.position)
                
                // Convert spherical coordinates to rotation angles
                // theta is azimuth (Y rotation), phi is elevation (X rotation)
                cameraRotationRef.current = {
                    x: Math.PI/2 - spherical.phi, // Convert phi to X rotation
                    y: -spherical.theta, // Invert theta for Y rotation
                    z: 0 // Z rotation is not used in OrbitControls
                }
            }

            // Log combined rotation every 2 seconds
            const currentTime = Date.now()
            if (currentTime - lastLogTime.current >= 2000) {
                const combinedRotation = {
                    x: currentRotationRef.current.x + cameraRotationRef.current.x,
                    y: currentRotationRef.current.y + cameraRotationRef.current.y,
                    z: currentRotationRef.current.z + cameraRotationRef.current.z
                }
                lastLogTime.current = currentTime
            }
        }


        // Handle camera zoom and rotation using direct camera control
        if ((isZooming || isRotating) && camera) {
            const currentSpherical = new THREE.Spherical()
            currentSpherical.setFromVector3(camera.position)
            
            const lerpFactor = delta * 3 // Faster movement for more responsive feel
            
            // Handle rotation
            if (isRotating) {
                // Convert planet rotation coordinates to camera spherical coordinates
                // targetRotation.y is the planet's Y rotation (azimuth), targetRotation.x is the planet's X rotation (elevation)
                currentSpherical.theta = THREE.MathUtils.lerp(currentSpherical.theta, -targetRotation.y, lerpFactor) // Invert Y for camera
                currentSpherical.phi = THREE.MathUtils.lerp(currentSpherical.phi, Math.PI/2 - targetRotation.x, lerpFactor) // Convert X to phi
            }
            
            // Handle zoom
            if (isZooming) {
                currentSpherical.radius = THREE.MathUtils.lerp(currentSpherical.radius, targetZoom, lerpFactor)
            }
            
            // Update camera position
            camera.position.setFromSpherical(currentSpherical)
            
            // Update controls to reflect the new position
            if (controlsRef.current) {
                controlsRef.current.update()
            }
            
            // Check if movements are complete
            const threshold = 0.01
            const rotationComplete = !isRotating || (
                Math.abs(currentSpherical.theta - (-targetRotation.y)) < threshold &&
                Math.abs(currentSpherical.phi - (Math.PI/2 - targetRotation.x)) < threshold
            )
            
            const zoomComplete = !isZooming || Math.abs(currentSpherical.radius - targetZoom) < threshold
            
            if (rotationComplete && zoomComplete) {
                setIsRotating(false)
                setIsZooming(false)
                setIsProgrammaticControl(false) // Re-enable user control
                
                // Update zoom state based on final distance - 2x smaller on mobile
                const finalDistance = camera.position.length()
                const zoomThreshold = selectedLocation?.region === 'America' ? (width <= 768 ? 14 : 9.0) : (width <= 768 ? 10 : 8.5)
                const newZoomedInState = finalDistance < zoomThreshold
                setIsZoomedIn(newZoomedInState) // Consider zoomed in based on region-specific threshold
                
                // Ensure OrbitControls are properly updated
                if (controlsRef.current) {
                    controlsRef.current.update()
                }
                
                console.log('Movement complete!', {
                    finalDistance,
                    isZoomedIn: newZoomedInState,
                    isProgrammaticControl: false
                })
            }
        }
    })

    return (
        <>
            {/* OrbitControls for user interaction and programmatic control */}
            <OrbitControls
                ref={controlsRef}
                enabled={!isProgrammaticControl} // Disable user control during programmatic movement
                enablePan={true}
                enableZoom={false}
                enableRotate={true}
                minDistance={5}
                maxDistance={20}
                target={position} // Keep target at planet center
                autoRotate={!isZoomedIn && !isProgrammaticControl} // Auto-rotate only when not zoomed in and not in programmatic control
                autoRotateSpeed={0.25} // Slow auto-rotation speed
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.5}
                zoomSpeed={1}
                panSpeed={0.8}
            />
            
            <group ref={groupRef} position={position}>
                {/* Star field background */}
                <Stars count={1500} radius={120} />
                
                {/* Additional group for planet rotation */}
                <group ref={planetGroupRef}>
                    <group rotation={[-0.35, 0.5, 0]}>
                        <group rotation={[4, 0.9, -3.521836734693878]} renderOrder={2}>
                            <PlanetModel scale={scale} />
                            <SphereClouds size={3.75} />
                        </group>
                        <Trackers onLocationClick={onLocationClick} selectedLocation={selectedLocation} currentRotationRef={currentRotationRef} cameraRotationRef={cameraRotationRef} data={data} />
                    </group>
                </group>
            </group>
        </>
    )
}