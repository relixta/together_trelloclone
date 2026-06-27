import { useEffect, useRef, useState } from 'react'
import { useBoards } from '../context/BoardContext.jsx'
import { BACKGROUNDS } from '../lib/backgrounds.js'
import { fileToCoverDataURL } from '../lib/image.js'
import { CloseIcon, ImageIcon } from './icons.jsx'

export default function BoardFormModal({ open, onClose, mode = 'create', board = null }) {
  const { dispatch } = useBoards()
  const isEdit = mode === 'edit'
  const [name, setName] = useState('')
  const [bg, setBg] = useState(BACKGROUNDS[0].id)
  const [customImage, setCustomImage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setName(isEdit ? board?.name ?? '' : '')
    setBg(isEdit ? board?.background ?? BACKGROUNDS[0].id : BACKGROUNDS[0].id)
    setCustomImage(isEdit ? board?.backgroundImage ?? null : null)
    setError('')
    setBusy(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [open, board?.id])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const pickFile = () => fileRef.current?.click()

  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    setBusy(true)
    try {
      const dataUrl = await fileToCoverDataURL(file)
      setCustomImage(dataUrl)
    } catch (err) {
      setError(err.message || 'Could not use that image.')
    } finally {
      setBusy(false)
    }
  }

  const submit = () => {
    if (!name.trim()) return
    if (isEdit) {
      dispatch({
        type: 'UPDATE_BOARD',
        payload: { boardId: board.id, name: name.trim(), background: bg, backgroundImage: customImage },
      })
    } else {
      dispatch({
        type: 'ADD_BOARD',
        payload: { name, background: bg, backgroundImage: customImage },
      })
    }
    onClose()
  }

  const selected = BACKGROUNDS.find((b) => b.id === bg)

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_.2s_ease]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20 dark:border-white/10 dark:bg-plum-700">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
            {isEdit ? 'Edit Board' : 'Create New Board'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <label htmlFor="board-name" className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
          Board name
        </label>
        <input
          id="board-name"
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && submit()}
          placeholder="e.g. Product Roadmap"
          className="mb-5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />

        <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

        <button
          type="button"
          onClick={pickFile}
          aria-label="Upload a background image"
          className="group relative mb-3 grid h-28 w-full place-items-center overflow-hidden rounded-2xl text-white/90 shadow-inner outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {customImage ? (
            <>
              <span
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${customImage})` }}
              />
              <span className="absolute inset-0 grid place-items-center bg-black/30 text-sm font-medium opacity-0 transition group-hover:opacity-100">
                <span className="flex flex-col items-center gap-1">
                  <ImageIcon className="h-6 w-6" />
                  Change image
                </span>
              </span>
            </>
          ) : (
            <>
              <span className={`absolute inset-0 ${selected?.class}`} />
              <span className="relative flex flex-col items-center gap-1 text-sm font-medium">
                <ImageIcon className="h-7 w-7" />
                {busy ? 'Processing…' : 'Select Background Board'}
                {!busy && (
                  <span className="text-xs font-normal text-white/80">Click to upload your own</span>
                )}
              </span>
            </>
          )}
        </button>

        {error && <p className="mb-3 text-xs font-medium text-red-500">{error}</p>}

        <div className="mb-6 flex gap-2.5">
          {customImage && (
            <button
              onClick={pickFile}
              aria-label="Use uploaded image"
              className="h-9 flex-1 rounded-lg bg-cover bg-center ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-plum-700"
              style={{ backgroundImage: `url(${customImage})` }}
            />
          )}
          {BACKGROUNDS.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setBg(b.id)
                setCustomImage(null)
              }}
              aria-label={`Background ${b.id}`}
              className={`h-9 flex-1 rounded-lg transition ${b.class} ${
                bg === b.id && !customImage
                  ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-plum-700'
                  : 'opacity-80 hover:opacity-100'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={!name.trim() || busy}
            className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 transition hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isEdit ? 'Save changes' : 'Create'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  )
}
