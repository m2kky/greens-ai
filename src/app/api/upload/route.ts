import { NextRequest, NextResponse } from 'next/server'

const N8N_FORM_URL = `${process.env.N8N_BASE_URL || 'https://n8n.muhammedmekky.com'}/form/f923c5a1-9d3f-4b7e-8900-0b84f2df2861`

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const res = await fetch(N8N_FORM_URL, { method: 'POST', body: form })
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status })
  return NextResponse.json({ success: true })
}
