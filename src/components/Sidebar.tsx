'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Menu } from 'lucide-react'
import { Chat } from '@/lib/types'

interface Props {
  chats: Chat[]
  activeChatId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  open: boolean
  onToggle: () => void
}

export default function Sidebar({ chats, activeChatId, onSelect, onNew, onDelete, open, onToggle }: Props) {
  return (
    <>
      {/* Mobile toggle - inside header, not fixed */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 z-40 flex flex-col w-[260px] h-full bg-zinc-950 border-r border-zinc-800/60 shrink-0 md:relative md:left-auto"
          >
            {/* Logo */}
            <div className="p-4 border-b border-zinc-800/60 flex justify-center">
              <img src="/logo.svg" alt="Greens AI" className="h-24 w-auto" />
            </div>

            {/* New Chat */}
            <div className="p-3">
              <button
                onClick={onNew}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-green-500/30 transition-all text-sm font-cairo"
              >
                <Plus size={16} className="text-green-500" />
                محادثة جديدة
              </button>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
              {chats.length === 0 && (
                <p className="text-xs text-zinc-600 text-center mt-4 font-cairo">لا توجد محادثات بعد</p>
              )}
              {chats.slice().reverse().map(chat => (
                <div
                  key={chat.id}
                  onClick={() => onSelect(chat.id)}
                  className={`group relative flex items-center px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all ${
                    activeChatId === chat.id
                      ? 'bg-green-500/10 text-white border border-green-500/20'
                      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <span className="flex-1 truncate font-cairo">{chat.title || 'محادثة جديدة'}</span>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(chat.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-zinc-800/60">
              <p className="text-[10px] text-zinc-700 text-center font-cairo">
                ValueIMS · Eng. Muhammed Mekky
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={onToggle} />
      )}
    </>
  )
}
