'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check } from 'lucide-react'
import { Message } from '@/lib/types'

function isArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text)
}

export default function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'
  const arabic = isArabic(msg.content)

  const copy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-sm shrink-0 mr-2">
          🌿
        </div>
      )}
      <div className={`relative group max-w-[75%] ${isUser ? 'order-1' : ''}`}>
        <div
          dir={arabic ? 'rtl' : 'ltr'}
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-green-600 text-white rounded-br-sm'
              : 'bg-[#1a1a1a] border border-gray-800 text-gray-200 rounded-bl-sm'
          } ${arabic ? 'font-cairo text-right' : 'font-inter'}`}
        >
          {isUser ? (
            <p>{msg.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>
        {!isUser && (
          <button
            onClick={copy}
            className="absolute -bottom-6 left-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-gray-500 hover:text-gray-300"
          >
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          </button>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm shrink-0 ml-2">
          👤
        </div>
      )}
    </div>
  )
}
