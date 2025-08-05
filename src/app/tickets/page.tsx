'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  PlusIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'

interface Ticket {
  id: string
  title: string
  description: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
  }
  comments: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      name: string
    }
  }>
  attachments: Array<{
    id: string
    filename: string
    filepath: string
  }>
}

export default function MyTickets() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchTickets()
  }, [session, status, router])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800'
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800'
      case 'RESOLVED': return 'bg-green-100 text-green-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-200 text-red-900'
      case 'HIGH': return 'bg-orange-200 text-orange-900'
      case 'MEDIUM': return 'bg-yellow-200 text-yellow-900'
      case 'LOW': return 'bg-green-200 text-green-900'
      default: return 'bg-gray-200 text-gray-900'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return 'เปิด'
      case 'IN_PROGRESS': return 'กำลังดำเนินการ'
      case 'RESOLVED': return 'แก้ไขแล้ว'
      case 'CLOSED': return 'ปิด'
      default: return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'เร่งด่วน'
      case 'HIGH': return 'สูง'
      case 'MEDIUM': return 'ปานกลาง'
      case 'LOW': return 'ต่ำ'
      default: return priority
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tickets ของฉัน
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              ติดตามสถานะการแจ้งปัญหาและคำขอความช่วยเหลือ
            </p>
          </div>
          <Link
            href="/tickets/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            สร้าง Ticket ใหม่
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ClockIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ยังไม่มี Tickets
            </h3>
            <p className="text-gray-500 mb-6">
              เริ่มต้นโดยการสร้าง Ticket แรกของคุณ
            </p>
            <Link
              href="/tickets/new"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
            >
              สร้าง Ticket ใหม่
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    รายการ Tickets ({tickets.length})
                  </h3>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                          selectedTicket?.id === ticket.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {ticket.title}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {getStatusText(ticket.status)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {getPriorityText(ticket.priority)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString('th-TH')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-3">
                            {ticket.comments.length > 0 && (
                              <div className="flex items-center">
                                <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                                {ticket.comments.length}
                              </div>
                            )}
                            {ticket.attachments.length > 0 && (
                              <div className="flex items-center">
                                <PaperClipIcon className="h-3 w-3 mr-1" />
                                {ticket.attachments.length}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="lg:col-span-2">
              {selectedTicket ? (
                <div className="bg-white shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {selectedTicket.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>สร้างเมื่อ {new Date(selectedTicket.createdAt).toLocaleString('th-TH')}</span>
                          {selectedTicket.updatedAt !== selectedTicket.createdAt && (
                            <span>อัปเดตล่าสุด {new Date(selectedTicket.updatedAt).toLocaleString('th-TH')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                          {getStatusText(selectedTicket.status)}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                          {getPriorityText(selectedTicket.priority)}
                        </span>
                      </div>
                    </div>

                    {/* Ticket Description */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        รายละเอียดปัญหา
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {selectedTicket.description}
                        </p>
                      </div>
                    </div>

                    {/* Attachments */}
                    {selectedTicket.attachments.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          ไฟล์แนบ
                        </h3>
                        <div className="space-y-2">
                          {selectedTicket.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center">
                                <PaperClipIcon className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{attachment.filename}</span>
                              </div>
                              <a
                                href={`/api/uploads/${attachment.filepath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 text-sm"
                              >
                                ดาวน์โหลด
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comments/Replies */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        การตอบกลับ ({selectedTicket.comments.length})
                      </h3>
                      
                      {selectedTicket.comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          ยังไม่มีการตอบกลับ
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedTicket.comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-gray-900">
                                  {comment.user.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.createdAt).toLocaleString('th-TH')}
                                </span>
                              </div>
                              <p className="text-gray-800 whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg">
                  <div className="p-6 text-center text-gray-500">
                    เลือก Ticket เพื่อดูรายละเอียด
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
