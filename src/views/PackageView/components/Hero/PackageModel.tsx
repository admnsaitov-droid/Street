import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
import { Group } from "three"

export const PackageModel = () => {

    const { scene } = useGLTF('/models/mashine.glb')
    const groupRef = useRef<Group>(null)

    return (
        <group ref={groupRef} scale={0.1} position={[-20, 0, 0]}>
            <primitive object={scene} />
        </group>
    )
}