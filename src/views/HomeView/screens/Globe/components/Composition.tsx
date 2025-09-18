import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Group } from "three"
import * as THREE from "three"
import { PlanetModel } from "./PlanetModel"
import { Trackers } from "./Trackers/Trackers"
import { useRotationControls } from "./RotationGUI"

interface CompositionProps {
    scale: number
    position: [number, number, number]
    inView: any
    rotationXSpeed: number
    rotationZSpeed: number
    mouseRotationIntensity: number
}

export const Composition = ({ scale, position, inView, rotationXSpeed, rotationZSpeed, mouseRotationIntensity }: CompositionProps) => {
    const rotationControls = useRotationControls()
    const groupRef = useRef<Group>(null)
    const mouseGroupRef = useRef<Group>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const baseRotation = useRef({ x: 0, y: 0, z: 0 })

    // Use GUI controls if available, otherwise fallback to props
    const effectiveRotationZSpeed = rotationControls.rotationZSpeed || rotationZSpeed
    const effectiveMouseIntensity = rotationControls.mouseIntensity || mouseRotationIntensity

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
        if (groupRef.current && mouseGroupRef.current && inView.current) {
            // Update base rotation for groupRef (Y axis only)
            baseRotation.current.y -= 0.0002

            // Apply continuous Y rotation to groupRef
            groupRef.current.rotation.y = baseRotation.current.y

            // Calculate mouse-based rotation for mouseGroupRef
            const targetMouseX = mouseRef.current.y * effectiveMouseIntensity
            const targetMouseY = mouseRef.current.x * effectiveMouseIntensity

            // Apply mouse rotation to mouseGroupRef (X and Y axes)
            mouseGroupRef.current.rotation.x = THREE.MathUtils.lerp(
                mouseGroupRef.current.rotation.x,
                targetMouseX,
                delta * 3
            )
            mouseGroupRef.current.rotation.y = THREE.MathUtils.lerp(
                mouseGroupRef.current.rotation.y,
                targetMouseY,
                delta * 3
            )
        }
    })

    return (
        <group 
            ref={groupRef} 
            position={position} 
        >
            <group ref={mouseGroupRef}>
            {/* rotation={[4, 0.9, -3.521836734693878]} */}
                <group rotation={[4, 0.9, -3.521836734693878]}>
                    <PlanetModel scale={scale} />
                </group>
                <Trackers />
            </group>
        </group>
    )
}