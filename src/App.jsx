import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import BoardSection from './components/BoardSection.jsx'
import BoardView from './components/BoardView.jsx'
import BoardFormModal from './components/BoardFormModal.jsx'
import Footer from './components/Footer.jsx'
import { useBoards } from './context/BoardContext.jsx'
import { ClockIcon, BoardsIcon } from './components/icons.jsx'

export default function App() {
  const { state, dispatch } = useBoards()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBoard, setEditingBoard] = useState(null)
  const [activeBoardId, setActiveBoardId] = useState(null)

  const activeBoard = state.boards.find((b) => b.id === activeBoardId) || null

  useEffect(() => {
    if (activeBoardId && !activeBoard) setActiveBoardId(null)
  }, [activeBoardId, activeBoard])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return state.boards
    return state.boards.filter((b) => b.name.toLowerCase().includes(q))
  }, [state.boards, search])

  const latest = useMemo(
    () => [...filtered].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4),
    [filtered],
  )

  const hasBoards = state.boards.length > 0

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/?board=${activeBoard.id}`)
    } catch {
      void 0
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        variant={activeBoard ? 'board' : 'home'}
        search={search}
        onSearchChange={setSearch}
        onNewBoard={() => setModalOpen(true)}
        board={activeBoard}
        onRenameBoard={(name) =>
          dispatch({ type: 'RENAME_BOARD', payload: { boardId: activeBoard.id, name } })
        }
        onShare={handleShare}
        onHome={() => setActiveBoardId(null)}
      />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-600/10" />
      </div>

      {activeBoard ? (
        <>
          <main className="mx-auto w-full max-w-[100rem] flex-1 px-4 pt-6 sm:px-6">
            <BoardView board={activeBoard} />
          </main>
          <Footer />
        </>
      ) : (
        <>
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-20 pt-8 sm:px-6">
            {!hasBoards ? (
              <Welcome onNewBoard={() => setModalOpen(true)} />
            ) : (
              <div className="space-y-8">
                <BoardSection
                  icon={<ClockIcon className="h-4.5 w-4.5" />}
                  title="Latest View"
                  boards={latest}
                  onOpenBoard={setActiveBoardId}
                  onEditBoard={setEditingBoard}
                  emptyHint="No recent boards match your search."
                />
                <BoardSection
                  icon={<BoardsIcon className="h-4.5 w-4.5" />}
                  title="All Board"
                  boards={filtered}
                  onOpenBoard={setActiveBoardId}
                  onEditBoard={setEditingBoard}
                  onNewBoard={() => setModalOpen(true)}
                  emptyHint="No boards match your search."
                />
              </div>
            )}
          </main>
          <Footer />
        </>
      )}

      <BoardFormModal mode="create" open={modalOpen} onClose={() => setModalOpen(false)} />
      <BoardFormModal
        mode="edit"
        open={!!editingBoard}
        board={editingBoard}
        onClose={() => setEditingBoard(null)}
      />
    </div>
  )
}

function Welcome({ onNewBoard }) {
  return (
    <div className="grid place-items-center rounded-3xl border-2 border-dashed border-slate-200 py-28 text-center dark:border-white/10">
      <div className="mx-auto max-w-md px-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-4xl">
          Welcome to <span className="text-brand-600 dark:text-brand-400">Together</span>
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Organize anything, with anyone. Create your first board to get started — your boards
          will appear here.
        </p>
        <button
          onClick={onNewBoard}
          className="mt-7 rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 active:scale-95"
        >
          + Create New Board
        </button>
      </div>
    </div>
  )
}
