"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "../ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Check, XCircle, MoreVertical, Eye, Video } from "lucide-react"

const ClientsTab = () => {
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

  return (
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
  )
}

export default ClientsTab
