"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, FileText } from "lucide-react"

const OverviewTab = () => {
  const stats = [
    { label: "Total Clients", value: "124", change: "+12%", trend: "up" },
    { label: "Pending Payments", value: "8", change: "-3%", trend: "down" },
    { label: "Active Plans", value: "98", change: "+8%", trend: "up" },
    { label: "Pending Forms", value: "5", change: "+2", trend: "up" },
  ]

  const mockPayments = [
    {
      id: 1,
      clientName: "Sarah Johnson",
      amount: "$150",
      date: "2024-03-01",
      status: "approved",
      receiptUrl: "#",
    },
    {
      id: 2,
      clientName: "Michael Chen",
      amount: "$150",
      date: "2024-03-05",
      status: "pending",
      receiptUrl: "#",
    },
    {
      id: 3,
      clientName: "Emma Davis",
      amount: "$150",
      date: "2024-02-28",
      status: "approved",
      receiptUrl: "#",
    },
    {
      id: 4,
      clientName: "James Wilson",
      amount: "$150",
      date: "2024-03-03",
      status: "rejected",
      receiptUrl: "#",
    },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{stat.value}</p>
                <Badge variant={stat.trend === "up" ? "default" : "secondary"}>{stat.change}</Badge>
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
              {mockPayments.slice(0, 3).map(payment => (
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
              ))}
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
                <AlertTitle>8 Payments to Review</AlertTitle>
                <AlertDescription>New payment receipts are waiting for approval.</AlertDescription>
              </Alert>
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>5 Health Forms</AlertTitle>
                <AlertDescription>New client health forms need review.</AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OverviewTab
