import { useGLTF } from "@react-three/drei"
import { useTexture } from "@react-three/drei"
import { useWindowWidth } from "@react-hook/window-size"
import { useRef } from "react"
import { Group } from "three"

interface PackageModelProps {
    packageType: 'large' | 'medium' | 'small'
}

export const PackageModel = ({ packageType }: PackageModelProps) => {

    // const isLarge = packageType === 'large'
    // const isMedium = packageType === 'medium'
    // const isSmall = packageType === 'small'

    // const modelToUse = isLarge ? 'orange' : isMedium ? 'green' : 'small'

    const { scene } = useGLTF(`/models/packages/${packageType}.glb`) //packageType
    const groupRef = useRef<Group>(null)

    const width = useWindowWidth()


    return (
        <group ref={groupRef} position={width <= 768 ? [0, -3, 0] : [0, 0, 0]}>
            <primitive object={scene} />
        </group>
    )
}