import { useGLTF } from "@react-three/drei"
import { useColorStore } from "@/store/store"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"

interface ProductModelProps {
    model: any
    colors: {
        name: string
        color: string
    }[]
    accentColors?: {
        name: string
        color: string
    }[]
    params: {
        position: [number, number, number]
        rotation: [number, number, number]
        scale: number
    }
}

// Helper function to convert hex to rgb
const hexToRgb = (hex: string): string => {
    // Remove # if present
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex)
    if (!result) return hex // Return original if not a valid hex
    
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    return `rgb(${r}, ${g}, ${b})`
}

export const ProductModel = ({ model, colors, accentColors, params = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1
} }: ProductModelProps) => {
    const { scene }: any = useGLTF(getMediaStrapiPath(model))
    // Clone the scene so multiple Canvas instances don't mutate the same object
    const clonedScene: any = useMemo(() => scene?.clone(true), [scene])
    const { activeMainColor, activeAccentColor, setActiveMainColor, setActiveAccentColor } = useColorStore()
    const sceneRef = useRef<THREE.Group>()

    // Set the first main color when component mounts
    useEffect(() => {
        if (colors && colors.length > 0 && !activeMainColor) {
            setActiveMainColor(colors[0])
        }
    }, [colors, activeMainColor, setActiveMainColor])

    // Set the first accent color when component mounts
    useEffect(() => {
        if (accentColors && accentColors.length > 0 && !activeAccentColor) {
            setActiveAccentColor(accentColors[0])
        }
    }, [accentColors, activeAccentColor, setActiveAccentColor])

    // Apply main color to materials with name "blue_metal"
    useEffect(() => {
        if (!sceneRef.current || !activeMainColor?.color) return

        sceneRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                // Handle both single material and array of materials
                const materials = Array.isArray(child.material) ? child.material : [child.material]
                
                materials.forEach((material) => {
                    if ((material instanceof THREE.MeshStandardMaterial || 
                        material instanceof THREE.MeshBasicMaterial ||
                        material instanceof THREE.MeshPhongMaterial ||
                        material instanceof THREE.MeshLambertMaterial) &&
                        material.name === 'blue_metal') {
                        
                        // Set the new color for blue_metal materials
                        material.color.set(activeMainColor.color)
                        material.needsUpdate = true
                    }
                })
            }
        })
    }, [activeMainColor?.color])

    // Apply accent color to materials with name "accent"
    useEffect(() => {
        if (!sceneRef.current || !activeAccentColor?.color) return

        sceneRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                // Handle both single material and array of materials
                const materials = Array.isArray(child.material) ? child.material : [child.material]
                
                materials.forEach((material) => {
                    if ((material instanceof THREE.MeshStandardMaterial || 
                        material instanceof THREE.MeshBasicMaterial ||
                        material instanceof THREE.MeshPhongMaterial ||
                        material instanceof THREE.MeshLambertMaterial) &&
                        material.name === 'accent') {
                        
                        // Convert hex to rgb if needed, otherwise use as is
                        const colorValue = activeAccentColor.color.startsWith('rgb') 
                            ? activeAccentColor.color 
                            : (activeAccentColor.color.startsWith('#') || /^[0-9A-Fa-f]{6}$/.test(activeAccentColor.color))
                            ? hexToRgb(activeAccentColor.color) 
                            : activeAccentColor.color
                        
                        // Set the new color for accent materials
                        material.color.set(colorValue)
                        material.needsUpdate = true
                    }
                })
            }
        })
    }, [activeAccentColor?.color])

    return (
        <primitive
            ref={sceneRef}
            object={clonedScene}
            position={params.position}
            rotation={params.rotation}
            scale={params.scale}
            dispose={null}
        />
    )
}