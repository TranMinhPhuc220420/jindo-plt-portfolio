import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useHeroScene } from './hero-scene-context'

export function AbstractHeroModel() {
  const groupRef = useRef(null)
  const orbitRef = useRef(null)
  const ringRef = useRef(null)
  const { pointerRef, reducedMotion } = useHeroScene()

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const targetY = reducedMotion ? 0 : pointerRef.current.x * 0.3
    const targetX = reducedMotion ? 0 : pointerRef.current.y * 0.2
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.06,
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.06,
    )

    if (!reducedMotion && orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.45
      orbitRef.current.rotation.x += delta * 0.15
    }

    if (!reducedMotion && ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25
      ringRef.current.rotation.x += delta * 0.1
    }
  })

  return (
    <group position={[2.2, 0, 0]}>
      <Float
        speed={reducedMotion ? 0 : 1.5}
        rotationIntensity={reducedMotion ? 0 : 0.15}
        floatIntensity={reducedMotion ? 0 : 0.6}
      >
        <group ref={groupRef}>
          <mesh>
            <torusKnotGeometry args={[0.8, 0.22, 160, 32]} />
            <MeshDistortMaterial
              color="#2c5ef5"
              roughness={0.15}
              metalness={0.85}
              distort={reducedMotion ? 0 : 0.25}
              speed={reducedMotion ? 0 : 1.5}
              transparent
              opacity={0.92}
            />
          </mesh>

          <group ref={orbitRef} position={[0, 0, 0]}>
            <mesh position={[1.35, 0.4, 0.3]}>
              <icosahedronGeometry args={[0.22, 1]} />
              <meshStandardMaterial
                color="#4a73ff"
                emissive="#2c5ef5"
                emissiveIntensity={0.35}
                roughness={0.3}
                metalness={0.7}
                wireframe
              />
            </mesh>
            <mesh position={[-1.1, -0.55, -0.2]}>
              <icosahedronGeometry args={[0.14, 0]} />
              <meshStandardMaterial
                color="#f1f3f5"
                emissive="#2c5ef5"
                emissiveIntensity={0.2}
                roughness={0.2}
                metalness={0.9}
              />
            </mesh>
          </group>

          <group ref={ringRef}>
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
              <torusGeometry args={[1.45, 0.012, 8, 80]} />
              <meshBasicMaterial color="#2c5ef5" transparent opacity={0.35} wireframe />
            </mesh>
            <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
              <ringGeometry args={[1.15, 1.18, 64]} />
              <meshBasicMaterial color="#4a73ff" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </Float>
    </group>
  )
}
