import { prisma } from "@/lib/prisma"
import HealthFormsTab from "@/components/admin/HealthFormsTab"

// Type for health form data passed to component
export type HealthFormData = {
  id: string
  userId: string
  clientName: string
  clientEmail: string
  submittedDate: string
  // Physical info
  age: number
  gender: string
  height: string
  weight: string
  targetWeight: string
  bmi: string
  // Goals and fitness
  goal: string
  activityLevel: string
  experienceLevel: string
  workoutDays: string[]
  preferredTime: string
  sessionDuration: string
  // Diet and health
  dietaryPreference: string
  allergies: string | null
  medicalConditions: string | null
  injuries: string | null
  // Motivation
  motivation: string
  challenges: string | null
}

export default async function AdminPanelHealthFormsPage() {
  // Fetch all body info forms with user info
  const forms = await prisma.bodyInfo.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  // Format forms for frontend
  const healthForms: HealthFormData[] = forms.map(form => ({
    id: form.id,
    userId: form.userId,
    clientName: form.user.name || form.user.email,
    clientEmail: form.user.email,
    submittedDate: form.createdAt.toISOString().split("T")[0],
    // Physical info
    age: form.age,
    gender: form.gender,
    height: `${form.height}cm`,
    weight: `${form.weight}kg`,
    targetWeight: `${form.targetWeight}kg`,
    bmi: form.bmi.toFixed(1),
    // Goals and fitness - format enum values for display
    goal: form.primaryGoal.replace(/_/g, " "),
    activityLevel: form.activityLevel.replace(/_/g, " "),
    experienceLevel: form.experienceLevel,
    workoutDays: form.workoutDays,
    preferredTime: form.preferredTime,
    sessionDuration: form.sessionDuration.replace("MIN_", "") + " min",
    // Diet and health
    dietaryPreference: form.dietaryPreference.replace(/_/g, " "),
    allergies: form.allergies,
    medicalConditions: form.medicalConditions,
    injuries: form.injuries,
    // Motivation
    motivation: form.motivation,
    challenges: form.challenges,
  }))

  return <HealthFormsTab forms={healthForms} />
}
