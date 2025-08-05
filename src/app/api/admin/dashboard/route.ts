import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get ticket statistics
    const [totalTickets, openTickets, inProgressTickets, resolvedTickets] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: 'OPEN' } }),
      prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.ticket.count({ where: { status: 'RESOLVED' } })
    ])

    // Get other statistics
    const [totalUsers, totalArticles] = await Promise.all([
      prisma.user.count(),
      prisma.article.count({ where: { published: true } })
    ])

    // Get popular articles
    const popularArticles = await prisma.article.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        views: true
      },
      orderBy: { views: 'desc' },
      take: 5
    })

    // Get recent tickets
    const recentTickets = await prisma.ticket.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return NextResponse.json({
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      totalUsers,
      totalArticles,
      popularArticles,
      recentTickets
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
