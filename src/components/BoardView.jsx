import { useEffect, useRef, useState } from 'react'
import { useBoards } from '../context/BoardContext.jsx'
import { DnDProvider } from '../context/DnDContext.jsx'
import { getBackground } from '../lib/backgrounds.js'
import List from './List.jsx'
import { PlusIcon } from './icons.jsx'

export default function BoardView({ board }) {
  const { dispatch } = useBoards()
  const hasLists = board.lists.length > 0

  const addList = (name) =>
    dispatch({ type: 'ADD_LIST', payload: { boardId: board.id, name } })

  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 -z-10">
        {board.backgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${board.backgroundImage})` }}
          />
        ) : (
          <div className={`absolute inset-0 ${getBackground(board.background).class}`} />
        )}
        <div className="absolute inset-0 bg-white/45 dark:bg-black/55" />
      </div>

      {!hasLists ? (
        <div className="grid min-h-[60vh] place-items-center">
          <CreateListCenter onCreate={addList} />
        </div>
      ) : (
        <DnDProvider boardId={board.id}>
          <div className="flex h-[calc(100dvh-8.5rem)] gap-4 overflow-x-auto pb-4">
            {board.lists.map((list) => (
              <List key={list.id} boardId={board.id} list={list} />
            ))}
            <CreateListColumn onCreate={addList} />
          </div>
        </DnDProvider>
      )}
    </div>
  )
}

function CreateListCenter({ onCreate }) {
  const [adding, setAdding] = useState(false)
  if (adding) {
    return <ListComposer autoFocus onCreate={onCreate} onClose={() => setAdding(false)} center />
  }
  return (
    <button
      onClick={() => setAdding(true)}
      className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/70 px-8 py-5 text-base font-semibold text-slate-600 shadow-sm transition hover:border-brand-400 hover:text-brand-600 active:scale-95 dark:border-white/15 dark:bg-white/5 dark:text-slate-300"
    >
      <PlusIcon className="h-5 w-5" />
      Create New List
    </button>
  )
}

function CreateListColumn({ onCreate }) {
  const [adding, setAdding] = useState(false)
  if (adding) {
    return (
      <div className="w-72 shrink-0">
        <ListComposer autoFocus onCreate={onCreate} onClose={() => setAdding(false)} />
      </div>
    )
  }
  return (
    <button
      onClick={() => setAdding(true)}
      className="flex h-11 w-72 shrink-0 items-center gap-1.5 rounded-2xl bg-white/60 px-4 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white hover:text-brand-600 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/10"
    >
      <PlusIcon className="h-4 w-4" />
      Create New List
    </button>
  )
}

function ListComposer({ onCreate, onClose, center }) {
  const [name, setName] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  const submit = () => {
    const next = name.trim()
    if (!next) return
    onCreate(next)
    setName('')
    onClose()
  }

  return (
    <div
      className={`rounded-2xl border border-brand-300 bg-white p-3 shadow-md dark:border-brand-500/40 dark:bg-plum-700 ${
        center ? 'w-72' : 'w-full'
      }`}
    >
      <input
        ref={ref}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') onClose()
        }}
        placeholder="Enter list name… e.g. To Do"
        className="w-full rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500/30 dark:bg-white/5 dark:text-white dark:ring-white/10"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={submit}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700 active:scale-95"
        >
          Add list
        </button>
        <button
          onClick={onClose}
          className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
