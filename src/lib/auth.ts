import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Email/Password credentials
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            tenant: true
          }
        })

        if (!user || !user.password) {
          throw new Error('Usuário não encontrado')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password, 
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Senha incorreta')
        }

        if (!user.isActive) {
          throw new Error('Usuário desativado')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
          tenant: user.tenant,
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
    signUp: '/cadastro',
    error: '/login?error=true',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.role = user.role
        token.tenantId = user.tenantId
        token.isActive = user.isActive
      }

      // OAuth sign in - check if user has tenant
      if (account?.provider === 'google' && user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { tenant: true }
        })

        if (dbUser) {
          token.role = dbUser.role
          token.tenantId = dbUser.tenantId
          token.isActive = dbUser.isActive
        } else {
          // New OAuth user - will need onboarding
          token.needsOnboarding = true
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string
        session.user.isActive = token.isActive as boolean
        session.user.needsOnboarding = token.needsOnboarding as boolean
      }

      return session
    },

    async signIn({ user, account, profile }) {
      // Allow credentials login
      if (account?.provider === 'credentials') {
        return true
      }

      // Handle OAuth sign in
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        // If user doesn't exist, create them but mark for onboarding
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || profile?.name || 'Usuário',
              image: user.image || profile?.picture,
              emailVerified: new Date(),
              // tenantId will be null until onboarding
            }
          })
        }

        return true
      }

      return false
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`)
    },
    async signOut({ session }) {
      console.log(`User signed out: ${session?.user?.email}`)
    }
  },

  debug: process.env.NODE_ENV === 'development',
}