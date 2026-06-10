import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useHeroScene } from './hero-scene-context'

export function PointerTracker() {
  const { camera } = useThree()
  const { pointerRef, worldPointerRef } = useHeroScene()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])

  useFrame(() => {
    ndc.set(pointerRef.current.x, pointerRef.current.y)
    raycaster.setFromCamera(ndc, camera)
    if (raycaster.ray.intersectPlane(plane, target)) {
      worldPointerRef.current.x = target.x
      worldPointerRef.current.y = target.y
    }
  })

  return null
}
