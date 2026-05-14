"use client"

import * as React from "react"

import { NavMain } from "~/components/nav-main"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerTerminalIcon,
  RoboticIcon,
  BookOpen02Icon,
  Settings05Icon,
  CommandIcon,
} from "@hugeicons/core-free-icons"
import { NavDashboard } from "./nav-dashboard"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navDashboard: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />,
      isActive: true,
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />,
      isActive: true,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon
                    icon={CommandIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">AquaGuard</span>
                  <span className="truncate text-xs">Monitoring</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavDashboard items={data.navDashboard} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
