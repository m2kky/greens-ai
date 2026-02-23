'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AGENTS = [
  { icon: '🔍', label: 'Product Evidence' },
  { icon: '📊', label: 'Market Intelligence' },
  { icon: '🧠', label: 'Consumer Psychology' },
  { icon: '📈', label: 'Trend & Virality' },
  { icon: '📋', label: 'Content Strategy' },
  { icon: '✍️', label: 'Copywriter' },
  { icon: '🛡️', label: 'Compliance' },
  { icon: '✅', label: 'Ops & QA' },
]

type Status = 'waiting' | 'running' | 'done'

export default function AgentPanel({ visible }: { visible: boolean }) {
  const [statuses, setStatuses] = useState<Status[]>(AGENTS.map(() => 'waiting'))

  useEffect(() => {
    if (!visible) {
      setStatuses(AGENTS.map(() => 'waiting'))
      return
    }
    let idx = 0
    const run = () => {
      if (idx >= AGENTS.length) return
      setStatuses(prev => prev.map((s, i) => i === idx ? 'running' : s))
      const delay = 600 + Math.random() * 900
      setTimeout(() => {
        setStatuses(prev => prev.map((s, i) => i === idx ? 'done' : s))
        idx++
        setTimeout(run, 200)
      }, delay)
    }
    run()
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mx-auto w-full max-w-md bg-[#111] border border-gray-800 rounded-xl p-4 mb-4"
        >
          <p className="text-xs text-gray-500 mb-3 font-cairo text-center">جاري تحليل طلبك...</p>
          <div className="space-y-2">
            {AGENTS.map((agent, i) => {
              const s = statuses[i]
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-base w-6 text-center">{agent.icon}</span>
                  <span className={`flex-1 text-sm ${s === 'waiting' ? 'text-gray-600' : s === 'running' ? 'text-green-400' : 'text-gray-400'}`}>
                    {agent.label}
                  </span>
                  {s === 'running' && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-2 h-2 rounded-full bg-green-500"
                    />
                  )}
                  {s === 'done' && <span className="text-green-500 text-xs">✓</span>}
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
