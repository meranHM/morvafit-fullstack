"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { navigation } from "@/data/statics/user-dashboard"
import Link from "next/link"

type TabType = "overview" | "videos" | "payments" | "health" | "account" | "progress"

interface UserDashboardSidebarProps {
  memberSince: string
  nextPayment: string
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({
  memberSince,
  nextPayment,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  return (
    <aside className="lg:col-span-3">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-4 sticky top-24"
      >
        <nav className="space-y-1">
          {navigation.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium text-gray-900">{memberSince}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next Payment</span>
            <span className="font-medium text-gray-900">{nextPayment}</span>
          </div>
        </div>
      </motion.div>
    </aside>
  )
}

export default UserDashboardSidebar
