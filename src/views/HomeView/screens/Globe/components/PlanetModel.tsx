"use client"

import { useGLTF } from "@react-three/drei"
import { DRACO_DECODER_PATH } from "@/utils/dracoDecoder"
import { useFrame } from "@react-three/fiber"
import { Group } from "three"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import * as THREE from 'three'
import { sNoise } from "@/utils/sNoise"
import { useWindowWidth } from "@react-hook/window-size"
import { GLTF, GLTFLoader } from 'three-stdlib'
import { useThree } from "@react-three/fiber"
import useAnimationStore from "@/animationStore/animationStore"
import { warmupMaterial } from "@/utils/warmupScene"
import { getDeviceTier } from "@/utils/deviceTier"

type GLTFResult = GLTF & {
    nodes: {
        Icosphere001: THREE.Mesh
    }
    materials: {
      ['Material.002']: THREE.MeshStandardMaterial
    }
}

interface PlanetModelProps {
    scale: number
}

export const PlanetModel = ({ scale }: PlanetModelProps) => {
    const groupRef = useRef<Group>(null)
    const time = useRef({value: 0})
    const windowWidth = useWindowWidth()

    // Night blend texture
    const { materials: { 'Material.002': nightBlendMaterials } } = useGLTF('/models/earth_lights.glb', DRACO_DECODER_PATH) as GLTFResult
    const nightBlendTexture = useMemo(() => nightBlendMaterials.map, [nightBlendMaterials]) as THREE.Texture

    const { nodes, materials } = useGLTF('/models/low_res_earth.glb', DRACO_DECODER_PATH) as GLTFResult
    const meshRef = useRef<THREE.Mesh>(null)
    const [highResMaterial, setHighResMaterial] = useState<THREE.MeshStandardMaterial | null>(null)
    const highResSettleRef = useRef<(() => void) | null>(null)
    const { gl, scene, camera } = useThree()
    const beginWarmup = useAnimationStore(state => state.beginWarmup)
    const endWarmup = useAnimationStore(state => state.endWarmup)
    // Read once at construction — `useWindowWidth` starts at 0 on the first
    // render, which would let the scene report ready before this even mounts.
    const isDesktopTier = useMemo(() => getDeviceTier() !== 'mobile', [])
    
    // The high-res earth is 11MB — almost all of it textures — and its material
    // replaces the low-res one. Registering a warmup keeps the loader curtain up
    // until the swap is done, so the decode and upload happen behind the curtain
    // instead of blocking the main thread for ~2.4s on the first scroll.
    useEffect(() => {
        if (!materials['Material.002'] || !isDesktopTier) return

        let settled = false
        beginWarmup('home')
        const finish = () => {
            if (settled) return
            settled = true
            endWarmup('home')
        }

        const loader = new GLTFLoader()
        loader.load(
            '/models/high_res_earth.glb',
            (gltf) => {
                const highResModel = gltf as GLTFResult
                const material = (highResModel.scene.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial
                if (material) setHighResMaterial(material)
                else finish()
            },
            undefined,
            () => finish(),
        )

        // The swap effect below releases the warmup once the material is live;
        // this cleanup covers unmount before that happens.
        highResSettleRef.current = finish
        return finish
    }, [materials, isDesktopTier, beginWarmup, endWarmup])

    // Replace low res material with high res material on the desktop tier only.
    // The material is compiled and its maps uploaded *before* it goes on the
    // mesh — assigning a cold material recompiles the program inside whatever
    // frame is running, which reads as a stall mid-scroll.
    useEffect(() => {
        if (!highResMaterial || !isDesktopTier) return
        const mesh = meshRef.current
        if (!mesh) return

        const material = appllyShaders(highResMaterial, nightBlendTexture)
        if (!material) return

        let cancelled = false
        warmupMaterial(gl, scene, camera, material, mesh.geometry).then(() => {
            if (!cancelled) mesh.material = material
            highResSettleRef.current?.()
        })

        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- appllyShaders is declared below this effect
    }, [highResMaterial, nightBlendTexture, isDesktopTier, gl, scene, camera])

    // Apply planet shader to model materials
    useEffect(() => {
        const material = appllyShaders(materials['Material.002'], nightBlendTexture)
        if (!material) return
        meshRef.current && ((meshRef.current as THREE.Mesh).material = material);
    }, [materials, nightBlendTexture])

    const appllyShaders = useCallback((material: THREE.MeshStandardMaterial, nightBlendTexture: THREE.Texture) => {
        if (!material) return
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
            shader.uniforms.nightBlendTexture = { value: nightBlendTexture };

            // Add only the varying variables that don't already exist
            shader.vertexShader = `
                varying vec3 vPosition;
                varying vec2 vCustomUv;
                varying vec3 vWorldPosition;
            ` + shader.vertexShader;

            shader.vertexShader = shader.vertexShader.replace(
                'void main() {',
                `void main() {
                    vPosition = position;
                    vCustomUv = uv;
                    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
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
                varying vec3 vWorldPosition;
                uniform sampler2D nightBlendTexture;

                vec3 blendTexture(vec3 color) {
                    return texture2D(nightBlendTexture, vCustomUv).rgb * color;
                }

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

                // Night blend texture
                vec3 blendedColor = blendTexture(gl_FragColor.rgb) * 4.0;
                
                // Use vViewPosition for darkening effect based on view angle
                float nightAppearFactor = smoothstep(.0, -2.0, vViewPosition.x - vViewPosition.y);
                float lightsAppearFactor = smoothstep(1.0, -4.0, vViewPosition.x - vViewPosition.y);

                
                // Smoothly darken the color and increase blend texture influence based on view angle
                gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * 0.1, nightAppearFactor);

                // Apply nightDisappearFactor only to the blended night texture
                blendedColor *= lightsAppearFactor;
                gl_FragColor.rgb += blendedColor;
                `
            );
        }
        material.needsUpdate = true;
        return material;
    }, [])

    useFrame((state, delta) => {
        // Animate the time uniform for the planet shader
        time.current.value += delta / 12
    })

    return (
        <group ref={groupRef}>
            <group dispose={null} scale={scale}>
                <mesh ref={meshRef} name="Sphere" geometry={nodes.Icosphere001.geometry} scale={9.765}/>
            </group>
        </group>
    )
}