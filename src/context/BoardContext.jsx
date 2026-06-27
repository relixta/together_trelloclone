import { createContext, useContext, useEffect, useReducer } from 'react'

const BoardContext = createContext(null)

const STORAGE_KEY = 'together.boards'

function loadState() {
  if (typeof window === 'undefined') return { boards: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { boards: [] }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.boards)) return { boards: [] }
    return parsed
  } catch {
    return { boards: [] }
  }
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

function updateBoard(state, boardId, fn) {
  return {
    ...state,
    boards: state.boards.map((b) =>
      b.id === boardId ? { ...fn(b), updatedAt: Date.now() } : b,
    ),
  }
}

const mapLists = (board, listId, fn) => ({
  ...board,
  lists: board.lists.map((l) => (l.id === listId ? fn(l) : l)),
})

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_BOARD': {
      const now = Date.now()
      const board = {
        id: uid(),
        name: action.payload.name?.trim() || 'Untitled Board',
        background: action.payload.background || 'gradient-1',
        backgroundImage: action.payload.backgroundImage || null,
        createdAt: now,
        updatedAt: now,
        lists: [],
      }
      return { ...state, boards: [board, ...state.boards] }
    }

    case 'RENAME_BOARD':
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? { ...b, name: action.payload.name, updatedAt: Date.now() }
            : b,
        ),
      }

    case 'UPDATE_BOARD':
      return updateBoard(state, action.payload.boardId, (b) => ({
        ...b,
        ...(action.payload.name !== undefined ? { name: action.payload.name } : {}),
        ...(action.payload.background !== undefined
          ? { background: action.payload.background }
          : {}),
        ...(action.payload.backgroundImage !== undefined
          ? { backgroundImage: action.payload.backgroundImage }
          : {}),
      }))

    case 'DELETE_BOARD':
      return {
        ...state,
        boards: state.boards.filter((b) => b.id !== action.payload.boardId),
      }

    case 'TOUCH_BOARD':
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId ? { ...b, updatedAt: Date.now() } : b,
        ),
      }

    case 'ADD_LIST':
      return updateBoard(state, action.payload.boardId, (b) => ({
        ...b,
        lists: [
          ...b.lists,
          { id: uid(), name: action.payload.name?.trim() || 'New List', cards: [] },
        ],
      }))

    case 'RENAME_LIST':
      return updateBoard(state, action.payload.boardId, (b) =>
        mapLists(b, action.payload.listId, (l) => ({ ...l, name: action.payload.name })),
      )

    case 'DELETE_LIST':
      return updateBoard(state, action.payload.boardId, (b) => ({
        ...b,
        lists: b.lists.filter((l) => l.id !== action.payload.listId),
      }))

    case 'ADD_CARD':
      return updateBoard(state, action.payload.boardId, (b) =>
        mapLists(b, action.payload.listId, (l) => ({
          ...l,
          cards: [
            ...l.cards,
            {
              id: uid(),
              text: action.payload.text?.trim() || 'New Card',
              color: action.payload.color || 'slate',
            },
          ],
        })),
      )

    case 'UPDATE_CARD':
      return updateBoard(state, action.payload.boardId, (b) =>
        mapLists(b, action.payload.listId, (l) => ({
          ...l,
          cards: l.cards.map((c) =>
            c.id === action.payload.cardId
              ? {
                  ...c,
                  ...(action.payload.text !== undefined ? { text: action.payload.text } : {}),
                  ...(action.payload.color !== undefined ? { color: action.payload.color } : {}),
                }
              : c,
          ),
        })),
      )

    case 'DELETE_CARD':
      return updateBoard(state, action.payload.boardId, (b) =>
        mapLists(b, action.payload.listId, (l) => ({
          ...l,
          cards: l.cards.filter((c) => c.id !== action.payload.cardId),
        })),
      )

    case 'MOVE_CARD': {
      const { boardId, fromListId, toListId, cardId, toIndex } = action.payload
      return updateBoard(state, boardId, (b) => {
        const fromList = b.lists.find((l) => l.id === fromListId)
        const card = fromList?.cards.find((c) => c.id === cardId)
        if (!card) return b
        const fromIndex = fromList.cards.findIndex((c) => c.id === cardId)
        const clamp = (i, len) => Math.max(0, Math.min(i, len))

        return {
          ...b,
          lists: b.lists.map((l) => {
            if (l.id === fromListId && fromListId === toListId) {
              const cards = l.cards.filter((c) => c.id !== cardId)
              const idx = fromIndex < toIndex ? toIndex - 1 : toIndex
              cards.splice(clamp(idx, cards.length), 0, card)
              return { ...l, cards }
            }
            if (l.id === fromListId) {
              return { ...l, cards: l.cards.filter((c) => c.id !== cardId) }
            }
            if (l.id === toListId) {
              const cards = [...l.cards]
              cards.splice(clamp(toIndex, cards.length), 0, card)
              return { ...l, cards }
            }
            return l
          }),
        }
      })
    }

    default:
      return state
  }
}

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      void 0
    }
  }, [state])

  return (
    <BoardContext.Provider value={{ state, dispatch }}>{children}</BoardContext.Provider>
  )
}

export function useBoards() {
  const ctx = useContext(BoardContext)
  if (!ctx) throw new Error('useBoards must be used within BoardProvider')
  return ctx
}
