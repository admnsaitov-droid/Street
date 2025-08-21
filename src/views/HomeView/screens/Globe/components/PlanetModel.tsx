"use client"

import { Plane, useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Group } from "three"
import { useRef, useMemo, useEffect } from "react"
import * as THREE from 'three'

const rotationXSpeed = 0.003
const rotationZSpeed = 0.003

export const PlanetModel = () => {
    const { scene } = useGLTF('/models/solar.glb')
    const groupRef = useRef<Group>(null)

    // Create atmospheric material
    const atmosphereMaterial = useMemo(() => {
        const material = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.FrontSide,
            blending: THREE.NormalBlending,
            depthWrite: false,
            uniforms: {
                innerColor: { value: new THREE.Color('#7E7DEA') }, // Dodger Blue
                outerColor: { value: new THREE.Color('#7E7DEA') }, // Slate Blue
                atmosphereIntensity: { value: 0.5 }
            },
            vertexShader: `
                varying vec3 vViewPosition;
                varying vec3 vNormal;
                varying vec3 vWorldPosition;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 innerColor;
                uniform vec3 outerColor;
                uniform float atmosphereIntensity;
                varying vec3 vViewPosition;
                varying vec3 vNormal;
                varying vec3 vWorldPosition;
                
                void main() {
                    vec3 normalizedNormal = normalize(vNormal);
                    vec3 viewDir = normalize(vViewPosition);
                    
                    // Calculate fresnel for rim lighting
                    float fresnel = 1.0 - max(dot(viewDir, normalizedNormal), 0.0);
                    
                    // Create gradient from center to edge
                    float distanceFromCenter = length(vWorldPosition);
                    float normalizedDistance = (distanceFromCenter - 5.0) / 0.4; // Planet scale is 5, atmosphere extends 0.4 units
                    
                    // Create smooth gradient that fades from inner edge to outer edge
                    float gradient = 1.0 - smoothstep(0.0, 1.0, normalizedDistance);
                    
                    // Make front/central areas invisible by using stronger fresnel
                    float centerFade = pow(fresnel, 3.0);
                    
                    // Color gradient from blue (inner) to purple (outer)
                    vec3 atmosphereColor = mix(innerColor, outerColor, normalizedDistance);
                    
                    // Combine all effects: fresnel for edge visibility, gradient for distance, centerFade for front invisibility
                    float atmosphereEffect = centerFade * gradient * atmosphereIntensity;
                    
                    gl_FragColor = vec4(atmosphereColor, atmosphereEffect);
                }
            `
        });
        return material;
    }, [])

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.x += rotationXSpeed
            groupRef.current.rotation.z += rotationZSpeed
        }
    })

    return (
        <group ref={groupRef} position={[4, 0, -1]}>
            <primitive object={scene} scale={5}/>
            {/* Atmospheric sphere - creates gradient from planet edge outward */}
            <mesh scale={5.4}>
                <sphereGeometry args={[1, 64, 64]} />
                <primitive object={atmosphereMaterial} />
            </mesh>
        </group>
    )
}