"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Check, XCircle, Loader2 } from "lucide-react"
import type { PaymentData } from "@/app/[locale]/admin/payments/page"

// Props type for PaymentsTab
type PaymentsTabProps = {
  payments: PaymentData[]
}

const PaymentsTab = ({ payments }: PaymentsTabProps) => {
  const router = useRouter()
  // State for tracking loading status of approve/reject actions
  const [loadingId, setLoadingId] = useState<string | null>(null)
  // State for image preview dialog
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Function to handle approve/reject actions
  const handleStatusUpdate = async (paymentId: string, newStatus: "APPROVED" | "REJECTED") => {
    setLoadingId(paymentId)

    try {
      // Call API to update receipt status
      const response = await fetch(`/api/admin/receipts/${paymentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update receipt status")
      }

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Error updating receipt:", error)
      alert("Failed to update receipt status. Please try again.")
    } finally {
      setLoadingId(null)
    }
  }

  console.log(previewImage)
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
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No payment receipts found
                  </TableCell>
                </TableRow>
              ) : (
                payments.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{payment.clientName}</p>
                        <p className="text-xs text-gray-500">{payment.clientEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{payment.amount.toLocaleString()} T</TableCell>
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
                        {/* View Receipt Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewImage(payment.receiptUrl)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Receipt
                        </Button>

                        {/* Show approve/reject buttons only for pending payments */}
                        {payment.status === "pending" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              disabled={loadingId === payment.id}
                              onClick={() => handleStatusUpdate(payment.id, "APPROVED")}
                            >
                              {loadingId === payment.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="mr-2 h-4 w-4" />
                              )}
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={loadingId === payment.id}
                              onClick={() => handleStatusUpdate(payment.id, "REJECTED")}
                            >
                              {loadingId === payment.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="mr-2 h-4 w-4" />
                              )}
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Receipt Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>Review the uploaded payment receipt</DialogDescription>
          </DialogHeader>
          {previewImage && (
            <div className="mt-4">
              <img src={previewImage} alt="Payment Receipt" className="w-full h-auto rounded-lg" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PaymentsTab
