"use client"

import { useState } from "react"
import {
  Users,
  FileText,
  Receipt,
  Video,
  LayoutDashboard,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Check,
  XCircle,
  Eye,
  Upload,
  MoreVertical,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type TabType = "overview" | "clients" | "forms" | "payments" | "videos"

// Mock data
const mockClients = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    status: "active",
    joinDate: "2024-01-15",
    hasForm: true,
    hasPlan: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@example.com",
    status: "pending",
    joinDate: "2024-02-20",
    hasForm: true,
    hasPlan: false,
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    status: "active",
    joinDate: "2024-01-10",
    hasForm: true,
    hasPlan: true,
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@example.com",
    status: "inactive",
    joinDate: "2023-12-05",
    hasForm: false,
    hasPlan: false,
  },
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

const mockForms = [
  {
    id: 1,
    clientName: "Sarah Johnson",
    submittedDate: "2024-01-16",
    height: "165cm",
    weight: "60kg",
    goal: "Weight Loss",
  },
  {
    id: 2,
    clientName: "Michael Chen",
    submittedDate: "2024-02-21",
    height: "178cm",
    weight: "85kg",
    goal: "Muscle Gain",
  },
  {
    id: 3,
    clientName: "Emma Davis",
    submittedDate: "2024-01-11",
    height: "170cm",
    weight: "65kg",
    goal: "Toning",
  },
]

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const navigation = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "clients", label: "Clients", icon: Users },
    { id: "forms", label: "Health Forms", icon: FileText },
    { id: "payments", label: "Payments", icon: Receipt },
    { id: "videos", label: "Workout Plans", icon: Video },
  ]

  const stats = [
    { label: "Total Clients", value: "124", change: "+12%", trend: "up" },
    { label: "Pending Payments", value: "8", change: "-3%", trend: "down" },
    { label: "Active Plans", value: "98", change: "+8%", trend: "up" },
    { label: "Pending Forms", value: "5", change: "+2", trend: "up" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
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
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-rose-50 text-rose-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
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
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
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
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
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

        {/* Content Area */}
        <main className="p-4 lg:p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
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
                        <Badge variant={stat.trend === "up" ? "default" : "secondary"}>
                          {stat.change}
                        </Badge>
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
                        <AlertDescription>
                          New payment receipts are waiting for approval.
                        </AlertDescription>
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
          )}

          {/* Clients Tab */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
                  <p className="text-gray-500 mt-1">Manage all your clients</p>
                </div>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Form</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockClients.map(client => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{client.joinDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                client.status === "active"
                                  ? "default"
                                  : client.status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {client.hasForm ? (
                              <Check className="text-green-600" size={18} />
                            ) : (
                              <XCircle className="text-gray-400" size={18} />
                            )}
                          </TableCell>
                          <TableCell>
                            {client.hasPlan ? (
                              <Check className="text-green-600" size={18} />
                            ) : (
                              <XCircle className="text-gray-400" size={18} />
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Video className="mr-2 h-4 w-4" />
                                  Assign Plan
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Health Forms Tab */}
          {activeTab === "forms" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Health Forms</h2>
                <p className="text-gray-500 mt-1">Review client health and body information</p>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Height</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Goal</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockForms.map(form => (
                        <TableRow key={form.id}>
                          <TableCell className="font-medium">{form.clientName}</TableCell>
                          <TableCell>{form.submittedDate}</TableCell>
                          <TableCell>{form.height}</TableCell>
                          <TableCell>{form.weight}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{form.goal}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Full Form
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Payment Receipts</h2>
                <p className="text-gray-500 mt-1">Review and approve offline payment receipts</p>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPayments.map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.clientName}</TableCell>
                          <TableCell>{payment.amount}</TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                View Receipt
                              </Button>
                              {payment.status === "pending" && (
                                <>
                                  <Button variant="default" size="sm">
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button variant="destructive" size="sm">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Workout Plans Tab */}
          {activeTab === "videos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Workout Plans</h2>
                  <p className="text-gray-500 mt-1">Manage and assign workout videos</p>
                </div>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                        <Video className="text-gray-400" size={48} />
                      </div>
                      <CardTitle className="text-lg">Full Body Workout #{i}</CardTitle>
                      <CardDescription>45 min • Intermediate Level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              Assign to Client
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default AdminPanel
