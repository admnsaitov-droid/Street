import { useRef, useEffect, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Group } from "three"
import * as THREE from "three"
import { PlanetModel } from "./PlanetModel"
import { Trackers } from "./Trackers"
import { Stars } from "./Stars"
import { getSpecificSpherePositions } from "@/utils/spherePosition"
import { getLocationsByFilter, Location as DistributionLocation } from "../data/distributionData"
import { getRotationAdjustmentByLabel } from "./Trackers"

interface CompositionProps {
    scale: number
    position: [number, number, number]
    rotationXSpeed: number
    rotationZSpeed: number
    activeFilterId?: string
    onLocationClick?: (location: DistributionLocation | null) => void
    selectedLocation?: DistributionLocation | null
}

const mouseRotationIntensity = 0.05

export const Composition = ({ scale, position, rotationXSpeed, rotationZSpeed, activeFilterId = 'all', onLocationClick, selectedLocation }: CompositionProps) => {
    const groupRef = useRef<Group>(null)
    const planetGroupRef = useRef<Group>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const baseRotation = useRef({ x: 0, z: 0 })
    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0, z: 0 })
    const [isRotating, setIsRotating] = useState(false)
    const [targetZoom, setTargetZoom] = useState(10) // Default camera distance
    const [isZooming, setIsZooming] = useState(false)
    
    // Access camera for zoom control
    const { camera } = useThree()

    // Get locations based on active filter
    const locations = getLocationsByFilter(activeFilterId)

    // Handle location click to rotate planet
    const handleLocationClick = (location: DistributionLocation | null) => {
        if (onLocationClick) {
            onLocationClick(location)
        }
        
        if (location === null) {
            // Reset to initial rotation and zoom
            console.log('Resetting to initial rotation and zoom')
            setTargetRotation({ x: 0, y: 0, z: 0 })
            setTargetZoom(10) // Reset to default zoom
            setIsRotating(true)
            setIsZooming(true)
        } else {
            // Use only manual rotation adjustments from trackerConfigs (ignore base targetRotation)
            const [targetX, targetY, targetZ] = getRotationAdjustmentByLabel(location.name)
            
            console.log('Location:', location.name)
            console.log('Using only manual rotation adjustment:', [targetX, targetY, targetZ])
            console.log('(Base targetRotation ignored:', location.targetRotation, ')')
            
            setTargetRotation({ x: targetX, y: targetY, z: targetZ })
            setTargetZoom(8.5) // Zoom in slightly when location is selected
            setIsRotating(true)
            setIsZooming(true)
        }
    }

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / document.documentElement.clientWidth) * 2 - 1
            mouseRef.current.y = -(event.clientY / document.documentElement.clientHeight) * 2 + 1
        }

        window.addEventListener('mousemove', handleMouseMove)
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    // Handle selected location changes
    useEffect(() => {
        if (selectedLocation) {
            handleLocationClick(selectedLocation)
        } else if (selectedLocation === null) {
            // Explicitly handle null case for reset
            handleLocationClick(null)
        }
    }, [selectedLocation])

    useFrame((state, delta) => {
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
        }

        // Handle planet rotation when location is clicked
        if (planetGroupRef.current && isRotating) {
            const currentRotation = planetGroupRef.current.rotation
            const lerpFactor = delta * 2 // Adjust speed of rotation
            
            // Set rotation order to ensure consistent behavior
            currentRotation.order = 'YXZ'
            
            // Interpolate to target rotation
            currentRotation.x = THREE.MathUtils.lerp(currentRotation.x, targetRotation.x, lerpFactor)
            currentRotation.y = THREE.MathUtils.lerp(currentRotation.y, targetRotation.y, lerpFactor)
            currentRotation.z = THREE.MathUtils.lerp(currentRotation.z, targetRotation.z, lerpFactor)
            
            // Debug: log current rotation occasionally
            if (Math.random() < 0.05) {
                console.log('Current rotation:', { 
                    x: currentRotation.x, 
                    y: currentRotation.y, 
                    z: currentRotation.z 
                })
            }
            
            // Check if rotation is complete
            const threshold = 0.01
            if (Math.abs(currentRotation.x - targetRotation.x) < threshold &&
                Math.abs(currentRotation.y - targetRotation.y) < threshold &&
                Math.abs(currentRotation.z - targetRotation.z) < threshold) {
                setIsRotating(false)
                console.log('Rotation complete!')
            }
        }

        // Handle camera zoom
        if (isZooming && camera) {
            const currentZ = camera.position.z
            const lerpFactor = delta * 2 // Adjust speed of zoom
            
            // Interpolate camera position
            camera.position.z = THREE.MathUtils.lerp(currentZ, targetZoom, lerpFactor)
            
            // Check if zoom is complete
            const zoomThreshold = 0.05
            if (Math.abs(currentZ - targetZoom) < zoomThreshold) {
                setIsZooming(false)
                console.log('Zoom complete!')
            }
        }
    })

    return (
        <group ref={groupRef} position={position}>
            {/* Star field background */}
            <Stars count={800} radius={120} />
            
            {/* Additional group for planet rotation */}
            <group ref={planetGroupRef}>
                <group rotation={[-0.35, 0.5, 0]}>
                    <group rotation={[4, 0.9, -3.521836734693878]}>
                        <PlanetModel scale={scale} />
                    </group>
                    <Trackers onLocationClick={onLocationClick} selectedLocation={selectedLocation} />
                </group>
            </group>
        </group>
    )
}