"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { ChevronRight, ChevronLeft, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar"

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: LucideIcon
    }[]
  }[]
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { isRTL } = useLanguage()
  const pathname = usePathname()

  // Initialize with smart default open state
  const defaultOpenState = items.reduce(
    (acc, item) => {
      // Open sections that contain the current page
      const hasActiveChild = item.items?.some(subItem => 
        pathname === subItem.url || pathname.startsWith(subItem.url + "/")
      )
      return {
        ...acc,
        [item.title]: hasActiveChild || !item.items // Always open items without children
      }
    },
    {} as Record<string, boolean>
  )

  const [openItems, setOpenItems] = useLocalStorage(
    "sidebar-open-items",
    defaultOpenState
  )

  // Handle open/close state changes
  const handleOpenChange = (itemTitle: string, isOpen: boolean) => {
    setOpenItems(prev => ({ ...prev, [itemTitle]: isOpen }))
  }

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  // Check if a navigation item is active
  const isItemActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname === url || pathname.startsWith(url + "/")
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            {/* Items without children - direct links */}
            {!item.items || item.items.length === 0 ? (
              <SidebarMenuButton 
                asChild 
                isActive={isItemActive(item.url)}
                tooltip={item.title}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            ) : (
              /* Items with children - collapsible sections */
              <>
                {isCollapsed ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="data-[state=open]:bg-accent"
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side={isRTL ? "left" : "right"}
                      align="start"
                      className="w-64 p-2"
                      sideOffset={12}
                    >
                      <div className={`flex items-center gap-2 px-2 py-1.5 text-sm font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </div>
                      <DropdownMenuSeparator className="my-1" />
                      {item.items.map(subItem => (
                        <DropdownMenuItem key={subItem.title} asChild>
                          <Link
                            href={subItem.url}
                            className={`hover:bg-accent flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm ${isRTL ? 'flex-row-reverse' : ''} ${
                              isItemActive(subItem.url) ? 'bg-accent font-medium' : ''
                            }`}
                          >
                            {subItem.icon ? (
                              <subItem.icon className="h-4 w-4" />
                            ) : (
                              <div className="bg-muted-foreground/50 h-1.5 w-1.5 rounded-full" />
                            )}
                            {subItem.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Collapsible
                    asChild
                    open={openItems[item.title] ?? true}
                    onOpenChange={isOpen => handleOpenChange(item.title, isOpen)}
                    className="group/collapsible"
                  >
                    <div>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          className="hover:bg-accent/50"
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronIcon className={`${isRTL ? 'mr-auto' : 'ml-auto'} transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={isItemActive(subItem.url)}
                              >
                                <Link href={subItem.url}>
                                  {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                )}
              </>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
