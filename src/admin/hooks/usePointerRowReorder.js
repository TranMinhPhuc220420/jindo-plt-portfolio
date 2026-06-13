import { useCallback, useEffect, useRef, useState } from 'react'

const MOVE_THRESHOLD = 4

/**
 * Pointer-based vertical row reordering without external DnD libraries.
 */
export function usePointerRowReorder({ items, getId, onReorder, disabled }) {
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)
  const [overlay, setOverlay] = useState(null)

  const rowRefs = useRef(new Map())
  const dragRef = useRef(null)
  const itemsRef = useRef(items)

  itemsRef.current = items

  const setRowRef = useCallback((id, node) => {
    if (node) rowRefs.current.set(id, node)
    else rowRefs.current.delete(id)
  }, [])

  const getDropTargetId = useCallback((clientY) => {
    for (const item of itemsRef.current) {
      const id = getId(item)
      const node = rowRefs.current.get(id)
      if (!node) continue

      const rect = node.getBoundingClientRect()
      const midpoint = rect.top + rect.height / 2
      if (clientY < midpoint) return id
    }

    const last = itemsRef.current[itemsRef.current.length - 1]
    return last ? getId(last) : null
  }, [getId])

  const clearDrag = useCallback(() => {
    dragRef.current = null
    setDragId(null)
    setOverId(null)
    setOverlay(null)
  }, [])

  const finishDrag = useCallback(
    (clientY) => {
      const state = dragRef.current
      clearDrag()

      if (!state?.active || disabled) return

      const targetId = getDropTargetId(clientY)
      if (!targetId || targetId === state.id) return

      const currentItems = itemsRef.current
      const oldIndex = currentItems.findIndex((item) => getId(item) === state.id)
      const newIndex = currentItems.findIndex((item) => getId(item) === targetId)
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

      const next = [...currentItems]
      const [moved] = next.splice(oldIndex, 1)
      next.splice(newIndex, 0, moved)
      onReorder(next)
    },
    [clearDrag, disabled, getDropTargetId, getId, onReorder],
  )

  const startDrag = useCallback(
    (id, event) => {
      if (disabled) return

      const node = rowRefs.current.get(id)
      if (!node) return

      const rect = node.getBoundingClientRect()
      dragRef.current = {
        id,
        pointerId: event.pointerId,
        offsetY: event.clientY - rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        startX: event.clientX,
        startY: event.clientY,
        active: false,
      }

      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [disabled],
  )

  useEffect(() => {
    function onPointerMove(event) {
      const state = dragRef.current
      if (!state || event.pointerId !== state.pointerId) return

      if (!state.active) {
        const dx = event.clientX - state.startX
        const dy = event.clientY - state.startY
        if (Math.hypot(dx, dy) < MOVE_THRESHOLD) return
        state.active = true
        setDragId(state.id)
        document.body.style.cursor = 'grabbing'
        document.body.style.userSelect = 'none'
      }

      event.preventDefault()

      setOverlay({
        id: state.id,
        x: state.left,
        y: event.clientY - state.offsetY,
        width: state.width,
        height: state.height,
      })

      setOverId(getDropTargetId(event.clientY))
    }

    function onPointerUp(event) {
      const state = dragRef.current
      if (!state || event.pointerId !== state.pointerId) return

      document.body.style.cursor = ''
      document.body.style.userSelect = ''

      if (state.active) {
        finishDrag(event.clientY)
      } else {
        clearDrag()
      }
    }

    function onPointerCancel(event) {
      const state = dragRef.current
      if (!state || event.pointerId !== state.pointerId) return

      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      clearDrag()
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('pointercancel', onPointerCancel)

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('pointercancel', onPointerCancel)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [clearDrag, finishDrag, getDropTargetId])

  return {
    setRowRef,
    dragId,
    overId,
    overlay,
    startDrag,
    isDragging: dragId != null,
  }
}
