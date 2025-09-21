import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StarsProps {
  count?: number
  radius?: number
}

export const Stars = ({ count = 5000, radius = 100 }: StarsProps) => {
  const mesh = useRef<THREE.Points>(null)
  
  // Generate random star positions
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Generate random positions on a sphere
      const r = radius + Math.random() * radius * 0.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      
      // Random star colors (white to slightly blue/yellow)
      const brightness = 0.5 + Math.random() * 0.5
      colors[i * 3] = brightness // R
      colors[i * 3 + 1] = brightness // G
      colors[i * 3 + 2] = brightness + Math.random() * 0.2 // B (slightly more blue)
    }
    
    return [positions, colors]
  }, [count, radius])
  
  // Slow rotation for subtle movement
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.0001
      mesh.current.rotation.y += delta * 0.0002
    }
  })
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  )
}
