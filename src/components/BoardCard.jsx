import { useState } from 'react'
import { getBackground } from '../lib/backgrounds.js'
import { useBoards } from '../context/BoardContext.jsx'
import { TrashIcon, PencilIcon } from './icons.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

export default function BoardCard({ board, onOpen, onEdit }) {
  const { dispatch } = useBoards()
  const bg = getBackground(board.background)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDelete = () => {
    dispatch({ type: 'DELETE_BOARD', payload: { boardId: board.id } })
    setConfirmOpen(false)
  }

  return (
    <div className="group relative flex flex-col gap-2">
      <button
        onClick={() => onOpen?.(board.id)}
        className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-2xl text-white/70 shadow-sm ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:ring-white/10"
        aria-label={`Open board ${board.name}`}
      >
        {board.backgroundImage ? (
          <span
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${board.backgroundImage})` }}
            aria-hidden="true"
          />
        ) : (
          <span className={`absolute inset-0 ${bg.class}`} aria-hidden="true" />
        )}
        <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        aria-label={`Delete board ${board.name}`}
        title="Delete board"
        className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-600 opacity-0 shadow-md backdrop-blur-sm transition duration-200 hover:scale-105 hover:bg-red-600 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95 group-hover:opacity-100 [@media(hover:none)]:opacity-100 dark:bg-plum-700/90 dark:text-slate-300 dark:hover:bg-red-600 dark:hover:text-white"
      >
        <TrashIcon className="h-4.5 w-4.5" />
      </button>

      <div className="flex w-full items-center gap-1 rounded-full border border-brand-200 bg-white pl-4 pr-1.5 py-1 shadow-sm transition group-hover:border-brand-300 dark:border-white/10 dark:bg-white/5">
        <span className="min-w-0 flex-1 truncate text-center text-sm font-medium text-slate-700 dark:text-slate-200">
          {board.name}
        </span>
        <button
          type="button"
          onClick={() => onEdit?.(board)}
          aria-label={`Edit board ${board.name}`}
          title="Edit board"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-white/10 dark:hover:text-brand-300"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this board?"
        message={`“${board.name}” and everything in it will be permanently removed. This can't be undone.`}
        confirmLabel="Delete board"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
