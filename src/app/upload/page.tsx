'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, AlertCircle, X, FileText } from 'lucide-react'
import Link from 'next/link'

const TABLES = [
  { value: 'greens_products',        label: 'المنتجات — greens_products' },
  { value: 'greens_brand_voice',     label: 'صوت العلامة — greens_brand_voice' },
  { value: 'greens_regulatory',      label: 'التنظيمي — greens_regulatory' },
  { value: 'greens_market_trends',   label: 'اتجاهات السوق — greens_market_trends' },
  { value: 'greens_customer_reviews',label: 'آراء العملاء — greens_customer_reviews' },
  { value: 'greens_faqs',            label: 'الأسئلة الشائعة — greens_faqs' },
  { value: 'greens_objections',      label: 'الاعتراضات — greens_objections' },
  { value: 'greens_recipes',         label: 'الوصفات — greens_recipes' },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function UploadPage() {
  const [table, setTable] = useState(TABLES[0].value)
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const pdfs = Array.from(incoming)
    setFiles(prev => [...prev, ...pdfs])
  }

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async () => {
    if (!files.length) return
    setStatus('loading')
    try {
      for (const file of files) {
        const form = new FormData()
        form.append('PDF Files', file)
        form.append('Target Table', table)
        const res = await fetch('/api/upload', { method: 'POST', body: form })
        if (!res.ok) throw new Error(await res.text())
      }
      setStatus('success')
      setMessage(`تم رفع ${files.length} ملف بنجاح إلى ${table}`)
      setFiles([])
    } catch (e: any) {
      setStatus('error')
      setMessage(e.message || 'حدث خطأ أثناء الرفع')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-12" dir="rtl">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <img src="/logo.svg" alt="Greens AI" className="h-20 w-auto mx-auto" />
          <h1 className="text-white font-bold text-xl">رفع بيانات RAG</h1>
          <p className="text-zinc-500 text-sm">ارفع ملفات PDF لتدريب الوكلاء</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-5">
          {/* Table selector */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">الجدول المستهدف</label>
            <select
              value={table}
              onChange={e => setTable(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-green-500/50 transition-colors"
            >
              {TABLES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
            className="border-2 border-dashed border-zinc-700 hover:border-green-500/40 rounded-xl p-8 text-center cursor-pointer transition-colors group"
          >
            <Upload size={28} className="mx-auto mb-2 text-zinc-600 group-hover:text-green-500 transition-colors" />
            <p className="text-zinc-400 text-sm">اسحب ملفات PDF هنا أو اضغط للاختيار</p>
            <input ref={inputRef} type="file" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-zinc-800/60 rounded-xl px-4 py-2.5">
                  <FileText size={15} className="text-green-400 shrink-0" />
                  <span className="flex-1 text-sm text-zinc-300 truncate">{f.name}</span>
                  <span className="text-xs text-zinc-600">{(f.size / 1024).toFixed(0)} KB</span>
                  <button onClick={() => removeFile(i)} className="text-zinc-600 hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!files.length || status === 'loading'}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Upload size={16} />
              </motion.div>
            ) : <Upload size={16} />}
            {status === 'loading' ? 'جاري الرفع...' : `رفع ${files.length || ''} ملف`}
          </button>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {(status === 'success' || status === 'error') && (
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${status === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}
            >
              {status === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm">{message}</span>
              <button onClick={() => setStatus('idle')} className="mr-auto opacity-60 hover:opacity-100"><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <Link href="/" className="block text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
          ← العودة للمحادثة
        </Link>
      </div>
    </div>
  )
}
