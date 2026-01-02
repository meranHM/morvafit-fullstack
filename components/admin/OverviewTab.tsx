"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, FileText } from "lucide-react"
import type { StatsData, RecentPayment } from "@/app/[locale]/admin/page"

// Props type for OverviewTab - receives data from server component
type OverviewTabProps = {
  stats: StatsData
  recentPayments: RecentPayment[]
}

const OverviewTab = ({ stats, recentPayments }: OverviewTabProps) => {
  // Format stats for display with labels
  const statsDisplay = [
    { label: "Total Clients", value: stats.totalClients.toString() },
    { label: "Pending Payments", value: stats.pendingPayments.toString() },
    { label: "Active Plans", value: stats.activePlans.toString() },
    { label: "Health Forms", value: stats.pendingForms.toString() },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map(stat => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest payment submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length === 0 ? (
                <p className="text-sm text-gray-500">No recent payments</p>
              ) : (
                recentPayments.slice(0, 3).map(payment => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{payment.clientName}</p>
                      <p className="text-xs text-gray-500">{payment.date}</p>
                    </div>
                    <Badge
                      variant={
                        payment.status === "approved"
                          ? "default"
                          : payment.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert>
                <Receipt className="h-4 w-4" />
                <AlertTitle>{stats.pendingPayments} Payments to Review</AlertTitle>
                <AlertDescription>New payment receipts are waiting for approval.</AlertDescription>
              </Alert>
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>{stats.pendingForms} Health Forms</AlertTitle>
                <AlertDescription>Client health forms to review.</AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OverviewTab
