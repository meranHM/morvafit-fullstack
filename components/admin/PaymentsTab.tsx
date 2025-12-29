"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Eye, Check, XCircle } from "lucide-react"

const PaymentsTab = () => {
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
  )
}

export default PaymentsTab
