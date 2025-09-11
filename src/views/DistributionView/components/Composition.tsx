import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Group } from "three"
import * as THREE from "three"
import { PlanetModel } from "./PlanetModel"
import { Tracker } from "./Tracker"
import { getSpecificSpherePositions } from "@/utils/spherePosition"
import { getLocationsByFilter, Location as DistributionLocation } from "../data/distributionData"

interface CompositionProps {
    scale: number
    position: [number, number, number]
    rotationXSpeed: number
    rotationZSpeed: number
    activeFilterId?: string
    onLocationClick?: (location: DistributionLocation) => void
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

    // Get locations based on active filter
    const locations = getLocationsByFilter(activeFilterId)

    // Handle location click to rotate planet
    const handleLocationClick = (location: DistributionLocation) => {
        if (onLocationClick) {
            onLocationClick(location)
        }
        
        // Calculate rotation to center the location
        const [x, y, z] = location.position
        
        console.log('Location position:', { x, y, z })
        
        // Create vectors for the current position and target position
        const currentPos = new THREE.Vector3(x, y, z)
        const targetPos = new THREE.Vector3(0, 0, 1) // We want the location at the front
        
        // Normalize the current position
        currentPos.normalize()
        
        // Calculate the rotation quaternion
        const quaternion = new THREE.Quaternion()
        quaternion.setFromUnitVectors(currentPos, targetPos)
        
        // Convert to Euler angles with proper order
        const euler = new THREE.Euler()
        euler.setFromQuaternion(quaternion, 'YXZ')
        
        const targetX = euler.x
        const targetY = euler.y
        const targetZ = euler.z
        
        console.log('Quaternion:', quaternion)
        console.log('Euler angles:', { x: euler.x, y: euler.y, z: euler.z })
        console.log('Target rotation:', { x: targetX, y: targetY, z: targetZ })
        
        setTargetRotation({ x: targetX, y: targetY, z: targetZ })
        setIsRotating(true)
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
    })

    return (
        <group ref={groupRef} position={position}>
            {/* Additional group for planet rotation */}
            <group ref={planetGroupRef}>
                <PlanetModel scale={scale} />
                {/* Render trackers based on active filter */}
                {locations.map((location: DistributionLocation) => (
                    <Tracker
                        key={location.id}
                        position={location.position}
                        label={location.name}
                    />
                ))}
            </group>
        </group>
    )
}