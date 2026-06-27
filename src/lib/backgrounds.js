export const BACKGROUNDS = [
  { id: 'gradient-1', class: 'bg-gradient-to-br from-[#ecbdc5] to-[#c76d85]' },
  { id: 'gradient-2', class: 'bg-gradient-to-br from-sky-400 to-blue-600' },
  { id: 'gradient-3', class: 'bg-gradient-to-br from-emerald-400 to-teal-600' },
  { id: 'gradient-4', class: 'bg-gradient-to-br from-violet-400 to-purple-600' },
  { id: 'gradient-5', class: 'bg-gradient-to-br from-amber-400 to-orange-600' },
  { id: 'gradient-6', class: 'bg-gradient-to-br from-fuchsia-400 to-pink-600' },
  { id: 'gradient-7', class: 'bg-gradient-to-br from-cyan-400 to-indigo-600' },
  { id: 'gradient-8', class: 'bg-gradient-to-br from-lime-400 to-green-600' },
]

export function getBackground(id) {
  return BACKGROUNDS.find((b) => b.id === id) || BACKGROUNDS[0]
}
