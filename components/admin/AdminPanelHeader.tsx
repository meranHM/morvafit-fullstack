"use client"

import { useState } from "react"
import { Menu, Search, Bell, Filter } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

const AdminPanelHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="search"
              placeholder="Search clients, payments..."
              className="pl-10 w-64 lg:w-96"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>
    </header>
  )
}

export default AdminPanelHeader
