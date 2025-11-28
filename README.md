# MorvaFit -- Full-Stack Fitness Coaching Platform 🏋️‍♂️🔥

**MorvaFit** is a modern full-stack fitness coaching platform designed
for personal trainers to manage clients, deliver personalized workout
plans, and verify offline payments.\
It includes a dynamic portfolio website, secure authentication, client
dashboards, a powerful admin panel, and automated workout plan
assignment based on user-submitted data.

---

## 🚀 Tech Stack

### **Frontend**

- **Next.js 16 (App Router)**
- **TypeScript**
- **TailwindCSS v4**
- **Framer Motion** (UI animations)
- **GSAP ScrollTrigger** (portfolio scroll animations)
- **TanStack Query** (data fetching & caching)
- **Zustand** (global/local UI state)

### **Backend**

- **Next.js Full-Stack Route Handlers**
- **Prisma ORM**
- **PostgreSQL**
- **NextAuth.js** (Credentials + optional OAuth)
- **Cloudinary** (video + receipt storage)
- **RBAC** (Role-Based Access Control)

---

## 🧩 Core Features

### 🌐 Public Website

A fast, animated single-page experience including: - Home\

- About\
- Shop\
- Blog\
- Contact

With smooth scroll animations and cohesive branding.

---

### 🔐 Authentication & Roles

- Secure sign-in with **NextAuth.js**
- Roles:
  - **user**
  - **admin**
- Clients get private dashboard access upon signup.

---

### 👤 Client Dashboard

Clients can: - Edit profile information\

- Submit a detailed health & body form (height, weight, goals, diet,
  etc.)\
- Upload offline payment receipts\
- Receive personalized workout videos after admin approval\
- View assigned plans anytime

---

### 🧾 Offline Payment Workflow

1.  Client uploads bank transfer receipt\
2.  Admin reviews it\
3.  Upon approval → workout videos automatically appear in the client
    dashboard\
4.  Client gets instant access

---

### 📥 Admin Panel

A secure RBAC-protected panel built with **shadcn/ui**, featuring: -
View all clients - Access health forms\

- Approve receipts\
- Assign workout plans/videos\
- Upload videos directly to Cloudinary\
- (Optional) manage blog/shop content

---

### 📦 Storage

All media is stored using **Cloudinary**: - Offline payment receipts\

- Training/workout videos

---

## 📐 Project Structure

    /app
      /(public-pages) → Home, About, Shop, Blog, Contact
      /profile         → Client Dashboard (protected)
      /admin           → Admin Panel (RBAC protected)
      /api             → Auth, Users, Forms, Payments, Videos

    /prisma
      schema.prisma    → User, Profile, Form, Payment, WorkoutPlan models

    /components
      ui/              → shadcn/ui components
      layout/          → Navbar, Footer, Animations

    /lib
      auth/            → NextAuth config
      validators/      → Zod validation
      utils/           → Helpers + Cloudinary handlers

---

## 🛠️ Getting Started

### **1. Clone the Repository**

\`\`\`bash git clone
https://github.com/`<your-username>`{=html}/morvafit-fullstack-fitness-platform.git
cd morvafit-fullstack-fitness-platform \`\`\`

### **2. Install Dependencies**

\`\`\`bash npm install \`\`\`

### **3. Create Environment Variables**

Add a `.env` file with:

\`\`\` DATABASE_URL= NEXTAUTH_SECRET= NEXTAUTH_URL=

CLOUDINARY_CLOUD_NAME= CLOUDINARY_API_KEY= CLOUDINARY_API_SECRET= \`\`\`

### **4. Apply Prisma Migrations**

\`\`\`bash npx prisma migrate dev \`\`\`

### **5. Run Development Server**

\`\`\`bash npm run dev \`\`\`

---

## 📌 Planned Features

- In-app chat (client ↔ coach)\
- Automated nutrition recommendations\
- Workout progress tracking\
- AI-powered plan adjustments

---

## 📝 License

**MIT License** --- free to use, modify, and build upon.

---

## 👤 Author

**Mehran Shahani -- Full-Stack Developer**\
If you need coaching or development assistance, feel free to reach out!
