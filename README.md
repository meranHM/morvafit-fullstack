MorvaFit – Full-Stack Fitness Coaching Platform

MorvaFit is a modern full-stack fitness coaching platform built for a personal trainer to manage clients, deliver personalized workout plans, and handle offline payments.
The website includes a public portfolio-style single-page layout, user authentication, client dashboards, admin panel, and automated workout plan assignment based on user-submitted physical data.

🚀 Tech Stack
Frontend

Next.js 16 (App Router)

TypeScript

TailwindCSS v4

Framer Motion (UI animations)

GSAP ScrollTrigger (portfolio scroll animations)

TanStack Query (server interaction & caching)

Zustand (local UI/global state)

Backend

Next.js Full-Stack Route Handlers

Prisma ORM

PostgreSQL

NextAuth.js (credentials, OAuth optional)

Cloudinary (receipt + video storage)

Role-Based Access Control (RBAC)

🧩 Core Features
🌐 Public Website

A single-page portfolio-style layout with:

Home

About

Shop

Blog

Contact

Includes smooth animations, scroll effects, and a consistent branding experience.

🔐 Authentication

NextAuth.js with secure sessions

User roles: user, admin

Clients receive access to a personal dashboard after signup.

👤 User Dashboard

After signing up, clients can:

Edit profile info

Fill out a health & body information form (height, weight, diet, goals, etc.)

Upload payment receipts for manual verification

Receive personalized workout videos after admin approval

View assigned workout plans directly in their dashboard

🧾 Offline Payment Workflow

User uploads a bank transfer receipt

Admin reviews it in the /admin dashboard

Once approved → client automatically receives their assigned training videos

📥 Admin Panel

A protected route (/admin) built using shadcn/ui with features for:

Viewing all clients & their forms

Approving offline payments

Assigning workout/training videos to users

Uploading videos to Cloudinary

Managing blog posts, shop items, and site content (optional future features)

📦 Storage

Cloudinary is used for storing:

Offline payment receipts

Training videos

📐 Project Architecture
/app
/(public-pages) → Home, About, Shop, Blog, Contact
/profile → User dashboard (protected)
/admin → Admin panel (RBAC protected)
/api → Full-stack API routes (Auth, Users, Forms, Payments, Videos)

/prisma
schema.prisma → DB models (User, Profile, Form, Payment, WorkoutPlan)

/components
ui/ → Reusable shadcn components
layout/ → Navbar, Footer, Animations

/lib
auth/ → NextAuth config
validators/ → Form validation (Zod)
utils/ → Helpers, Cloudinary handlers

🛠️ Getting Started

1. Clone the Repository
   git clone https://github.com/<your-username>/morvafit-fullstack-fitness-platform.git
   cd morvafit-fullstack-fitness-platform

2. Install Dependencies
   npm install

3. Environment Variables

Create a .env file:

DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

4. Apply Prisma Migrations
   npx prisma migrate dev

5. Run the App
   npm run dev

📌 Planned Features

In-app chat between coach and client

Automated nutrition suggestions

Workout progress tracking

AI-powered plan adjustment (future)

📝 License

MIT — Feel free to fork, modify, and build on this project.

👤 Author

Mehran Shahani – Full-Stack Developer
If you want coaching or development help, feel free to reach out!
