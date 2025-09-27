"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Dumbbell,
  BarChart3,
  Mic,
  Apple,
  BookOpen,
  Target,
} from "lucide-react"
import { useUser, UserButton } from "@clerk/nextjs"

const iconMap = {
  Apple,
  Dumbbell,
  BookOpen,
  BarChart3,
  Target,
}

const navItems = [
  { name: "Nutrition", icon: "Apple", href: "/nutrition" },
  { name: "Fitness", icon: "Dumbbell", href: "/fitness" },
  { name: "Daily Diary", icon: "BookOpen", href: "/diary" },
  { name: "Progress", icon: "BarChart3", href: "/progress" },
  { name: "Long Term Vision", icon: "Target", href: "/vision" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoaded } = useUser()

  const startVoiceChat = () => {
    router.push('/chatbot')
  }


  return (
    <Sidebar>
      <SidebarHeader>
        {/* User Profile with Clerk UserButton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-12 w-12",
                  userButtonPopoverCard: "shadow-lg border",
                  userButtonPopoverActions: "gap-2",
                  userButtonPopoverActionButton: "hover:bg-gray-100",
                }
              }}
            />
            <div>
              <h3 className="font-semibold text-sidebar-foreground">
                {isLoaded ? (user?.fullName || user?.firstName || 'User') : 'Loading...'}
              </h3>
              <p className="text-sm text-muted-foreground">Health Enthusiast</p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap]
                const isActive = pathname === item.href
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Voice Chat Button */}
        <Button
          onClick={startVoiceChat}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12"
        >
          <Mic className="h-5 w-5" />
          Start Voice Chat
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
