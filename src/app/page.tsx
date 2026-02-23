'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import MessageBubble from '@/components/MessageBubble'
import AgentPanel from '@/components/AgentPanel'
import { Chat, Message } from '@/lib/types'
import { loadChats, saveChats, createChat, addMessage, deleteChat } from '@/lib/storage'

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const stored = loadChats()
    setChats(stored)
    if (stored.length > 0) setActiveChatId(stored[stored.length - 1].id)
    // default sidebar closed on mobile
    if (window.innerWidth < 768) setSidebarOpen(false)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, activeChatId, loading])

  const activeChat = chats.find(c => c.id === activeChatId) ?? null

  const handleNew = useCallback(() => {
    const chat = createChat('محادثة جديدة')
    const updated = [...chats, chat]
    setChats(updated)
    saveChats(updated)
    setActiveChatId(chat.id)
    if (window.innerWidth < 768) setSidebarOpen(false)
  }, [chats])

  const handleSelect = useCallback((id: string) => {
    setActiveChatId(id)
    if (window.innerWidth < 768) setSidebarOpen(false)
  }, [])

  const handleDelete = useCallback((id: string) => {
    const updated = deleteChat(chats, id)
    setChats(updated)
    saveChats(updated)
    if (activeChatId === id) setActiveChatId(updated.length > 0 ? updated[updated.length - 1].id : null)
  }, [chats, activeChatId])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    let currentChats = chats
    let chatId = activeChatId

    // Create new chat if none active
    if (!chatId) {
      const chat = createChat(text)
      currentChats = [...chats, chat]
      chatId = chat.id
      setChats(currentChats)
      saveChats(currentChats)
      setActiveChatId(chatId)
    }

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date().toISOString() }

    // Update title from first real message
    currentChats = currentChats.map(c =>
      c.id === chatId && c.title === 'محادثة جديدة'
        ? { ...c, title: text.slice(0, 30) }
        : c
    )
    currentChats = addMessage(currentChats, chatId, userMsg)
    setChats(currentChats)
    saveChats(currentChats)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: chatId }),
      })
      const data = await res.json()
      const content = data.output ?? data.error ?? 'حدث خطأ غير متوقع.'
      const aiMsg: Message = { role: 'assistant', content, timestamp: new Date().toISOString() }
      const final = addMessage(currentChats, chatId, aiMsg)
      setChats(final)
      saveChats(final)
    } catch {
      const errMsg: Message = {
        role: 'assistant',
        content: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString(),
      }
      const final = addMessage(currentChats, chatId, errMsg)
      setChats(final)
      saveChats(final)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-[#0a0a0a]">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="hidden md:block p-1.5 rounded-lg hover:bg-gray-800 text-gray-400"
          >
            ☰
          </button>
          <img src="/logo.svg" alt="Greens AI" className="h-10 w-auto" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {!activeChat || activeChat.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div className="text-5xl">🌿</div>
                <p className="text-2xl font-bold text-gray-300 font-cairo">ابدأ محادثة جديدة</p>
                <p className="text-gray-500 text-sm font-cairo">مساعد تسويق المكملات الغذائية</p>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {activeChat.messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-sm shrink-0 mr-2">
                    🌿
                  </div>
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-gray-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <AgentPanel visible={loading} />
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-800 bg-[#0a0a0a]">
          <div className="max-w-3xl mx-auto flex gap-2 items-end bg-[#111] border border-gray-700 rounded-xl p-2 focus-within:border-green-500/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رسالتك هنا..."
              rows={1}
              dir="auto"
              className="flex-1 bg-transparent resize-none outline-none text-gray-200 placeholder-gray-600 text-sm px-2 py-1 font-cairo max-h-32"
              style={{ minHeight: '36px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-700 mt-2 font-cairo">
            Greens AI · بناء بواسطة <span className="text-gray-600">ValueIMS</span> · Eng. Muhammed Mekky
          </p>
        </div>
      </div>
    </div>
  )
}
