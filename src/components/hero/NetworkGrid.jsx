import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useHeroScene } from './hero-scene-context'

const CONNECTION_DIST = 1.1
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST
const MOUSE_RADIUS = 1.2
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS
const MOUSE_PUSH = 0.2
const DRIFT_AMP = 0.22

const LIGHT_LINE = new THREE.Color('#2c5ef5').multiplyScalar(0.05)
const DARK_LINE = new THREE.Color('#4a73ff').multiplyScalar(0.08)
const LIGHT_POINT = new THREE.Color('#94a3b8').multiplyScalar(0.35)
const DARK_POINT = new THREE.Color('#94a3b8').multiplyScalar(0.25)
const PRIMARY = new THREE.Color('#2c5ef5').multiplyScalar(0.35)

export function NetworkGrid({ count = 100 }) {
  const pointsRef = useRef(null)
  const linesRef = useRef(null)
  const { worldPointerRef, reducedMotion, isDark } = useHeroScene()

  const { basePositions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const particlePhases = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Giới hạn lưới vùng phải — tránh chồng lên chữ bên trái
      positions[i * 3] = 1.8 + Math.random() * 5.5
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3

      particlePhases[i * 3] = Math.random() * Math.PI * 2
      particlePhases[i * 3 + 1] = Math.random() * Math.PI * 2
      particlePhases[i * 3 + 2] = Math.random() * Math.PI * 2
    }
    return { basePositions: positions, phases: particlePhases }
  }, [count])

  const displayPositions = useMemo(
    () => new Float32Array(basePositions),
    [basePositions],
  )

  const pointColors = useMemo(() => new Float32Array(count * 3), [count])
  const linePositions = useMemo(
    () => new Float32Array(count * count * 6),
    [count],
  )
  const lineColors = useMemo(
    () => new Float32Array(count * count * 6),
    [count],
  )

  const basePointColor = useMemo(() => new THREE.Color(), [])
  const lineColor = useMemo(() => new THREE.Color(), [])
  const highlightColor = useMemo(() => new THREE.Color(), [])
  const pointColor = useMemo(() => new THREE.Color(), [])
  const activeLineColor = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    const pointsMesh = pointsRef.current
    const linesMesh = linesRef.current
    if (!pointsMesh || !linesMesh) return

    const time = state.clock.elapsedTime
    const mouseX = worldPointerRef.current.x
    const mouseY = worldPointerRef.current.y
    basePointColor.copy(isDark ? DARK_POINT : LIGHT_POINT)
    lineColor.copy(isDark ? DARK_LINE : LIGHT_LINE)
    highlightColor.copy(PRIMARY)

    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3]
      const by = basePositions[i * 3 + 1]
      const bz = basePositions[i * 3 + 2]

      let x = bx
      let y = by
      let z = bz

      if (!reducedMotion) {
        const px = phases[i * 3]
        const py = phases[i * 3 + 1]
        const pz = phases[i * 3 + 2]
        x += Math.sin(time * 0.45 + px) * DRIFT_AMP
        y += Math.cos(time * 0.38 + py) * DRIFT_AMP
        z += Math.sin(time * 0.32 + pz) * DRIFT_AMP * 0.4
      }

      const dx = x - mouseX
      const dy = y - mouseY
      const distSq = dx * dx + dy * dy

      let pointBrightness = 1
      if (distSq < MOUSE_RADIUS_SQ) {
        const dist = Math.sqrt(distSq)
        const influence = 1 - dist / MOUSE_RADIUS
        pointBrightness = 1 + influence * 0.6
        if (!reducedMotion) {
          const push = (MOUSE_PUSH * influence) / (dist || 0.001)
          x += dx * push
          y += dy * push
        }
      }

      displayPositions[i * 3] = x
      displayPositions[i * 3 + 1] = y
      displayPositions[i * 3 + 2] = z

      pointColor.copy(basePointColor).lerp(highlightColor, Math.min(1, (pointBrightness - 1) * 0.8))
      pointColors[i * 3] = pointColor.r * pointBrightness
      pointColors[i * 3 + 1] = pointColor.g * pointBrightness
      pointColors[i * 3 + 2] = pointColor.b * pointBrightness
    }

    let lineVertex = 0
    let lineColorVertex = 0

    for (let i = 0; i < count; i++) {
      const ax = displayPositions[i * 3]
      const ay = displayPositions[i * 3 + 1]
      const az = displayPositions[i * 3 + 2]

      for (let j = i + 1; j < count; j++) {
        const bx = displayPositions[j * 3]
        const by = displayPositions[j * 3 + 1]
        const bz = displayPositions[j * 3 + 2]

        const dx = ax - bx
        const dy = ay - by
        const dz = az - bz
        const dSq = dx * dx + dy * dy + dz * dz

        if (dSq > CONNECTION_DIST_SQ) continue

        const midX = (ax + bx) * 0.5
        const midY = (ay + by) * 0.5
        const mdx = midX - mouseX
        const mdy = midY - mouseY
        const mouseDistSq = mdx * mdx + mdy * mdy
        const nearMouse = mouseDistSq < MOUSE_RADIUS_SQ
        const lc = nearMouse
          ? activeLineColor.copy(highlightColor).multiplyScalar(isDark ? 0.35 : 0.28)
          : lineColor

        linePositions[lineVertex++] = ax
        linePositions[lineVertex++] = ay
        linePositions[lineVertex++] = az
        linePositions[lineVertex++] = bx
        linePositions[lineVertex++] = by
        linePositions[lineVertex++] = bz

        lineColors[lineColorVertex++] = lc.r
        lineColors[lineColorVertex++] = lc.g
        lineColors[lineColorVertex++] = lc.b
        lineColors[lineColorVertex++] = lc.r
        lineColors[lineColorVertex++] = lc.g
        lineColors[lineColorVertex++] = lc.b
      }
    }

    const pointGeo = pointsMesh.geometry
    pointGeo.attributes.position.needsUpdate = true
    pointGeo.attributes.color.needsUpdate = true
    pointGeo.setDrawRange(0, count)

    const lineGeo = linesMesh.geometry
    lineGeo.attributes.position.needsUpdate = true
    lineGeo.attributes.color.needsUpdate = true
    lineGeo.setDrawRange(0, lineVertex / 3)
  })

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(displayPositions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(pointColors, 3))
    return geo
  }, [displayPositions, pointColors])

  const linesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
    return geo
  }, [linePositions, lineColors])

  return (
    <group position={[0.5, 0, -2]}>
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.3} depthWrite={false} />
      </lineSegments>
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.4}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}
