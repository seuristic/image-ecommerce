import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectToDatabase from './db'
import User from '@/models/User.model'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'password'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        try {
          await connectToDatabase()

          const user = await User.findOne({ email: credentials.email })

          if (!user) {
            throw new Error('No user found with this email')
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValid) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role
          }
        } catch (error) {
          console.error('Error(auth):', error)
          throw error
        }
      }
    })
  ],
  callbacks: {
    // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client).
    // The returned value will be encrypted, and it is stored in a cookie.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      return token
    },

    // The session callback is called whenever a session is checked.
    // By default, only a subset of the token is returned for increased security.
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string

      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
}
