import { v4 as uuidv4 } from 'uuid'
import { Chat, Message } from './types'

const KEY = 'greens_chats'
const MAX = 50

export function loadChats(): Chat[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function saveChats(chats: Chat[]) {
  localStorage.setItem(KEY, JSON.stringify(chats.slice(-MAX)))
}

export function createChat(firstMessage: string): Chat {
  return {
    id: uuidv4(),
    title: firstMessage.slice(0, 30),
    createdAt: new Date().toISOString(),
    messages: [],
  }
}

export function addMessage(chats: Chat[], chatId: string, msg: Message): Chat[] {
  return chats.map(c => c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c)
}

export function deleteChat(chats: Chat[], chatId: string): Chat[] {
  return chats.filter(c => c.id !== chatId)
}
