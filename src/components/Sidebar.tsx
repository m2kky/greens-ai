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
      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-gray-800 text-gray-300"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <AnimatePresence>
        {(open) && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed md:relative z-40 flex flex-col w-[260px] h-full bg-[#111111] border-r border-gray-800 shrink-0"
          >
            {/* Logo */}
            <div className="p-4 border-b border-gray-800 flex justify-center">
              <img src="/logo.svg" alt="Greens AI" className="h-16 w-auto" />
            </div>

            {/* New Chat */}
            <div className="p-3">
              <button
                onClick={onNew}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
              >
                <Plus size={16} />
                <span className="font-cairo">+ محادثة جديدة</span>
              </button>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
              {chats.slice().reverse().map(chat => (
                <div
                  key={chat.id}
                  onClick={() => onSelect(chat.id)}
                  className={`group relative flex items-center px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                    activeChatId === chat.id
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <span className="flex-1 truncate font-cairo">{chat.title || 'محادثة جديدة'}</span>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(chat.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-400 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={onToggle}
        />
      )}
    </>
  )
}
