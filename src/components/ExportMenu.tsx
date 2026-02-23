'use client'
import { useState, useRef, useEffect } from 'react'
import { Download, FileText, FileCode, File } from 'lucide-react'
import { ExportFormat, runExport } from '@/lib/export'
import { Message } from '@/lib/types'

interface Props {
  title: string
  messages: Message[]
  onExporting: (format: ExportFormat | null) => void
  size?: 'sm' | 'md'
}

const formats: { id: ExportFormat; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'pdf',  label: 'PDF',      icon: <File size={14} />,     color: 'text-red-400' },
  { id: 'md',   label: 'Markdown', icon: <FileCode size={14} />, color: 'text-blue-400' },
  { id: 'docx', label: 'Word',     icon: <FileText size={14} />, color: 'text-sky-400' },
]

export default function ExportMenu({ title, messages, onExporting, size = 'md' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handle = async (format: ExportFormat) => {
    setOpen(false)
    onExporting(format)
    try {
      await runExport(format, title, messages)
    } finally {
      onExporting(null)
    }
  }

  const btnSize = size === 'sm'
    ? 'p-1.5 text-xs'
    : 'px-3 py-1.5 text-sm gap-1.5'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={messages.length === 0}
        className={`flex items-center ${btnSize} rounded-lg text-zinc-400 hover:text-green-400 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
        title="تصدير"
      >
        <Download size={size === 'sm' ? 14 : 15} />
        {size === 'md' && <span>تصدير</span>}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden min-w-[130px]">
          {formats.map(f => (
            <button
              key={f.id}
              onClick={() => handle(f.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${f.color}`}
            >
              {f.icon}
              <span className="text-zinc-200">{f.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
