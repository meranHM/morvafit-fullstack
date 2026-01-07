"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { navigation } from "@/data/statics/admin-panel"
import { useState, useEffect } from "react"
import { X, Users, Bell, LogOut, ChevronDown } from "lucide-react"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

type TabType = "overview" | "clients" | "forms" | "payments" | "videos"

const AdminPanelSidebar = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch from Radix UI's dynamic ID generation
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">MorvaFit Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveTab(item.id as TabType)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-rose-50 text-rose-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/admin-avatar.jpg" />
                    <AvatarFallback className="bg-rose-500 text-white">MC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">Morva Coach</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="w-full flex items-center gap-3 p-3 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-rose-500 text-white">MC</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">Morva Coach</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default AdminPanelSidebar
