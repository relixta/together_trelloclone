import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { useBoards } from './BoardContext.jsx'

const DnDContext = createContext(null)

export function DnDProvider({ boardId, children }) {
  const { dispatch } = useBoards()
  const dragRef = useRef(null)
  const [draggingId, setDraggingId] = useState(null)
  const [dropTarget, setDropTargetState] = useState(null)

  const start = useCallback((fromListId, cardId) => {
    dragRef.current = { fromListId, cardId }
    setDraggingId(cardId)
  }, [])

  const end = useCallback(() => {
    dragRef.current = null
    setDraggingId(null)
    setDropTargetState(null)
  }, [])

  const setDropTarget = useCallback((listId, index) => {
    setDropTargetState((prev) =>
      prev && prev.listId === listId && prev.index === index ? prev : { listId, index },
    )
  }, [])

  const commit = useCallback(() => {
    const drag = dragRef.current
    setDropTargetState((target) => {
      if (drag && target) {
        dispatch({
          type: 'MOVE_CARD',
          payload: {
            boardId,
            fromListId: drag.fromListId,
            toListId: target.listId,
            cardId: drag.cardId,
            toIndex: target.index,
          },
        })
      }
      return null
    })
    dragRef.current = null
    setDraggingId(null)
  }, [boardId, dispatch])

  return (
    <DnDContext.Provider value={{ draggingId, dropTarget, start, end, setDropTarget, commit }}>
      {children}
    </DnDContext.Provider>
  )
}

export function useDnD() {
  const ctx = useContext(DnDContext)
  if (!ctx) throw new Error('useDnD must be used within DnDProvider')
  return ctx
}
