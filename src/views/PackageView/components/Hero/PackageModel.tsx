import { useGLTF } from "@react-three/drei"
import { useTexture } from "@react-three/drei"
import { useRef } from "react"
import { Group } from "three"

export const PackageModel = () => {

    const { scene } = useGLTF('/models/package.glb')
    const groupRef = useRef<Group>(null)


    return (
        <group ref={groupRef}>
            <primitive object={scene} />
        </group>
    )
}