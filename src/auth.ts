import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import NextAuth from "next-auth"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import type { DefaultSession, NextAuthConfig } from "next-auth"
import type { AdapterUser } from "@auth/core/adapters"
import { z } from "zod"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: string
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const validatedFields = loginSchema.safeParse(credentials)
        if (!validatedFields.success) {
          throw new Error("Invalid credentials")
        }

        const { email, password } = validatedFields.data

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          throw new Error("User not found")
        }

        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "USER" | "ADMIN",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role as "USER" | "ADMIN"
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as "USER" | "ADMIN"
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig) 