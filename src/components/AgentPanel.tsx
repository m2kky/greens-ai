'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AGENTS = [
  { id: 'AGENT 01', title: 'Product Evidence',      desc: 'يتم فحص وتحليل بيانات المنتج واستخراج المميزات...' },
  { id: 'AGENT 02', title: 'Market Intelligence',   desc: 'جاري دراسة السوق وتحليل استراتيجيات المنافسين...' },
  { id: 'AGENT 03', title: 'Consumer Psychology',   desc: 'تحليل سيكولوجية المستهلك المستهدف والدوافع الشرائية...' },
  { id: 'AGENT 04', title: 'Trend & Virality',      desc: 'رصد التريندات الحالية وفرص الانتشار السريع...' },
  { id: 'AGENT 05', title: 'Content Strategy',      desc: 'بناء استراتيجية المحتوى والزوايا الإعلانية الأفضل...' },
  { id: 'AGENT 06', title: 'Copywriter',            desc: 'صياغة النصوص الإعلانية الجذابة والمقنعة...' },
  { id: 'AGENT 07', title: 'Compliance',            desc: 'مراجعة توافق المحتوى مع سياسات منصات الإعلان...' },
  { id: 'AGENT 08', title: 'Ops & QA',              desc: 'المراجعة النهائية وتنسيق المخرجات بجودة عالية...' },
]

export default function AgentPanel({ visible }: { visible: boolean }) {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!visible) { setIndex(0); setDone(false); return }

    let i = 0
    let cancelled = false
    const next = () => {
      if (cancelled) return
      if (i >= AGENTS.length) { setDone(true); return }
      setIndex(i)
      i++
      setTimeout(next, 1800 + Math.random() * 1400)
    }
    const t = setTimeout(next, 300)
    return () => { cancelled = true; clearTimeout(t) }
  }, [visible])

  const progress = done ? 100 : Math.round(((index + 1) / AGENTS.length) * 100)
  const current = done
    ? { id: 'SYSTEM_READY', title: 'اكتمل التحليل', desc: 'تم إنجاز مهام جميع الوكلاء بنجاح.' }
    : AGENTS[index]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="mx-auto w-full max-w-sm rounded-3xl p-8 mb-4 flex flex-col items-center text-center"
          style={{
            background: 'linear-gradient(145deg, rgba(24,24,27,0.8), rgba(9,9,11,0.9))',
            border: '1px solid rgba(34,197,94,0.1)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Badge */}
          <div className="mb-6 flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500 text-xs font-mono tracking-wider">MULTI_AGENT_SYNC</span>
          </div>

          {/* SVG Core */}
          <div className="relative w-28 h-28 mb-6">
            <style>{`
              @keyframes spin-cw  { 100% { transform: rotate(360deg);  } }
              @keyframes spin-ccw { 100% { transform: rotate(-360deg); } }
              @keyframes pulse-core {
                0%,100% { filter: drop-shadow(0 0 8px #22c55e);  transform: scale(0.95); }
                50%      { filter: drop-shadow(0 0 22px #22c55e); transform: scale(1.05); }
              }
            `}</style>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="8 6" opacity="0.3"
                style={{ animation: 'spin-cw 8s linear infinite', transformOrigin: 'center' }} />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="30 15 10 15" opacity="0.6"
                style={{ animation: 'spin-ccw 5s linear infinite', transformOrigin: 'center' }} />
              <path d="M 65 35 C 65 50, 55 60, 45 60 C 35 60, 30 55, 28 48 L 32 38 C 42 32, 55 35, 65 35 Z" fill="#22c55e"
                style={{ animation: done ? 'none' : 'pulse-core 2s ease-in-out infinite', transformOrigin: 'center' }} />
            </svg>
          </div>

          {/* Dynamic text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              className="w-full h-24 flex flex-col justify-center mb-6"
            >
              <p className={`text-xs font-mono mb-1 tracking-widest uppercase ${done ? 'text-green-500' : 'text-zinc-500'}`}>
                {current.id}
              </p>
              <h3 className={`text-xl font-bold mb-1 ${done ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent' : 'text-white'}`}>
                {current.title}
              </h3>
              <p className="text-sm text-zinc-400 font-cairo">{current.desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-zinc-500 mb-2 font-mono">
              <span>{progress}%</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #22c55e, #10b981)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
