import { useGLTF } from "@react-three/drei"
import { useTexture } from "@react-three/drei"
import { useWindowWidth } from "@react-hook/window-size"
import { useRef } from "react"
import { Group } from "three"

export const PackageModel = () => {

    const { scene } = useGLTF('/models/package.glb')
    const groupRef = useRef<Group>(null)

    const width = useWindowWidth()


    return (
        <group ref={groupRef} position={width <= 768 ? [0, -3, 0] : [0, 0, 0]}>
            <primitive object={scene} />
        </group>
    )
}