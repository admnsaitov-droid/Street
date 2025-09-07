"use client"

import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Group } from "three"
import { useEffect, useRef } from "react"
import * as THREE from 'three'
import { sNoise } from "@/utils/sNoise"


interface PlanetModelProps {
    scale: number
}

export const PlanetModel = ({ scale }: PlanetModelProps) => {
    const { scene } = useGLTF('/models/earth.glb')
    const groupRef = useRef<Group>(null)
    const time = useRef({value: 0})

    // Apply planet shader to model materials
    useEffect(() => {
        if (!scene) return

        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material]
                
                materials.forEach((material) => {
                    if (material instanceof THREE.MeshStandardMaterial || 
                        material instanceof THREE.MeshBasicMaterial ||
                        material instanceof THREE.MeshPhongMaterial ||
                        material instanceof THREE.MeshLambertMaterial) {
                        
                        // Apply the same shader as in your Planet component
                        material.onBeforeCompile = (shader) => {
                            shader.uniforms.time = time.current;
                            shader.uniforms.targetColor = { value: new THREE.Color('#080620') };
                            shader.uniforms.noiseScale = { value: 800.0 };  
                            shader.uniforms.colorVariation = { value: .5 };
                            shader.uniforms.speedX = { value: 2.0 };
                            shader.uniforms.speedY = { value: 3.0 };
                            shader.uniforms.speedZ = { value: 5.0 };
                            shader.uniforms.mixStrength = { value: 0.3 }; 
                            shader.uniforms.colorThreshold = { value: 0.15 }; 
                            shader.uniforms.baseTexture = { value: null };
                            shader.uniforms.rimColor = { value: new THREE.Color('#81BDDB') };
                            shader.uniforms.rimPower = { value: 1.8 };

                            // Add custom uniforms and noise function to fragment shader
                            shader.fragmentShader = `
                                uniform float time;
                                uniform vec3 targetColor;
                                uniform float noiseScale;
                                uniform float colorVariation;
                                uniform float speedX;
                                uniform float speedY;
                                uniform float speedZ;
                                uniform float mixStrength;
                                uniform float colorThreshold;
                                uniform vec3 rimColor;
                                uniform float rimPower;

                                ${sNoise}
                            ` + shader.fragmentShader;

                            shader.fragmentShader = shader.fragmentShader.replace(
                                `#include <dithering_fragment>`,
                                `#include <dithering_fragment>
                                
                                vec3 normalizedNormal = normalize(vNormal);
                                vec3 viewDir = normalize(vViewPosition);
                                float rim = 1.0 - max(dot(viewDir, normalizedNormal), 0.0);
                                rim = pow(rim, rimPower);
                                rim = pow(rim, 1.5);
                                rim *= 0.7;

                                vec3 finalColor = mix(gl_FragColor.rgb, rimColor, rim);
                                gl_FragColor = vec4(finalColor, 1.0);
                                `
                            );
                        }
                        material.needsUpdate = true;
                    }
                })
            }
        })
    }, [scene])

    // useFrame((state, delta) => {
    //     // Animate the time uniform for the planet shader
    //     time.current.value += delta / 12
    // })

    return (
        <group ref={groupRef}>
            <primitive object={scene} scale={scale}/>
        </group>
    )
}