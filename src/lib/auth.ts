import { NextAuthOptions } from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from './db'
import GitHubProvider from "next-auth/providers/github";
import { fetchRedis } from '@/helpers/redis'

export function getGithubCredentials() {
  const clientId = process.env.GITHUB_ID
  const clientSecret = process.env.GITHUB_SECRET
  const accessToken = process.env.GITHUB_ACCESS_TOKEN

  if (!clientId || clientId.length === 0) {
    throw new Error('Missing Github_CLIENT_ID')
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('Missing Github_CLIENT_SECRET')
  }

  if (!accessToken || accessToken.length === 0) {
    throw new Error('Missing Github_CLIENT_SECRET')
  }

  return { clientId, clientSecret, accessToken }
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },
  providers: [
    GitHubProvider({
      clientId: getGithubCredentials().clientId,
      clientSecret: getGithubCredentials().clientSecret
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
        | string
        | null
      if (!dbUserResult) {
        if (user) {
          token.id = user!.id
        }

        return token
      }

      const dbUser = JSON.parse(dbUserResult) as User

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    redirect() {
      return '/dashboard'
    },
  },
}
