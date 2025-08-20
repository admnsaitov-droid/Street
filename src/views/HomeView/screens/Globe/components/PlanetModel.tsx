"use client"

import { Plane, useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Group } from "three"
import { useRef } from "react"

const rotationXSpeed = 0.003
const rotationZSpeed = 0.003

export const PlanetModel = () => {
    const { scene } = useGLTF('/models/solar.glb')

    const groupRef = useRef<Group>(null)

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.x += rotationXSpeed
            groupRef.current.rotation.z += rotationZSpeed
        }
    })

    return (
        <group ref={groupRef} position={[4, 0, -1]}>
            <primitive object={scene} scale={5}/>
        </group>
    )
}