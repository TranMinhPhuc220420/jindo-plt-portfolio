import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTheme } from '../../hooks/useTheme'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { HeroSceneContext } from './hero-scene-context'
import { PointerTracker } from './PointerTracker'
import { NetworkGrid } from './NetworkGrid'
import { AbstractHeroModel } from './AbstractHeroModel'
import { HeroVisual } from './HeroVisual'

function HeroScene({ particleCount }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[6, 4, 4]} intensity={1.1} color="#2c5ef5" />
      <pointLight position={[-4, -2, 3]} intensity={0.45} color="#4a73ff" />
      <directionalLight position={[0, 5, 2]} intensity={0.35} />
      <PointerTracker />
      {/* <NetworkGrid count={particleCount} /> */}
      <AbstractHeroModel />
    </>
  )
}

export function HeroCanvas({ pointerRef }) {
  const { isDark } = useTheme()
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const particleCount = isMobile ? 50 : 100
  const worldPointerRef = useRef({ x: 0, y: 0 })
  const [webglFailed, setWebglFailed] = useState(false)

  const contextValue = useMemo(
    () => ({
      pointerRef,
      worldPointerRef,
      reducedMotion,
      isDark,
    }),
    [pointerRef, reducedMotion, isDark],
  )

  if (webglFailed) {
    return (
      <div className="flex h-full items-center justify-center">
        <HeroVisual />
      </div>
    )
  }

  return (
    <HeroSceneContext.Provider value={contextValue}>
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
        onError={() => setWebglFailed(true)}
      >
        <Suspense fallback={null}>
          <HeroScene particleCount={particleCount} />
        </Suspense>
      </Canvas>
    </HeroSceneContext.Provider>
  )
}
