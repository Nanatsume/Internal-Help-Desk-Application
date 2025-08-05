'use client'
import { SessionProvider, useSession } from "next-auth/react"
import { Navbar } from "./Navbar"

function AppContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  
  // Don't show navbar on sign-in page
  const isSignInPage = typeof window !== 'undefined' && window.location.pathname === '/auth/signin'
  
  return (
    <>
      {!isSignInPage && <Navbar />}
      <main className={`${!isSignInPage ? 'container mx-auto px-4 py-8' : ''}`}>
        {children}
      </main>
    </>
  )
}

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppContent>
        {children}
      </AppContent>
    </SessionProvider>
  )
}
