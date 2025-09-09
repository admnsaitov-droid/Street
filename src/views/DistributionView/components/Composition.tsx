import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Group } from "three"
import * as THREE from "three"
import { PlanetModel } from "./PlanetModel"
import { Tracker } from "./Tracker"
import { getSpecificSpherePositions } from "@/utils/spherePosition"
import { getLocationsByFilter, Location } from "../data/distributionData"

interface CompositionProps {
    scale: number
    position: [number, number, number]
    rotationXSpeed: number
    rotationZSpeed: number
    activeFilterId?: string
}

const mouseRotationIntensity = 0.05

export const Composition = ({ scale, position, rotationXSpeed, rotationZSpeed, activeFilterId = 'all' }: CompositionProps) => {
    const groupRef = useRef<Group>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const baseRotation = useRef({ x: 0, z: 0 })

    // Get locations based on active filter
    const locations = getLocationsByFilter(activeFilterId)

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

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Update base rotation
            // baseRotation.current.x += rotationXSpeed
            // baseRotation.current.z += rotationZSpeed

            baseRotation.current.x += 0
            baseRotation.current.z += 0

            // Calculate target rotation (base + mouse influence)
            const targetX = baseRotation.current.x + mouseRef.current.y * mouseRotationIntensity
            const targetZ = baseRotation.current.z + mouseRef.current.x * mouseRotationIntensity
            // const targetX = mouseRef.current.y * mouseRotationIntensity
            // const targetZ = mouseRef.current.x * mouseRotationIntensity

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
    })

    return (
        <group ref={groupRef} position={position}>
            <PlanetModel scale={scale} />
            {/* Render trackers based on active filter */}
            {locations.map((location: Location) => (
                <Tracker
                    key={location.id}
                    position={location.position}
                    label={location.name}
                />
            ))}
        </group>
    )
}