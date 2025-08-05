'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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

export default function AdminTickets() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }

    fetchTickets()
  }, [session, status, router])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/admin/tickets')
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

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchTickets()
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status })
        }
      }
    } catch (error) {
      console.error('Error updating ticket status:', error)
    }
  }

  const addReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return

    setIsReplying(true)
    try {
      const response = await fetch(`/api/admin/tickets/${selectedTicket.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent })
      })

      if (response.ok) {
        const newComment = await response.json()
        setSelectedTicket({
          ...selectedTicket,
          comments: [...selectedTicket.comments, newComment]
        })
        setReplyContent('')
        fetchTickets()
      }
    } catch (error) {
      console.error('Error adding reply:', error)
    } finally {
      setIsReplying(false)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">จัดการ Tickets</h1>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              กลับ Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tickets List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tickets ({tickets.length})
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`cursor-pointer p-4 border rounded-lg hover:bg-gray-50 ${
                        selectedTicket?.id === ticket.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {ticket.title}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        โดย {ticket.user.name}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString('th-TH')}
                        </span>
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
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedTicket.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        โดย {selectedTicket.user.name} ({selectedTicket.user.email})
                      </p>
                      <p className="text-xs text-gray-500">
                        สร้างเมื่อ {new Date(selectedTicket.createdAt).toLocaleString('th-TH')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      เปลี่ยนสถานะ:
                    </label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>

                  {/* Ticket Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">รายละเอียดปัญหา</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {selectedTicket.description}
                      </p>
                    </div>
                  </div>

                  {/* Attachments */}
                  {selectedTicket.attachments.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">ไฟล์แนบ</h3>
                      <div className="space-y-2">
                        {selectedTicket.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{attachment.filename}</span>
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

                  {/* Comments */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">การตอบกลับ</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
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
                  </div>

                  {/* Reply Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ตอบกลับ:
                    </label>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="พิมพ์การตอบกลับ..."
                    />
                    <button
                      onClick={addReply}
                      disabled={isReplying || !replyContent.trim()}
                      className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isReplying ? 'กำลังส่ง...' : 'ส่งการตอบกลับ'}
                    </button>
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
      </div>
    </div>
  )
}
