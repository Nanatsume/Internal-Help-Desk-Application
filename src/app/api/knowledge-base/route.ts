import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    let where: any = {
      published: true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        category: true,
        tags: true,
        views: true,
        createdAt: true,
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(articles)

  } catch (error) {
    console.error('Knowledge base API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
