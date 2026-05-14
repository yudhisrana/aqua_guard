import { useLocation } from "react-router"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

export function NavDashboard({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    isActive?: boolean
  }[]
}) {
  const location = useLocation()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.isActive ?? location.pathname === item.url
          return (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
              >
                <a href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
