import { Fragment, useEffect, useRef, useState } from 'react'
import { useBoards } from '../context/BoardContext.jsx'
import { useDnD } from '../context/DnDContext.jsx'
import Card from './Card.jsx'
import { PlusIcon, TrashIcon } from './icons.jsx'

export default function List({ boardId, list }) {
  const { dispatch } = useBoards()
  const { dropTarget, setDropTarget, commit } = useDnD()
  const isTarget = dropTarget?.listId === list.id
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(list.name)
  const [adding, setAdding] = useState(false)
  const [cardText, setCardText] = useState('')
  const nameRef = useRef(null)
  const addRef = useRef(null)

  useEffect(() => {
    if (editingName) {
      nameRef.current?.focus()
      nameRef.current?.select()
    }
  }, [editingName])

  useEffect(() => {
    if (adding) addRef.current?.focus()
  }, [adding])

  const saveName = () => {
    const next = name.trim()
    if (next && next !== list.name) {
      dispatch({ type: 'RENAME_LIST', payload: { boardId, listId: list.id, name: next } })
    } else {
      setName(list.name)
    }
    setEditingName(false)
  }

  const addCard = () => {
    const next = cardText.trim()
    if (!next) return
    dispatch({ type: 'ADD_CARD', payload: { boardId, listId: list.id, text: next } })
    setCardText('')
    addRef.current?.focus()
  }

  const deleteList = () =>
    dispatch({ type: 'DELETE_LIST', payload: { boardId, listId: list.id } })

  return (
    <div className="flex max-h-full w-72 shrink-0 flex-col rounded-2xl bg-slate-100/90 p-2.5 shadow-sm ring-1 ring-slate-200/70 dark:bg-plum-900/85 dark:shadow-black/30 dark:ring-white/10">
      <div className="group mb-2 flex items-center gap-2 px-1">
        {editingName ? (
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveName()
              if (e.key === 'Escape') {
                setName(list.name)
                setEditingName(false)
              }
            }}
            className="min-w-0 flex-1 rounded-lg bg-white px-2 py-1 text-sm font-semibold text-slate-800 outline-none ring-2 ring-brand-500/30 dark:bg-white/10 dark:text-white"
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="min-w-0 flex-1 truncate rounded-lg px-2 py-1 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-200/70 dark:text-slate-100 dark:hover:bg-white/10"
            title="Click to rename list"
          >
            {list.name}
          </button>
        )}

        <span className="shrink-0 rounded-md bg-slate-200/80 px-1.5 text-xs font-medium text-slate-500 dark:bg-white/10 dark:text-slate-400">
          {list.cards.length}
        </span>

        <button
          onClick={() => setAdding(true)}
          aria-label="Add card"
          title="Add card"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-brand-600 hover:text-white dark:bg-white/10 dark:text-slate-300"
        >
          <PlusIcon className="h-4 w-4" />
        </button>

        <button
          onClick={deleteList}
          aria-label="Delete list"
          title="Delete list"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 dark:hover:bg-red-500/15"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-1 pb-1"
        onDragOver={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault()
            setDropTarget(list.id, list.cards.length)
          }
        }}
        onDrop={(e) => {
          e.preventDefault()
          commit()
        }}
      >
        {list.cards.map((card, i) => (
          <Fragment key={card.id}>
            {isTarget && dropTarget.index === i && <DropPlaceholder />}
            <Card boardId={boardId} listId={list.id} card={card} index={i} />
          </Fragment>
        ))}
        {isTarget && dropTarget.index >= list.cards.length && <DropPlaceholder />}

        {list.cards.length === 0 && !adding && !isTarget && (
          <p className="px-1 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
            No cards yet
          </p>
        )}

        {adding && (
          <div className="rounded-xl border border-brand-300 bg-white p-2 shadow-sm dark:border-brand-500/40 dark:bg-white/10">
            <textarea
              ref={addRef}
              value={cardText}
              onChange={(e) => setCardText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  addCard()
                }
                if (e.key === 'Escape') {
                  setAdding(false)
                  setCardText('')
                }
              }}
              rows={2}
              placeholder="Enter a title for this card…"
              className="w-full resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={addCard}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700 active:scale-95"
              >
                Add card
              </button>
              <button
                onClick={() => {
                  setAdding(false)
                  setCardText('')
                }}
                className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="mt-1 flex items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-white/10"
        >
          <PlusIcon className="h-4 w-4" />
          Add a card
        </button>
      )}
    </div>
  )
}

function DropPlaceholder() {
  return (
    <div className="pointer-events-none h-10 shrink-0 rounded-xl border-2 border-dashed border-brand-400 bg-brand-100/50 dark:border-brand-500/60 dark:bg-brand-500/10" />
  )
}
