import { useGLTF } from "@react-three/drei"
import { useColorStore } from "@/store/store"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"

interface ProductModelProps {
    model: string
    params: {
        position: [number, number, number]
        rotation: [number, number, number]
        scale: number
    }
}

export const ProductModel = ({ model, params = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1
} }: ProductModelProps) => {
    const { scene }: any = useGLTF(getMediaStrapiPath(model))
    const { activeColor } = useColorStore()
    const sceneRef = useRef<THREE.Group>()

    // Apply color to all materials in the model
    useEffect(() => {
        if (!sceneRef.current || !activeColor?.color) return

        sceneRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                // Handle both single material and array of materials
                const materials = Array.isArray(child.material) ? child.material : [child.material]
                
                materials.forEach((material) => {
                    if (material instanceof THREE.MeshStandardMaterial || 
                        material instanceof THREE.MeshBasicMaterial ||
                        material instanceof THREE.MeshPhongMaterial ||
                        material instanceof THREE.MeshLambertMaterial) {
                        
                        // Set the new color
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