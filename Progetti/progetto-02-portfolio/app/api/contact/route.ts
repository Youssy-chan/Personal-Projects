import { NextRequest, NextResponse } from 'next/server'

// ── Rate-limit semplice in-memory ──────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3   // max 3 invii
const WINDOW_MS = 60 * 60 * 1000  // per ora

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

// ── Handler ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Troppe richieste. Riprova tra un\'ora.' },
        { status: 429 }
      )
    }

    // Parse body
    const body = await req.json()
    const { name, email, subject, message } = body

    // Validation
    if (!name?.trim() || name.trim().length < 2) {
      return NextResponse.json({ error: 'Nome non valido' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
    }
    if (!subject?.trim()) {
      return NextResponse.json({ error: 'Oggetto mancante' }, { status: 400 })
    }
    if (!message?.trim() || message.trim().length < 10) {
      return NextResponse.json({ error: 'Messaggio troppo breve' }, { status: 400 })
    }

    // ── Email sending ──────────────────────────────────
    // Opzione A: Resend (consigliato per produzione)
    // Richiede RESEND_API_KEY in .env.local
    
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', // Usiamo onboarding di default finché non configuri un dominio su Resend
      to: ['yousselji03@gmail.com'],
      subject: `[Portfolio] ${subject} — da ${name}`,
      html: `
        <h2>Nuovo messaggio dal portfolio</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Oggetto:</strong> ${subject}</p>
        <p><strong>Messaggio:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    // ── In sviluppo: log in console ────────────────────
    console.log('[Contact Form]', { name, email, subject, message: message.slice(0, 100) })

    // Simula un piccolo delay
    await new Promise((r) => setTimeout(r, 500))

    return NextResponse.json(
      { success: true, message: 'Messaggio inviato con successo!' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[Contact API Error]', err)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// Disabilita GET su questa route
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
