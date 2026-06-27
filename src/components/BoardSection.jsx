import BoardCard from './BoardCard.jsx'

export default function BoardSection({
  icon,
  title,
  boards,
  onNewBoard,
  onOpenBoard,
  onEditBoard,
  emptyHint,
}) {
  const isEmpty = boards.length === 0

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/60 p-5 shadow-sm backdrop-blur-sm transition-colors sm:p-6 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        <span className="text-brand-10000">{icon}</span>
        {title}
      </div>

      {isEmpty ? (
        <EmptyState hint={emptyHint} onNewBoard={onNewBoard} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {boards.map((b) => (
            <BoardCard key={b.id} board={b} onOpen={onOpenBoard} onEdit={onEditBoard} />
          ))}
        </div>
      )}
    </section>
  )
}

function EmptyState({ hint, onNewBoard }) {
  return (
    <div className="grid place-items-center rounded-2xl border-2 border-dashed border-slate-200 py-14 text-center dark:border-white/10">
      <p className="mb-3 max-w-xs text-sm text-slate-400 dark:text-slate-500">{hint}</p>
      {onNewBoard && (
        <button
          onClick={onNewBoard}
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 transition hover:bg-brand-700 active:scale-95"
        >
          + Create your first board
        </button>
      )}
    </div>
  )
}
