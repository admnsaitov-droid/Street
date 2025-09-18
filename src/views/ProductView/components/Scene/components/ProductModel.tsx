import { useGLTF } from "@react-three/drei"
import { useColorStore } from "@/store/store"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"

interface ProductModelProps {
    model: any
    colors: {
        name: string
        color: string
    }[]
    params: {
        position: [number, number, number]
        rotation: [number, number, number]
        scale: number
    }
}

export const ProductModel = ({ model, colors, params = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1
} }: ProductModelProps) => {
    const { scene }: any = useGLTF(getMediaStrapiPath(model))
    const { activeColor, setActiveColor } = useColorStore()
    const sceneRef = useRef<THREE.Group>()

    // Set the first color when component mounts
    useEffect(() => {
        if (colors && colors.length > 0 && !activeColor) {
            setActiveColor(colors[0])
        }
    }, [colors, activeColor, setActiveColor])

    // Apply color only to materials with name "blue_metal"
    useEffect(() => {
        if (!sceneRef.current || !activeColor?.color) return

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
                        
                        // Set the new color only for blue_metal materials
                        material.color.set(activeColor.color)
                        material.needsUpdate = true
                    }
                })
            }
        })
    }, [activeColor?.color])

    return (
        <primitive 
            ref={sceneRef}
            object={scene} 
            position={params.position} 
            rotation={params.rotation} 
            scale={params.scale} 
        />
    )
}