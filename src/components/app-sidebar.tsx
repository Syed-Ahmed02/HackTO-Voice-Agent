"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

  const startVoiceChat = () => {
    // Placeholder for Vapi integration
    console.log("Starting voice chat with AI trainer...")
  }

  return (
    <Sidebar>
      <SidebarHeader>
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/fitness-user-avatar.png" />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">SA</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sidebar-foreground">Syed Ahmed</h3>
            <p className="text-sm text-muted-foreground">Health Enthusiast</p>
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
