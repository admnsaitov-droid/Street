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
                        
                        // Apply water animation shader from Globe component
                        material.onBeforeCompile = (shader) => {
                            shader.uniforms.time = time.current;
                            shader.uniforms.targetColor = { value: new THREE.Color('#080620') };
                            shader.uniforms.noiseScale = { value: 300.0 };  // Smaller, more detailed patterns
                            shader.uniforms.colorVariation = { value: 0.4 }; // Reduced variation
                            shader.uniforms.speedX = { value: 1.5 };        // Slower, more gentle
                            shader.uniforms.speedY = { value: 2.0 };        // Slower, more gentle
                            shader.uniforms.speedZ = { value: 2.5 };        // Slower, more gentle
                            shader.uniforms.mixStrength = { value: 0.3 }; 
                            shader.uniforms.colorThreshold = { value: 0.15 }; 
                            shader.uniforms.baseTexture = { value: null };
                            shader.uniforms.rimColor = { value: new THREE.Color('#C1FAFF') };
                            shader.uniforms.rimPower = { value: 4.0 };

                            // Add only the varying variables that don't already exist
                            shader.vertexShader = `
                                varying vec3 vPosition;
                                varying vec2 vCustomUv;
                            ` + shader.vertexShader;

                            shader.vertexShader = shader.vertexShader.replace(
                                'void main() {',
                                `void main() {
                                    vPosition = position;
                                    vCustomUv = uv;
                                `
                            );

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
                                varying vec3 vPosition;
                                varying vec2 vCustomUv;

                                ${sNoise}
                            ` + shader.fragmentShader;

                            shader.fragmentShader = shader.fragmentShader.replace(
                                `#include <dithering_fragment>`,
                                `#include <dithering_fragment>
                                
                                // Use existing Three.js variables for rim lighting
                                vec3 normalizedNormal = normalize(vNormal);
                                vec3 viewDir = normalize(vViewPosition);
                                float rim = 1.0 - max(dot(viewDir, normalizedNormal), 0.0);
                                rim = pow(rim, rimPower);
                                rim = pow(rim, 1.5);
                                rim *= 0.7;

                                vec3 currentColor = gl_FragColor.rgb;
                                
                                // Enhanced water detection - detect darker blue areas (oceans)
                                float brightness = (currentColor.r + currentColor.g + currentColor.b) / 3.0;
                                bool isWater = (currentColor.b > currentColor.r && currentColor.b > currentColor.g) || 
                                              (brightness < 0.3 && currentColor.b > 0.05);
                                
                                if (isWater) {
                                    
                                    float noise = snoise(vec3(
                                        vCustomUv.x * noiseScale + time * speedX, 
                                        vCustomUv.y * noiseScale - time * speedY, 
                                        time * speedZ
                                    ));
                                    
                                    // Create subtle animated water effect
                                    float waveIntensity = (noise + 1.0) * 0.5; // Normalize to 0-1
                                    
                                    // Subtle water enhancement - much more gentle
                                    vec3 waterTint = vec3(0.05, 0.1, 0.2); // Very subtle blue tint
                                    
                                    // Only slightly modify the original color
                                    gl_FragColor.rgb += waterTint * waveIntensity * 0.3;
                                    
                                    // Add very subtle shimmer
                                    gl_FragColor.rgb += vec3(noise * 0.02);
                                }

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

    useFrame((state, delta) => {
        // Animate the time uniform for the planet shader
        time.current.value += delta / 12
    })

    return (
        <group ref={groupRef}>
            <primitive object={scene} scale={scale}/>
        </group>
    )
}