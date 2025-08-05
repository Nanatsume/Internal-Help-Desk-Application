import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readFile } from 'fs/promises'
import path from 'path'

interface Params {
  params: {
    filename: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const filename = params.filename
    const filepath = path.join(process.cwd(), 'uploads', filename)
    
    try {
      const file = await readFile(filepath)
      
      // Get file extension to determine content type
      const ext = path.extname(filename).toLowerCase()
      let contentType = 'application/octet-stream'
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg'
          break
        case '.png':
          contentType = 'image/png'
          break
        case '.gif':
          contentType = 'image/gif'
          break
        case '.pdf':
          contentType = 'application/pdf'
          break
        case '.doc':
          contentType = 'application/msword'
          break
        case '.docx':
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          break
        case '.txt':
          contentType = 'text/plain'
          break
      }

      return new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename.split('-').slice(1).join('-')}"`,
        },
      })
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

  } catch (error) {
    console.error('File download API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
