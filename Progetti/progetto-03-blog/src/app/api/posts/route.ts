import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, categoryId, tagIds, published } = body

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        published,
        publishedAt: published ? new Date() : null,
        categoryId,
        authorId: (session.user as any).id,
        tags: { connect: tagIds.map((id: string) => ({ id })) },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
