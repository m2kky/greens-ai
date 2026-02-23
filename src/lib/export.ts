import { Chat, Message } from './types'

export type ExportFormat = 'pdf' | 'md' | 'docx'

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="120" height="120">
  <path d="M 210 80 C 210 130, 180 165, 150 165 C 120 165, 100 150, 90 135 L 70 155 L 80 120 C 70 95, 85 65, 115 55 C 155 40, 190 55, 210 80 Z" fill="#22C55E"/>
  <circle cx="120" cy="110" r="5" fill="#ffffff"/>
  <circle cx="145" cy="110" r="5" fill="#ffffff"/>
  <circle cx="170" cy="110" r="5" fill="#ffffff"/>
  <text x="150" y="240" font-family="Inter, sans-serif" text-anchor="middle">
    <tspan font-size="32" font-weight="700" fill="#059669">Greens</tspan>
    <tspan font-size="24" font-weight="400" fill="#10B981" dx="6">AI</tspan>
  </text>
</svg>`

function svgToDataUrl(svg: string): string {
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
}

function formatMessages(messages: Message[]): string {
  return messages
    .map(m => {
      const role = m.role === 'user' ? '👤 المستخدم' : '🌿 Greens AI'
      const time = new Date(m.timestamp).toLocaleString('ar-EG')
      return `**${role}** — ${time}\n\n${m.content}`
    })
    .join('\n\n---\n\n')
}

export async function exportToMD(title: string, messages: Message[]): Promise<void> {
  const content = `# ${title}\n\n_تصدير من Greens AI_\n\n---\n\n${formatMessages(messages)}`
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, `${title}.md`)
}

export async function exportToPDF(title: string, messages: Message[]): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const html2canvas = (await import('html2canvas')).default

  // Build an off-screen HTML div with proper Arabic font
  const container = document.createElement('div')
  container.style.cssText = [
    'position:fixed', 'left:-9999px', 'top:0',
    'width:794px', 'background:#fff', 'padding:40px',
    'font-family:Cairo,Tajawal,Arial,sans-serif',
    'font-size:13px', 'color:#1a1a1a', 'line-height:1.8',
  ].join(';')

  const logoUrl = svgToDataUrl(LOGO_SVG)
  container.innerHTML = `
    <div style="text-align:center;margin-bottom:24px">
      <img src="${logoUrl}" width="80" height="80" style="display:inline-block" />
    </div>
    <h2 style="text-align:center;color:#059669;font-size:18px;margin-bottom:4px">${title}</h2>
    <p style="text-align:center;color:#888;font-size:11px;margin-bottom:28px">Greens AI — تصدير المحادثة</p>
    ${messages.map(m => {
      const isUser = m.role === 'user'
      const label = isUser ? '👤 المستخدم' : '🌿 Greens AI'
      const time = new Date(m.timestamp).toLocaleString('ar-EG')
      const color = isUser ? '#16a34a' : '#059669'
      const dir = /[\u0600-\u06FF]/.test(m.content) ? 'rtl' : 'ltr'
      return `
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #e5e7eb">
          <div style="font-size:11px;color:${color};font-weight:700;margin-bottom:6px">${label} — ${time}</div>
          <div style="direction:${dir};white-space:pre-wrap;word-break:break-word">${m.content.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
        </div>`
    }).join('')}
  `
  document.body.appendChild(container)

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = pdf.internal.pageSize.getHeight()
    const ratio = pdfW / canvas.width
    const totalH = canvas.height * ratio
    let srcY = 0
    let remaining = totalH
    while (remaining > 0) {
      const sliceH = Math.min(pdfH, remaining)
      pdf.addImage(imgData, 'PNG', 0, -(srcY), pdfW, totalH)
      remaining -= sliceH
      srcY += sliceH
      if (remaining > 0) pdf.addPage()
    }
    pdf.save(`${title}.pdf`)
  } finally {
    document.body.removeChild(container)
  }
}

export async function exportToDOCX(title: string, messages: Message[]): Promise<void> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx')

  const children: any[] = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Greens AI — تصدير المحادثة', color: '059669', size: 20 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
  ]

  for (const msg of messages) {
    const isUser = msg.role === 'user'
    const label = isUser ? '👤 المستخدم' : '🌿 Greens AI'
    const time = new Date(msg.timestamp).toLocaleString('ar-EG')
    const color = isUser ? '16A34A' : '059669'

    children.push(
      new Paragraph({
        children: [new TextRun({ text: `${label} — ${time}`, bold: true, color, size: 18 })],
        spacing: { before: 300, after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: msg.content, size: 20 })],
        spacing: { after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' } },
      })
    )
  }

  const doc = new Document({ sections: [{ children }] })
  const blob = await Packer.toBlob(doc)
  downloadBlob(blob, `${title}.docx`)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function runExport(
  format: ExportFormat,
  title: string,
  messages: Message[]
): Promise<void> {
  const safe = title.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 60)
  if (format === 'md') return exportToMD(safe, messages)
  if (format === 'pdf') return exportToPDF(safe, messages)
  if (format === 'docx') return exportToDOCX(safe, messages)
}
