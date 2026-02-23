'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react'
import { Message } from '@/lib/types'

function isArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text)
}

function BotAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-green-500/30 flex-shrink-0 flex items-center justify-center p-1.5" style={{ boxShadow: '0 0 12px rgba(34,197,94,0.15)' }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M 65 35 C 65 50, 55 60, 45 60 C 35 60, 30 55, 28 48 L 32 38 C 42 32, 55 35, 65 35 Z" fill="#22c55e"/>
      </svg>
    </div>
  )
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

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 mb-6">
        <div
          dir={arabic ? 'rtl' : 'ltr'}
          className="max-w-[80%] px-5 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed text-white font-cairo"
          style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', boxShadow: '0 4px 15px rgba(22,163,74,0.2)', border: '1px solid rgba(74,222,128,0.15)' }}
        >
          {msg.content}
        </div>
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', boxShadow: '0 4px 15px rgba(22,163,74,0.2)' }}>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-3 mb-6">
      <BotAvatar />
      <div className="max-w-[85%] w-full">
        <div
          dir={arabic ? 'rtl' : 'ltr'}
          className="px-5 py-4 rounded-2xl rounded-tl-sm text-sm leading-relaxed text-zinc-200"
          style={{ background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(63,63,70,0.6)' }}
        >
          <div className={`ai-message-content ${arabic ? 'font-cairo' : ''}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isBlock = !!match
                  if (isBlock) {
                    return <CodeBlock lang={match![1]}>{String(children)}</CodeBlock>
                  }
                  return <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-green-400 text-xs font-mono" {...props}>{children}</code>
                },
                pre({ children }) { return <>{children}</> },
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 mt-4 pt-3 border-t border-zinc-800/60" dir="ltr">
            <button onClick={copy} className="action-btn p-1.5 rounded-md" title="نسخ الرد">
              {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
            </button>
            <button className="action-btn p-1.5 rounded-md" title="إعادة التوليد">
              <RotateCcw size={15} />
            </button>
            <div className="flex-1" />
            <button className="action-btn p-1.5 rounded-md" title="تقييم إيجابي"><ThumbsUp size={15} /></button>
            <button className="action-btn p-1.5 rounded-md" title="تقييم سلبي"><ThumbsDown size={15} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CodeBlock({ lang, children }: { lang: string; children: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="rounded-xl overflow-hidden my-3 border border-zinc-800" style={{ background: '#050505' }} dir="ltr">
      <div className="flex justify-between items-center px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xs text-zinc-400 uppercase font-semibold tracking-wider font-mono">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
          {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">{children}</pre>
    </div>
  )
}
