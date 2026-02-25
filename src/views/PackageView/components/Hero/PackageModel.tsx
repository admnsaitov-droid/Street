import { useGLTF } from "@react-three/drei"
import { useWindowWidth } from "@react-hook/window-size"
import { useEffect, useRef } from "react"
import { Group } from "three"
import * as THREE from "three"
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath"

interface PackageModelProps {
    packageType: 'large' | 'medium' | 'small',
    modelPath: string
}

const LOGO_MATERIAL_NAME = "logo.001"

export const PackageModel = ({ packageType, modelPath }: PackageModelProps) => {
    const { scene } = useGLTF(getMediaStrapiPath(modelPath)) as any
    const groupRef = useRef<Group>(null)
    const width = useWindowWidth()

    // Make logo material unlit so it matches the viewer (no env/light reflection)
    useEffect(() => {
        scene.traverse((obj: any) => {
            if (!(obj as THREE.Mesh).isMesh) return
            const mesh = obj as THREE.Mesh
            const mat = mesh.material
            if (!mat) return

            const materials = Array.isArray(mat) ? mat : [mat]
            let changed = false
            const newMaterials = materials.map((m: any) => {
                if (m.name !== LOGO_MATERIAL_NAME) return m
                if (!(m instanceof THREE.MeshStandardMaterial)) return m

                const basic = new THREE.MeshBasicMaterial({
                    map: m.map,
                    transparent: m.transparent,
                    alphaTest: m.alphaTest,
                    alphaMap: m.alphaMap,
                    side: m.side,
                })
                changed = true
                return basic
            })

            if (changed) {
                mesh.material = Array.isArray(mat) ? newMaterials : newMaterials[0]
            }
        })
    }, [scene])

    return (
        <group ref={groupRef} position={width <= 768 ? [0, -3, 0] : [0, 0, 0]}>
            <primitive object={scene} />
        </group>
    )
}