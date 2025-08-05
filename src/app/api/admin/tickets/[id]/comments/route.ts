import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await request.json()
    
    const comment = await prisma.comment.create({
      data: {
        content,
        ticketId: params.id,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(comment)

  } catch (error) {
    console.error('Comment API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
