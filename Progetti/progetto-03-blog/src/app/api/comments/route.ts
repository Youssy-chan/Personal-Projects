import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { postId, authorName, authorEmail, content } = body

    if (!postId || !authorName || !authorEmail || !content) {
      return NextResponse.json({ error: 'Tutti i campi sono obbligatori' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorName,
        authorEmail,
        content,
        approved: false,
      },
    })

    return NextResponse.json({ success: true, comment }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
