import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing")
  }

  // Hashing the admin password
  const hashedPassword = await hash(adminPassword, 12)

  // Creating admin user (upsert = creates if doesn't exist, update if does exist)
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // We don't update if it already exists
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
      emailVerified: new Date(), // Mark as verified
    },
  })

  console.log("Admin user created:", admin.email)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
