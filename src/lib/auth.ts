import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function checkRole(allowedRoles: string[]) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/")
  }
} 