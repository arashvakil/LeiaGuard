"use client"

import { 
  Settings2, 
  User, 
  LayoutDashboard, 
  Smartphone, 
  Shield,
  Plus,
  type LucideIcon 
} from "lucide-react"
import * as React from "react"
import { useSession } from "next-auth/react"
import { useLanguage } from "@/lib/language-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"
import { NavMain } from "../_components/nav-main"
import { NavUser } from "../_components/nav-user"

export function AppSidebar({
  userData,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userData: {
    name: string
    email: string
    avatar: string
    membership: string
  }
}) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin
  const { t, isRTL } = useLanguage()

  // Main navigation items - organized by user priority and workflow
  const navMain: {
    title: string
    url: string
    icon?: LucideIcon
    items?: { title: string; url: string; icon?: LucideIcon }[]
  }[] = [
    // Core functionality - always visible
    {
      title: t.nav.dashboard,
      url: "/dashboard",
      icon: LayoutDashboard
    },
    {
      title: t.nav.myDevices,
      url: "#",
      icon: Smartphone,
      items: [
        {
          title: t.nav.allDevices,
          url: "/dashboard",
          icon: Smartphone
        },
        {
          title: t.nav.addDevice,
          url: "/dashboard/devices/new",
          icon: Plus
        }
      ]
    },
    // User account
    {
      title: t.nav.account,
      url: "/dashboard/account",
      icon: User
    }
  ]

  // Admin section - only for admin users
  if (isAdmin) {
    navMain.push({
      title: "Administration",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Admin Dashboard",
          url: "/dashboard/admin",
          icon: LayoutDashboard
        },
        {
          title: "User Management",
          url: "/dashboard/admin/users",
          icon: User
        }
      ]
    })
  }

  return (
    <Sidebar collapsible="icon" side={isRTL ? "right" : "left"} {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
