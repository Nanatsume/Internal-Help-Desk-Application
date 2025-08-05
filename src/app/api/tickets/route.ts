import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority as any,
        userId: session.user.id
      }
    })

    // Handle file uploads
    const files = formData.getAll('files') as File[]
    const uploadDir = path.join(process.cwd(), 'uploads')
    
    // Create uploads directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    for (const file of files) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Create unique filename
        const timestamp = Date.now()
        const filename = `${timestamp}-${file.name}`
        const filepath = path.join(uploadDir, filename)
        
        await writeFile(filepath, buffer)
        
        // Save attachment record
        await prisma.attachment.create({
          data: {
            filename: file.name,
            filepath: filename,
            mimetype: file.type,
            size: file.size,
            ticketId: ticket.id
          }
        })
      }
    }

    return NextResponse.json(ticket)

  } catch (error) {
    console.error('Ticket creation API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        attachments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tickets)

  } catch (error) {
    console.error('Tickets API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
