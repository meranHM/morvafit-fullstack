"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Eye } from "lucide-react"
import type { HealthFormData } from "@/app/[locale]/admin/health-forms/page"

// Props type for HealthFormsTab
type HealthFormsTabProps = {
  forms: HealthFormData[]
}

const HealthFormsTab = ({ forms }: HealthFormsTabProps) => {
  // State for detail dialog
  const [selectedForm, setSelectedForm] = useState<HealthFormData | null>(null)

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
                <TableHead>BMI</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No health forms found
                  </TableCell>
                </TableRow>
              ) : (
                forms.map(form => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{form.clientName}</p>
                        <p className="text-xs text-gray-500">{form.clientEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{form.submittedDate}</TableCell>
                    <TableCell>{form.height}</TableCell>
                    <TableCell>{form.weight}</TableCell>
                    <TableCell>{form.bmi}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{form.goal}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedForm(form)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Full Form
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Full Form Detail Dialog */}
      <Dialog open={!!selectedForm} onOpenChange={() => setSelectedForm(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Health Form Details</DialogTitle>
            <DialogDescription>
              Complete health information for {selectedForm?.clientName}
            </DialogDescription>
          </DialogHeader>
          {selectedForm && (
            <div className="mt-4 space-y-6">
              {/* Physical Information */}
              <div>
                <h4 className="font-semibold mb-2">Physical Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Age:</span> {selectedForm.age}
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span> {selectedForm.gender}
                  </div>
                  <div>
                    <span className="text-gray-500">Height:</span> {selectedForm.height}
                  </div>
                  <div>
                    <span className="text-gray-500">Weight:</span> {selectedForm.weight}
                  </div>
                  <div>
                    <span className="text-gray-500">Target Weight:</span>{" "}
                    {selectedForm.targetWeight}
                  </div>
                  <div>
                    <span className="text-gray-500">BMI:</span> {selectedForm.bmi}
                  </div>
                </div>
              </div>

              {/* Fitness Goals */}
              <div>
                <h4 className="font-semibold mb-2">Fitness Goals</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Primary Goal:</span> {selectedForm.goal}
                  </div>
                  <div>
                    <span className="text-gray-500">Activity Level:</span>{" "}
                    {selectedForm.activityLevel}
                  </div>
                  <div>
                    <span className="text-gray-500">Experience:</span>{" "}
                    {selectedForm.experienceLevel}
                  </div>
                  <div>
                    <span className="text-gray-500">Session Duration:</span>{" "}
                    {selectedForm.sessionDuration}
                  </div>
                  <div>
                    <span className="text-gray-500">Preferred Time:</span>{" "}
                    {selectedForm.preferredTime}
                  </div>
                  <div>
                    <span className="text-gray-500">Workout Days:</span>{" "}
                    {selectedForm.workoutDays.join(", ")}
                  </div>
                </div>
              </div>

              {/* Diet & Health */}
              <div>
                <h4 className="font-semibold mb-2">Diet & Health</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Dietary Preference:</span>{" "}
                    {selectedForm.dietaryPreference}
                  </div>
                  {selectedForm.allergies && (
                    <div>
                      <span className="text-gray-500">Allergies:</span> {selectedForm.allergies}
                    </div>
                  )}
                  {selectedForm.medicalConditions && (
                    <div>
                      <span className="text-gray-500">Medical Conditions:</span>{" "}
                      {selectedForm.medicalConditions}
                    </div>
                  )}
                  {selectedForm.injuries && (
                    <div>
                      <span className="text-gray-500">Injuries:</span> {selectedForm.injuries}
                    </div>
                  )}
                </div>
              </div>

              {/* Motivation */}
              <div>
                <h4 className="font-semibold mb-2">Motivation</h4>
                <div className="text-sm">
                  <p>{selectedForm.motivation}</p>
                  {selectedForm.challenges && (
                    <div className="mt-2">
                      <span className="text-gray-500">Challenges:</span> {selectedForm.challenges}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HealthFormsTab
