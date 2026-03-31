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

// Helper function to convert THREE.Color to rgb string
const colorToRgb = (color: THREE.Color): string => {
    const r = Math.round(color.r * 255)
    const g = Math.round(color.g * 255)
    const b = Math.round(color.b * 255)
    return `rgb(${r}, ${g}, ${b})`
}

export const ProductModel = ({ model, colors, accentColors, params = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1
} }: ProductModelProps) => {
    const { scene }: any = useGLTF(getMediaStrapiPath(model))
    // const { scene }: any = useGLTF('/models/testProductModel.glb')
    // Clone the scene so multiple Canvas instances don't mutate the same object
    const clonedScene: any = useMemo(() => scene?.clone(true), [scene])
    const { activeMainColor, activeAccentColor, setActiveMainColor, setActiveAccentColor, setMaterialMainColor, setMaterialAccentColor } = useColorStore()
    const sceneRef = useRef<THREE.Group>()
    const colorsExtractedRef = useRef(false)
    const originalMainColorRef = useRef<string | null>(null)
    const originalAccentColorRef = useRef<string | null>(null)
    const originalMainColorObjectRef = useRef<THREE.Color | null>(null)
    const originalAccentColorObjectRef = useRef<THREE.Color | null>(null)

    // Extract colors from materials first, before API colors
    useEffect(() => {
        // Reset extraction flag when model changes
        colorsExtractedRef.current = false
    }, [model])
    
    useEffect(() => {
        if (!clonedScene || colorsExtractedRef.current) return

        let extractedMainColor: { name: string; color: string } | null = null
        let extractedAccentColor: { name: string; color: string } | null = null

        clonedScene.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh && child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material]
                
                materials.forEach((material) => {
                    if ((material instanceof THREE.MeshStandardMaterial || 
                        material instanceof THREE.MeshBasicMaterial ||
                        material instanceof THREE.MeshPhongMaterial ||
                        material instanceof THREE.MeshLambertMaterial)) {
                        
                        // Set roughness for Rubber pattern.001 material
                        if ((material.name === 'Rubber pattern.001' || material.name === 'Rubber_pattern') && material instanceof THREE.MeshStandardMaterial) {
                            material.roughness = 1
                            material.needsUpdate = true
                        }
                        
                        // Set normal map scale for blue_metal, white_metal, accent, and leather materials
                        if ((material.name === 'blue_metal' || material.name === 'accent') && 
                            (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhongMaterial)) {
                            if (!material.normalScale) {
                                material.normalScale = new THREE.Vector2(1, 1)
                            }
                            material.normalScale.set(-3, 3)
                            material.needsUpdate = true
                        }

                        if ((material.name === 'leather') && 
                            (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhongMaterial)) {
                            if (!material.normalScale) {
                                material.normalScale = new THREE.Vector2(1, 1)
                            }
                            material.normalScale.set(-5, 5)
                            material.needsUpdate = true
                        }
                        
                        // Extract main color from blue_metal or white_metal material
                        if ((material.name === 'blue_metal' ) && !extractedMainColor) {
                            const colorStr = colorToRgb(material.color)
                            originalMainColorRef.current = colorStr
                            // Store the original THREE.Color object to preserve exact precision
                            originalMainColorObjectRef.current = material.color.clone()
                            extractedMainColor = {
                                name: 'Material Color',
                                color: colorStr
                            }
                        }
                        
                        // Extract accent color from accent material
                        if (material.name === 'accent' && !extractedAccentColor) {
                            const colorStr = colorToRgb(material.color)

                            originalAccentColorRef.current = colorStr
                            // Store the original THREE.Color object to preserve exact precision
                            originalAccentColorObjectRef.current = material.color.clone()
                            extractedAccentColor = {
                                name: 'Material Color',
                                color: colorStr
                            }
                        }
                    }
                })
            }
        })

        // Store material colors in the store
        if (extractedMainColor) {
            setMaterialMainColor(extractedMainColor)
            setActiveMainColor(extractedMainColor)
        }
        if (extractedAccentColor) {
            setMaterialAccentColor(extractedAccentColor)
            setActiveAccentColor(extractedAccentColor)
        }

        colorsExtractedRef.current = true
    }, [clonedScene, setActiveMainColor, setActiveAccentColor, setMaterialMainColor, setMaterialAccentColor])

    // Don't automatically set API colors - they should only be available in the panel
    // Material colors are set as initial active colors, and API colors can be selected by user

    // Apply main color to materials with name "blue_metal" or "white_metal" (only if different from current)
    useEffect(() => {
        if (!sceneRef.current || !activeMainColor?.color) return

        sceneRef.current.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh && child.material) {
                // Handle both single material and array of materials
                const materials = Array.isArray(child.material) ? child.material : [child.material]
                
                materials.forEach((material) => {
                    if ((material instanceof THREE.MeshStandardMaterial || 
                        material instanceof THREE.MeshBasicMaterial ||
                        material instanceof THREE.MeshPhongMaterial ||
                        material instanceof THREE.MeshLambertMaterial) &&
                        (material.name === 'blue_metal')) {
                        
                        // Check if the current material color is different from the active color
                        const currentMaterialColor = colorToRgb(material.color)
                        if (currentMaterialColor !== activeMainColor.color) {
                            // If this is the material color, use the original THREE.Color object for exact precision
                            if (activeMainColor.color === originalMainColorRef.current && originalMainColorObjectRef.current) {
                                material.color.copy(originalMainColorObjectRef.current)
                            } else {
                                // Set the new color for blue_metal / white_metal materials
                                material.color.set(activeMainColor.color)
                            }
                            material.needsUpdate = true
                        }
                    }
                })
            }
        })
    }, [activeMainColor?.color])

    // Apply accent color to materials with name "accent" (only if different from current)
    useEffect(() => {
        if (!sceneRef.current || !activeAccentColor?.color) return

        // Convert hex to rgb if needed, otherwise use as is
        const colorValue = activeAccentColor.color.startsWith('rgb') 
            ? activeAccentColor.color 
            : (activeAccentColor.color.startsWith('#') || /^[0-9A-Fa-f]{6}$/.test(activeAccentColor.color))
            ? hexToRgb(activeAccentColor.color) 
            : activeAccentColor.color

        sceneRef.current.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh && child.material) {
                // Handle both single material and array of materials
                const materials = Array.isArray(child.material) ? child.material : [child.material]
                
                materials.forEach((material) => {
                    if ((material instanceof THREE.MeshStandardMaterial || 
                        material instanceof THREE.MeshBasicMaterial ||
                        material instanceof THREE.MeshPhongMaterial ||
                        material instanceof THREE.MeshLambertMaterial) &&
                        material.name === 'accent') {
                        
                        // Check if the current material color is different from the active color
                        const currentMaterialColor = colorToRgb(material.color)
                        if (currentMaterialColor !== colorValue) {
                            // If this is the material color, use the original THREE.Color object for exact precision
                            if (colorValue === originalAccentColorRef.current && originalAccentColorObjectRef.current) {
                                material.color.copy(originalAccentColorObjectRef.current)
                            } else {
                                // Set the new color for accent materials
                                material.color.set(colorValue)
                            }
                            material.needsUpdate = true
                        }
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