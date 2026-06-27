import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'
import {
  SearchIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  PlusIcon,
  ShareIcon,
} from './icons.jsx'

export default function Navbar({
  variant = 'home',
  search,
  onSearchChange,
  onNewBoard,
  board,
  onRenameBoard,
  onShare,
  onHome,
}) {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-40 px-4 sm:px-6">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border transition-all duration-300 ${
          scrolled
            ? 'mt-3 border-brand-200 bg-white/90 py-2 shadow-lg shadow-brand-900/10 backdrop-blur-xl dark:border-white/15 dark:bg-plum-700/85 dark:shadow-black/40'
            : 'mt-5 border-brand-200/80 bg-white/85 py-3 shadow-md shadow-brand-900/5 backdrop-blur-md dark:border-white/10 dark:bg-plum-800/70 dark:shadow-black/20'
        }`}
      >
        <button
          onClick={onHome}
          className="ml-2 flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 text-brand-600 transition hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-white/5"
        >
          <img src="/logo.png" alt="Together logo" className="h-8 w-8 rounded-lg object-contain" />
          <span className="font-display text-lg font-extrabold tracking-tight text-slate-800 dark:text-white">
            Together
          </span>
        </button>

        <div className="flex flex-1 items-center justify-center gap-3 px-2">
          {variant === 'board' ? (
            <BoardTitle board={board} onRename={onRenameBoard} />
          ) : (
            <div className="relative w-full max-w-md">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search boards…"
                className="h-10 w-full rounded-full border border-slate-200 bg-slate-100/70 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-white/10"
              />
            </div>
          )}

          <button
            onClick={onNewBoard}
            className="hidden shrink-0 items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 transition hover:bg-brand-700 active:scale-95 sm:flex"
          >
            <PlusIcon className="h-4 w-4" />
            New Board
          </button>

          {variant === 'board' && (
            <button
              onClick={onShare}
              className="hidden shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-brand-600 active:scale-95 sm:flex dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <ShareIcon className="h-4 w-4" />
              Share
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-brand-600 active:scale-90 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>

          <button
            aria-label="Profile"
            className="mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-sm transition hover:opacity-90 active:scale-90"
          >
            <UserIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function BoardTitle({ board, onRename }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(board?.name ?? '')
  const ref = useRef(null)

  useEffect(() => setName(board?.name ?? ''), [board?.name])
  useEffect(() => {
    if (editing) {
      ref.current?.focus()
      ref.current?.select()
    }
  }, [editing])

  const save = () => {
    const next = name.trim()
    if (next && next !== board.name) onRename?.(next)
    else setName(board.name)
    setEditing(false)
  }

  return (
    <div className="relative flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-slate-100/70 px-4 dark:border-white/10 dark:bg-white/5">
      {editing ? (
        <input
          ref={ref}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') {
              setName(board.name)
              setEditing(false)
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-center text-sm font-semibold text-slate-800 outline-none dark:text-white"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-slate-700 dark:text-slate-100"
          title="Click to rename board"
        >
          {board?.name}
        </button>
      )}
    </div>
  )
}
