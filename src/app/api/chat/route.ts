import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json()
  if (!message || !sessionId)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  try {
    const res = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatInput: message, sessionId }),
    })
    if (!res.ok) throw new Error(`n8n ${res.status}`)
    const text = await res.text()
    if (!text) throw new Error('empty response from n8n')
    const data = JSON.parse(text)
    const output = data.output ?? data.text ?? data.message ?? data.response ?? JSON.stringify(data)
    return NextResponse.json({ output })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    )
  }
}
