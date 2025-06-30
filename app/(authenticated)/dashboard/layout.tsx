import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardClientLayout from "./_components/layout-client"

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userData = {
    name: session.user.username || "User",
    email: session.user.username + "@vpn.local", // Mock email since we don't collect emails
    avatar: "", // No avatar system
    membership: session.user.isAdmin ? "admin" : "user"
  }

  return (
    <DashboardClientLayout userData={userData}>
      {children}
    </DashboardClientLayout>
  )
}
