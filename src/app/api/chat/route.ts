import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json()
  if (!message || !sessionId)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (!webhookUrl) throw new Error('N8N_WEBHOOK_URL is not set')
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatInput: message, sessionId }),
    })
    if (!res.ok) throw new Error(`n8n ${res.status}`)
    const text = await res.text()
    if (!text) throw new Error('empty response from n8n')
    let output: string
    try {
      const data = JSON.parse(text)
      output = data.output ?? data.text ?? data.message ?? data.response ?? JSON.stringify(data)
    } catch {
      output = text
    }
    return NextResponse.json({ output })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[chat]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
