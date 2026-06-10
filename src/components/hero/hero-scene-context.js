import { createContext, useContext } from 'react'

export const HeroSceneContext = createContext({
  pointerRef: { current: { x: 0, y: 0 } },
  worldPointerRef: { current: { x: 0, y: 0 } },
  reducedMotion: false,
  isDark: false,
})

export function useHeroScene() {
  return useContext(HeroSceneContext)
}
