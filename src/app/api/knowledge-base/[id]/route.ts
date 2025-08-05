import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const article = await prisma.article.findUnique({
      where: { 
        id: params.id,
        published: true
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Increment view count
    await prisma.article.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json(article)

  } catch (error) {
    console.error('Article API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
