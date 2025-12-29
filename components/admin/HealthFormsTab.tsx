"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Eye } from "lucide-react"

const HealthFormsTab = () => {
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
  return (
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
  )
}

export default HealthFormsTab
