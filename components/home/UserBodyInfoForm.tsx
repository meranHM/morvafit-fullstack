import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import NotAuthenticatedState from "../bodyInfoForm/NotAuthenticatedState"
import MainForm from "../bodyInfoForm/MainForm"
import AlreadySubmittedState from "../bodyInfoForm/AlreadySubmittedState"

export default async function UserBodyInfoForm() {
  // Gettting the current user's session from NextAuth
  const session = await getServerSession(authOptions)

  // If user is not logged in, show the authentication prompt
  if (!session?.user.id) return <NotAuthenticatedState />

  // Checking if user has already submitted their body info
  // We query the database for existing BodyInfo linked to this user
  const existingBodyInfo = await prisma.bodyInfo.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      bmi: true,
      primaryGoal: true,
      weight: true,
      height: true,
    },
  })

  // If user already has body info, we show the "already submitted" state
  // This displays their stats and a link to the dashboard
  if (existingBodyInfo) {
    return (
      <AlreadySubmittedState
        bmi={existingBodyInfo.bmi}
        primaryGoal={existingBodyInfo.primaryGoal}
        weight={existingBodyInfo.weight}
        height={existingBodyInfo.height}
      />
    )
  }

  // If user is logged in but hasn't submitted form, we show the main form
  return <MainForm />
}
