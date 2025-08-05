'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { 
  Home, 
  BookOpen, 
  Plus, 
  List, 
  Settings, 
  User, 
  LogIn, 
  LogOut 
} from 'lucide-react'

export function Navbar() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Help Desk
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/knowledge-base" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Knowledge Base</span>
            </Link>
            
            {session && (
              <>
                <Link 
                  href="/tickets/new" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Ticket</span>
                </Link>
                
                <Link 
                  href="/tickets" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <List className="h-4 w-4" />
                  <span>My Tickets</span>
                </Link>
                
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {session.user?.name}
                  </span>
                  {isAdmin && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
