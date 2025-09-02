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
    const { scene } = useGLTF('/models/solar.glb')
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

                            shader.vertexShader = `
                                varying vec2 vUv;
                                varying vec3 vViewPosition;
                                varying vec3 vNormal;
                                varying vec3 vPosition;
                            ` + shader.vertexShader;

                            shader.vertexShader = shader.vertexShader.replace(
                                'void main() {',
                                `void main() {
                                    vUv = uv;
                                    vNormal = normalize(normalMatrix * normal);
                                    vPosition = position;
                                `
                            );

                            shader.vertexShader = shader.vertexShader.replace(
                                `#include <project_vertex>`,
                                `#include <project_vertex>
                                vViewPosition = -mvPosition.xyz;`
                            );

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
                                varying vec2 vUv;
                                uniform vec3 rimColor;
                                uniform float rimPower;
                                varying vec3 vViewPosition;
                                varying vec3 vPosition;

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

                                vec3 currentColor = gl_FragColor.rgb;
                                float threshold = 0.03;
                                
                                // if (currentColor.r < 0.05 && currentColor.g < 0.1 && currentColor.b > 0.000001 && vPosition.x > 0.44 && vPosition.z < -0.3) {
                                    
                                //     float noise = snoise(vec3(
                                //         vUv.x * noiseScale + time * speedX, 
                                //         vUv.y * noiseScale - time * speedY, 
                                //         time * speedZ
                                //     ));
                                    
                                //     vec3 blueBase = vec3(0.0, 0.5, 1.0);
                                //     vec3 cyanBase = vec3(0.0, 1.0, 1.0);
                                //     vec3 colorVar = mix(blueBase, cyanBase, noise * colorVariation);
                                    
                                //     gl_FragColor.rgb += noise / 23.0;
                                //     gl_FragColor.b += 0.07;
                                //     gl_FragColor.g += 0.05;
                                //     gl_FragColor.rgb -= 0.02;
                                // }

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