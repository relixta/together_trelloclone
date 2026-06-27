export const CARD_COLORS = [
  { id: 'slate', label: 'Gray', bar: 'bg-slate-400', dot: 'bg-slate-400' },
  { id: 'rose', label: 'Rose', bar: 'bg-rose-500', dot: 'bg-rose-500' },
  { id: 'amber', label: 'Amber', bar: 'bg-amber-500', dot: 'bg-amber-500' },
  { id: 'emerald', label: 'Green', bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  { id: 'sky', label: 'Blue', bar: 'bg-sky-500', dot: 'bg-sky-500' },
  { id: 'violet', label: 'Purple', bar: 'bg-violet-500', dot: 'bg-violet-500' },
  { id: 'pink', label: 'Pink', bar: 'bg-pink-500', dot: 'bg-pink-500' },
]

export function getCardColor(id) {
  return CARD_COLORS.find((c) => c.id === id) || CARD_COLORS[0]
}
