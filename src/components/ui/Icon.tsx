export function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    home: 'M3 10 12 3l9 7v11h-6v-7H9v7H3Z',
    lesson: 'M3 4h18v13H3ZM8 21h8M12 17v4',
    calendar: 'M4 5h16v16H4ZM4 10h16M8 3v4M16 3v4',
    user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21a8 8 0 0 1 16 0',
    chat: 'M3 4h18v14H9l-6 4ZM7 9h10M7 13h7',
    chart: 'M4 21V12h3v9M11 21V4h3v17M18 21V8h3v13',
    search: 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM15 15l6 6',
    bookmark: 'M6 3h12v18l-6-4-6 4Z',
    arrow: 'm9 5 7 7-7 7',
    help: 'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 18h.01',
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.chat} />
    </svg>
  )
}
