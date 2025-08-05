import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        role: { label: 'Role', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        
        // For demo purposes - in production use proper password hashing
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user && credentials.name) {
          // Create new user if doesn't exist (for demo)
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name,
              role: credentials.role === 'ADMIN' ? 'ADMIN' : 'USER'
            }
          })
        }
        
        return user ? {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        } : null
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt'
  }
}
