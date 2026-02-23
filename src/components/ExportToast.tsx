'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, CheckCircle } from 'lucide-react'
import { ExportFormat } from '@/lib/export'

const labels: Record<ExportFormat, string> = { pdf: 'PDF', md: 'Markdown', docx: 'Word' }

export default function ExportToast({ exporting }: { exporting: ExportFormat | null }) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle')
  const lastFormat = useRef<ExportFormat>('pdf')
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (exporting) {
      lastFormat.current = exporting
      clearTimeout(timerRef.current)
      setPhase('loading')
    } else if (phase === 'loading') {
      setPhase('done')
      timerRef.current = setTimeout(() => setPhase('idle'), 2500)
    }
    return () => clearTimeout(timerRef.current)
  }, [exporting])

  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border border-zinc-700/60 bg-zinc-900/95 backdrop-blur-md"
        >
          {phase === 'done' ? (
            <>
              <CheckCircle size={18} className="text-green-400 shrink-0" />
              <span className="text-sm text-zinc-200 font-cairo">تم تصدير {labels[lastFormat.current]} بنجاح ✓</span>
            </>
          ) : (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Download size={18} className="text-green-400 shrink-0" />
              </motion.div>
              <span className="text-sm text-zinc-200 font-cairo">جاري تصدير {labels[lastFormat.current]}...</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
