import { checkRole } from "@/lib/auth"

export default async function AdminPage() {
  await checkRole(["ADMIN"])
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Only admins can see this page</p>
    </div>
  )
} 