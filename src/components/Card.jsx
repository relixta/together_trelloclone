import { useEffect, useRef, useState } from 'react'
import { useBoards } from '../context/BoardContext.jsx'
import { useDnD } from '../context/DnDContext.jsx'
import { CARD_COLORS, getCardColor } from '../lib/cardColors.js'
import { PaletteIcon, TrashIcon } from './icons.jsx'

export default function Card({ boardId, listId, card, index }) {
  const { dispatch } = useBoards()
  const { draggingId, start, end, setDropTarget, commit } = useDnD()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(card.text)
  const [picker, setPicker] = useState(null)
  const inputRef = useRef(null)
  const pickerRef = useRef(null)
  const paletteBtnRef = useRef(null)

  const color = getCardColor(card.color)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  useEffect(() => {
    if (!picker) return
    const close = (e) => {
      if (e?.type === 'mousedown' && pickerRef.current?.contains(e.target)) return
      if (e?.type === 'mousedown' && paletteBtnRef.current?.contains(e.target)) return
      setPicker(null)
    }
    window.addEventListener('mousedown', close)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('mousedown', close)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [picker])

  const togglePicker = () => {
    if (picker) {
      setPicker(null)
      return
    }
    const r = paletteBtnRef.current.getBoundingClientRect()
    const width = 232
    const left = Math.max(8, Math.min(r.right - width, window.innerWidth - width - 8))
    setPicker({ top: r.bottom + 6, left })
  }

  const saveText = () => {
    const next = text.trim()
    if (next && next !== card.text) {
      dispatch({ type: 'UPDATE_CARD', payload: { boardId, listId, cardId: card.id, text: next } })
    } else {
      setText(card.text)
    }
    setEditing(false)
  }

  const setColor = (colorId) => {
    dispatch({ type: 'UPDATE_CARD', payload: { boardId, listId, cardId: card.id, color: colorId } })
    setPicker(null)
  }

  const remove = () =>
    dispatch({ type: 'DELETE_CARD', payload: { boardId, listId, cardId: card.id } })

  const onDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const after = e.clientY - rect.top > rect.height / 2
    setDropTarget(listId, index + (after ? 1 : 0))
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    commit()
  }

  return (
    <div
      draggable={!editing}
      onDragStart={(e) => {
        start(listId, card.id)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', card.id)
      }}
      onDragEnd={end}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`group relative flex items-stretch gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-plum-600 dark:shadow-black/30 ${
        draggingId === card.id ? 'opacity-40' : ''
      } ${editing ? 'cursor-text' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <span className={`w-1.5 shrink-0 rounded-full ${color.bar}`} aria-hidden="true" />

      {editing ? (
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={saveText}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveText()
            if (e.key === 'Escape') {
              setText(card.text)
              setEditing(false)
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none dark:text-slate-100"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="min-w-0 flex-1 cursor-text truncate text-left text-sm text-slate-800 dark:text-slate-100"
          title="Click to rename"
        >
          {card.text}
        </button>
      )}

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
        <button
          ref={paletteBtnRef}
          onClick={togglePicker}
          aria-label="Change card color"
          title="Change color"
          className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-white/10"
        >
          <PaletteIcon className="h-4 w-4" />
        </button>
        <button
          onClick={remove}
          aria-label="Delete card"
          title="Delete card"
          className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/15"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {picker && (
        <div
          ref={pickerRef}
          style={{ position: 'fixed', top: picker.top, left: picker.left }}
          className="z-[70] flex gap-1.5 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-plum-700"
        >
          {CARD_COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setColor(c.id)}
              aria-label={c.label}
              title={c.label}
              className={`h-6 w-6 rounded-full ${c.dot} transition hover:scale-110 ${
                card.color === c.id
                  ? 'ring-2 ring-slate-700 ring-offset-1 dark:ring-white dark:ring-offset-plum-700'
                  : ''
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
