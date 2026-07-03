import { useRef, useEffect, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Group } from "three"
import * as THREE from "three"
import { PlanetModel } from "@/views/DistributionView/components/PlanetModel"
import { Trackers } from "./Trackers/Trackers"
import { useRotationControls } from "./RotationGUI"
import SphereClouds from "@/components/Clouds/SphereClouds"

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
    const baseRotation = useRef({ x: 0, y: 0, z: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })
    const dragRotation = useRef({ y: 0 })
    const targetRotation = useRef({ y: 0 })
    const currentRotation = useRef({ y: 0 })
    const velocity = useRef({ y: 0 })
    const currentRotationRef = useRef(0)
    const { gl } = useThree()
    
    // Rotation settings - only Y-axis rotation allowed
    const dampingFactor = 0.95
    const smoothingFactor = 0.1
    
    // Mobile-specific settings
    const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window
    const touchSensitivity = isMobile ? 0.004 : 0.008 // Slightly higher sensitivity for mobile

    // Use GUI controls if available, otherwise fallback to props
    const effectiveRotationZSpeed = rotationControls.rotationZSpeed || rotationZSpeed
    const effectiveMouseIntensity = rotationControls.mouseIntensity || mouseRotationIntensity

    useEffect(() => {
        const canvas = gl.domElement

        const handleMouseDown = (event: MouseEvent) => {
            setIsDragging(true)
            dragStart.current.x = event.clientX
            dragStart.current.y = event.clientY
            canvas.style.cursor = 'grabbing'
        }

        const handleMouseMove = (event: MouseEvent) => {
            if (!isDragging) return

            const deltaX = event.clientX - dragStart.current.x

            // Convert pixel movement to rotation - only horizontal (Y-axis)
            // Use appropriate sensitivity based on device type
            const deltaRotationY = deltaX * (isMobile ? 0.008 : 0.008)

            // Update velocity for momentum
            velocity.current.y = deltaRotationY

            // Update target rotation - unlimited Y-axis rotation
            targetRotation.current.y += deltaRotationY

            dragStart.current.x = event.clientX
            dragStart.current.y = event.clientY
        }

        const handleMouseUp = () => {
            setIsDragging(false)
            canvas.style.cursor = 'grab'
        }

        // Touch event handlers for mobile support
        const handleTouchStart = (event: TouchEvent) => {
            event.preventDefault() // Prevent scrolling
            setIsDragging(true)
            const touch = event.touches[0]
            dragStart.current.x = touch.clientX
            dragStart.current.y = touch.clientY
        }

        const handleTouchMove = (event: TouchEvent) => {
            if (!isDragging) return
            event.preventDefault() // Prevent scrolling

            const touch = event.touches[0]
            const deltaX = touch.clientX - dragStart.current.x

            // Convert pixel movement to rotation - only horizontal (Y-axis)
            // Use mobile-specific sensitivity
            const deltaRotationY = deltaX * touchSensitivity

            // Update velocity for momentum
            velocity.current.y = deltaRotationY

            // Update target rotation - unlimited Y-axis rotation
            targetRotation.current.y += deltaRotationY

            dragStart.current.x = touch.clientX
            dragStart.current.y = touch.clientY
        }

        const handleTouchEnd = (event: TouchEvent) => {
            event.preventDefault() // Prevent scrolling
            setIsDragging(false)
        }

        // Mouse events
        canvas.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        
        // Touch events
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false })
        
        // Set initial cursor
        canvas.style.cursor = 'grab'

        return () => {
            // Mouse events cleanup
            canvas.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            
            // Touch events cleanup
            canvas.removeEventListener('touchstart', handleTouchStart)
            canvas.removeEventListener('touchmove', handleTouchMove)
            canvas.removeEventListener('touchend', handleTouchEnd)
        }
    }, [isDragging, gl])

    useFrame((state, delta) => {
        if (groupRef.current && mouseGroupRef.current) {
            // Update base rotation for groupRef (Y axis only) - continuous auto-rotation
            if (!isDragging) {
                baseRotation.current.y -= 0.0002
                
                // Apply momentum and damping when not dragging
                velocity.current.y *= dampingFactor
                
                // Continue rotation with momentum - unlimited Y-axis rotation
                if (Math.abs(velocity.current.y) > 0.001) {
                    targetRotation.current.y += velocity.current.y
                }
            }

            // Smooth interpolation towards target rotation - only Y-axis
            currentRotation.current.y = THREE.MathUtils.lerp(
                currentRotation.current.y,
                targetRotation.current.y,
                smoothingFactor
            )

            // Update drag rotation for smooth application
            dragRotation.current.y = currentRotation.current.y

            // Apply combined rotation: base rotation + smooth drag rotation
            groupRef.current.rotation.y = baseRotation.current.y + dragRotation.current.y
            
            // Update the rotation ref for trackers
            currentRotationRef.current = groupRef.current.rotation.y
            
            // Reset X rotation to 0 (no vertical rotation)
            mouseGroupRef.current.rotation.x = 0
        }
    })

    return (
        <group 
            ref={groupRef} 
            position={position} 
        >
            <group ref={mouseGroupRef}>
            {/* rotation={[4, 0.9, -3.521836734693878]} */}
                <group rotation={[4, 0.9, -3.521836734693878]} renderOrder={2}>
                    <PlanetModel scale={scale} />
                    <SphereClouds/>
                </group>
                <Trackers currentRotationRef={currentRotationRef} />
            </group>
        </group>
    )
}