import { Plane, useGLTF, useTexture } from "@react-three/drei"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from 'three'

interface AtmosphereProps {
    scale: number
    position: [number, number, number]
}

export const Atmosphere = ({ scale, position }: AtmosphereProps) => {
    const timeRef = useRef({ value: 0 })
    
    const atmosphereMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
        depthWrite: false,
            uniforms: {
                centerColor: { value: new THREE.Color('white') }, // Blue at center
                edgeColor: { value: new THREE.Color('#81BDDB') }, // Purple at edges
                atmosphereIntensity: { value: 1.0 },
                bloomIntensity: { value: .3 },
                bloomRadius: { value: 0.0001 },
                time: timeRef.current,
                pulseSpeed: { value: 2.0 },
                pulseIntensity: { value: 0.05 }
            },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            
            void main() {
                vUv = uv;
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 centerColor;
            uniform vec3 edgeColor;
            uniform float atmosphereIntensity;
            uniform float bloomIntensity;
            uniform float bloomRadius;
            uniform float time;
            uniform float pulseSpeed;
            uniform float pulseIntensity;
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            
            void main() {
                // Calculate distance from center of circle (0.5, 0.5 is center in UV space)
                vec2 center = vec2(0.5, 0.5);
                float distanceFromCenter = distance(vUv, center);
                
                // Create radial gradient from center to edge
                float radialGradient = distanceFromCenter * 2.0; // Scale to 0-1 range
                
                // Add subtle pulsing animation
                float pulse = sin(time * pulseSpeed) * pulseIntensity + 1.0;
                
                // Create smooth falloff from center to edge
                float gradient = 1.0 - smoothstep(0.0, 1.0, radialGradient);
                
                // Create bloom/glow effect with multiple layers, modulated by pulse
                float bloom1 = pow(gradient, 1.0) * pulse; // Main atmospheric layer
                float bloom2 = pow(gradient, 0.5) * 0.7 * pulse; // Extended glow
                float bloom3 = pow(gradient, 0.3) * 0.4 * pulse; // Outer diffuse glow
                
                // Combine bloom layers for luminous effect
                float totalBloom = (bloom1 + bloom2 + bloom3) * bloomIntensity;
                
                // Color gradient from center to edge
                vec3 atmosphereColor = mix(centerColor, edgeColor, radialGradient);
                
                // Apply bloom to color for bright, glowing effect
                vec3 bloomColor = atmosphereColor * (1.0 + totalBloom * 0.5);
                
                // Create circular mask with soft edges
                float circleMask = 1.0 - smoothstep(0.4, 0.5, distanceFromCenter);
                
                // Final alpha combines gradient, bloom and circular mask, with pulse effect
                float finalAlpha = (gradient + totalBloom * bloomRadius) * atmosphereIntensity * circleMask * pulse;
                
                gl_FragColor = vec4(bloomColor, finalAlpha);
            }
        `
    });
    return material;
}, [])

    useFrame((state, delta) => {
        timeRef.current.value += delta
    })

    return (
        <mesh scale={scale} position={position}>
            <circleGeometry args={[1, 64]} />
            <primitive object={atmosphereMaterial} />
        </mesh>
    )
}