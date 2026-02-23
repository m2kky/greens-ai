'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, MicOff } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import MessageBubble from '@/components/MessageBubble'
import AgentPanel from '@/components/AgentPanel'
import ExportMenu from '@/components/ExportMenu'
import ExportToast from '@/components/ExportToast'
import { Chat, Message } from '@/lib/types'
import { loadChats, saveChats, createChat, addMessage, deleteChat } from '@/lib/storage'
import { ExportFormat } from '@/lib/export'

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatExporting, setChatExporting] = useState<ExportFormat | null>(null)
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

  const handleChatExporting = (fmt: ExportFormat | null) => setChatExporting(fmt)

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

  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const toggleVoice = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const rec = new SR()
    rec.lang = 'ar-SA'
    rec.interimResults = false
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInput(prev => prev + transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    rec.start()
    recognitionRef.current = rec
    setListening(true)
  }, [listening])

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
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]" dir="ltr">
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
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/50 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400"
          >
            ☰
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-zinc-950 border border-green-500/30 flex items-center justify-center p-1.5" style={{boxShadow:'0 0 12px rgba(34,197,94,0.15)'}}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M 65 35 C 65 50, 55 60, 45 60 C 35 60, 30 55, 28 48 L 32 38 C 42 32, 55 35, 65 35 Z" fill="#22c55e"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">Greens AI</h1>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                متصل
              </p>
            </div>
          </div>
          <div className="ml-auto">
            <ExportMenu
              title={activeChat?.title ?? 'محادثة'}
              messages={activeChat?.messages ?? []}
              onExporting={handleChatExporting}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {!activeChat || activeChat.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 w-full max-w-lg"
              >
                <div>
                  <img src="/logo.svg" alt="Greens AI" className="h-40 w-auto mx-auto mb-4" />
                  <p className="text-zinc-400 text-sm font-cairo">مساعد تسويق المكملات الغذائية</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'اكتب إعلان لمنتج ماتشا للتركيز والطاقة',
                    'حلل منتج Omega-3 وأبرز فوائده التسويقية',
                    'اقترح زوايا إعلانية لمكمل الكولاجين',
                    'اكتب كابشن انستغرام لمنتج بروتين واي',
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="text-right px-4 py-3 rounded-xl border border-zinc-800 hover:border-green-500/30 hover:bg-green-500/5 text-zinc-400 hover:text-zinc-200 text-sm font-cairo transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
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
        <div className="px-4 pb-6 pt-2 bg-gradient-to-t from-zinc-950 to-transparent">
          <div className="max-w-3xl mx-auto">
            <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700/60 rounded-2xl shadow-2xl p-2 focus-within:border-green-500/50 focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالتك هنا..."
                rows={1}
                dir="auto"
                className="w-full bg-transparent resize-none outline-none text-white placeholder-zinc-500 text-sm px-3 py-3 font-cairo max-h-32"
                style={{ minHeight: '52px' }}
              />
              <div className="flex justify-between items-center px-2 pb-1 pt-2 border-t border-zinc-800/50">
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleVoice}
                    className={`p-2 rounded-lg transition-colors ${
                      listening
                        ? 'text-red-400 bg-red-500/10 animate-pulse'
                        : 'text-zinc-400 hover:text-green-400 hover:bg-zinc-800'
                    }`}
                    title="إدخال صوتي"
                  >
                    {listening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 flex items-center gap-2 transition-all text-sm font-medium shadow-lg shadow-green-900/20"
                >
                  <span>إرسال</span>
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExportToast exporting={chatExporting} />
    </div>
  )
}
