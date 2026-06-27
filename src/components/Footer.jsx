export default function Footer() {
  const year = new Date().getFullYear()

  const links = [
    { label: 'About', href: '#' },
    { label: 'Boards', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Contact', href: '#' },
  ]

  return (
    <footer className="mt-auto border-t border-brand-200/70 bg-white/60 backdrop-blur-sm dark:border-white/10 dark:bg-plum-800/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Together logo"
            className="h-7 w-7 rounded-lg object-contain"
          />
          <span className="font-display text-base font-extrabold tracking-tight text-slate-800 dark:text-white">
            Together
          </span>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          © {year} Together. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
