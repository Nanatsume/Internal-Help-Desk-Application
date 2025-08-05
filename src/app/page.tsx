'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  BookOpen, 
  Plus, 
  List, 
  BarChart3, 
  Users, 
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const userActions = [
    {
      title: 'Browse Knowledge Base',
      description: 'Search for answers and documentation',
      icon: BookOpen,
      href: '/knowledge-base',
      color: 'bg-blue-500'
    },
    {
      title: 'Create New Ticket',
      description: 'Report an issue or request support',
      icon: Plus,
      href: '/tickets/new',
      color: 'bg-green-500'
    },
    {
      title: 'My Tickets',
      description: 'View and track your support requests',
      icon: List,
      href: '/tickets',
      color: 'bg-purple-500'
    }
  ]

  const adminActions = [
    {
      title: 'Ticket Management',
      description: 'Manage all support tickets',
      icon: FileText,
      href: '/admin/tickets',
      color: 'bg-orange-500'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View system statistics and metrics',
      icon: BarChart3,
      href: '/admin',
      color: 'bg-indigo-500'
    },
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Internal Help Desk System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            ระบบช่วยเหลือภายในบริษัทที่ครอบคลุม Knowledge Base, การจัดการ Tickets 
            และ Dashboard สำหรับทีม IT Support
          </p>
          {session && (
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ยินดีต้อนรับ, {session.user?.name}
              </h3>
              <p className="text-gray-600 mb-4">
                สิทธิ์การใช้งาน: {isAdmin ? 'ผู้ดูแลระบบ' : 'พนักงานทั่วไป'}
              </p>
              {isAdmin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-700 text-sm">
                    คุณมีสิทธิ์เข้าถึง Admin Dashboard และจัดการระบบ
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features for Users */}
        {session && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {isAdmin ? 'เครื่องมือสำหรับผู้ใช้ทั่วไป' : 'เครื่องมือที่พร้อมใช้'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {userActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600">
                      {action.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Admin Features */}
        {session && isAdmin && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              เครื่องมือสำหรับผู้ดูแลระบบ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {adminActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600">
                      {action.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Welcome Message for Non-logged in Users */}
        {!session && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ยินดีต้อนรับสู่ระบบ Help Desk
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              เข้าสู่ระบบเพื่อใช้งานฟีเจอร์ทั้งหมด รวมถึงการสร้าง Ticket, ค้นหา Knowledge Base, และติดตามสถานะ
            </p>
            <Link 
              href="/auth/signin"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        {session && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              ข้อมูลเบื้องต้น
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Knowledge Base</h4>
                <p className="text-sm text-gray-600">ค้นหาคำตอบได้ทันที</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Ticket System</h4>
                <p className="text-sm text-gray-600">จัดการปัญหาอย่างเป็นระบบ</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Real-time Tracking</h4>
                <p className="text-sm text-gray-600">ติดตามสถานะแบบ Real-time</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Analytics</h4>
                <p className="text-sm text-gray-600">วิเคราะห์และรายงาน</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}