# Fitness Coach Platform - Complete Architecture & Implementation Guide

## 1. Architecture Overview (Text Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  Next.js App Router + React Server Components + Client Components│
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Public Pages (/)              │  Auth Pages (/auth)             │
│  - Home, About, Shop, Blog     │  - Login, Signup, Verify        │
│                                                                   │
│  User Dashboard (/dashboard)   │  Admin Panel (/admin)           │
│  - Profile, Body Info          │  - Users, Videos, Receipts      │
│  - Assigned Videos             │  - Products, Blog Posts         │
│  - Receipt Upload              │                                 │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                    AUTHENTICATION LAYER                          │
│              NextAuth.js + Middleware + Role Guards              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                      API ROUTES (/api)                           │
│                                                                   │
│  Auth          │  User           │  Admin          │  Public     │
│  /api/auth/*   │  /api/user/*    │  /api/admin/*   │  /api/*     │
│  - [...nextauth]│ - body-info    │  - users        │  - blog     │
│                │  - receipt      │  - videos       │  - products │
│                │  - videos       │  - approve      │             │
│                │  - profile      │  - assign       │             │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                     DATA ACCESS LAYER                            │
│                  Prisma ORM + PostgreSQL                         │
│                                                                   │
│  Models: User, BodyInfo, Receipt, Video, VideoAssignment,        │
│          Product, BlogPost, Notification                         │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                    EXTERNAL SERVICES                             │
│                                                                   │
│  Storage: ArvanCloud S3         │  Email: Resend / SendGrid     │
│  (Receipts, Videos, Images)     │  (Verification, Notifications) │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow Example - Receipt Approval:**
1. User uploads receipt → Request presigned URL from API
2. Browser uploads directly to ArvanCloud using presigned URL
3. User submits receipt metadata to API (URL, status: PENDING)
4. Admin views pending receipts in admin panel
5. Admin approves → API updates receipt status, assigns videos, creates notification
6. User receives email + in-app notification
7. Videos appear in user dashboard

---

## 2. Project Structure

```
fitness-coach-platform/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── app/
│   │   ├── (public)/                    # Public routes (no auth required)
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── shop/
│   │   │   │   ├── page.tsx             # Product listing
│   │   │   │   └── [id]/page.tsx        # Product detail
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx             # Blog listing
│   │   │   │   └── [slug]/page.tsx      # Blog post
│   │   │   ├── contact/page.tsx
│   │   │   └── layout.tsx               # Public layout
│   │   │
│   │   ├── (auth)/                      # Auth routes
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── dashboard/                   # User dashboard (auth required)
│   │   │   ├── page.tsx                 # Overview
│   │   │   ├── profile/page.tsx
│   │   │   ├── body-info/page.tsx
│   │   │   ├── videos/page.tsx
│   │   │   ├── receipt/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── admin/                       # Admin panel (admin role required)
│   │   │   ├── page.tsx                 # Dashboard
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── receipts/page.tsx
│   │   │   ├── videos/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/route.ts
│   │   │   ├── user/
│   │   │   │   ├── body-info/route.ts
│   │   │   │   ├── receipt/route.ts
│   │   │   │   ├── videos/route.ts
│   │   │   │   ├── profile/route.ts
│   │   │   │   └── notifications/route.ts
│   │   │   ├── admin/
│   │   │   │   ├── users/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/route.ts
│   │   │   │   ├── receipts/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/approve/route.ts
│   │   │   │   ├── videos/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── [id]/route.ts
│   │   │   │   │   └── assign/route.ts
│   │   │   │   ├── products/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/route.ts
│   │   │   │   └── blog/
│   │   │   │       ├── route.ts
│   │   │   │       └── [id]/route.ts
│   │   │   ├── upload/
│   │   │   │   ├── presigned-url/route.ts
│   │   │   │   └── confirm/route.ts
│   │   │   ├── blog/route.ts            # Public blog API
│   │   │   └── products/route.ts        # Public products API
│   │   │
│   │   ├── layout.tsx                   # Root layout
│   │   ├── globals.css
│   │   └── providers.tsx                # Client providers
│   │
│   ├── components/
│   │   ├── ui/                          # Shadcn-style UI components
│   │   ├── forms/
│   │   │   ├── body-info-form.tsx
│   │   │   ├── receipt-upload.tsx
│   │   │   ├── video-form.tsx
│   │   │   └── product-form.tsx
│   │   ├── dashboard/
│   │   │   ├── stats-card.tsx
│   │   │   ├── video-player.tsx
│   │   │   └── notification-bell.tsx
│   │   └── admin/
│   │       ├── user-table.tsx
│   │       ├── receipt-approval.tsx
│   │       └── video-assignment.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts                      # NextAuth config
│   │   ├── prisma.ts                    # Prisma client singleton
│   │   ├── arvancloud.ts                # ArvanCloud S3 SDK
│   │   ├── email.ts                     # Email service
│   │   ├── validation.ts                # Zod schemas
│   │   └── utils.ts
│   │
│   ├── hooks/
│   │   ├── use-body-info.ts
│   │   ├── use-videos.ts
│   │   ├── use-notifications.ts
│   │   └── use-upload.ts
│   │
│   ├── store/
│   │   ├── auth-store.ts                # Zustand auth state
│   │   └── notification-store.ts
│   │
│   ├── types/
│   │   ├── api.ts                       # API request/response types
│   │   ├── models.ts                    # Prisma model types
│   │   └── index.ts
│   │
│   └── middleware.ts                    # NextAuth + role-based middleware
│
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum ReceiptStatus {
  PENDING
  APPROVED
  REJECTED
}

enum NotificationType {
  RECEIPT_APPROVED
  RECEIPT_REJECTED
  VIDEO_ASSIGNED
  GENERAL
}

model User {
  id                String             @id @default(cuid())
  email             String             @unique
  emailVerified     DateTime?
  name              String?
  password          String             // Hashed with bcrypt
  role              Role               @default(USER)
  image             String?
  
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  
  // Relations
  accounts          Account[]
  sessions          Session[]
  bodyInfo          BodyInfo?
  receipts          Receipt[]
  videoAssignments  VideoAssignment[]
  notifications     Notification[]
  
  @@index([email])
}

model Account {
  id                 String   @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?
  
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}

model BodyInfo {
  id            String   @id @default(cuid())
  userId        String   @unique
  
  height        Float    // cm
  weight        Float    // kg
  age           Int
  diet          String   @db.Text
  goals         String   @db.Text
  medicalNotes  String?  @db.Text
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

model Receipt {
  id          String         @id @default(cuid())
  userId      String
  
  fileUrl     String         // ArvanCloud URL
  fileName    String
  fileType    String         // image/jpeg, application/pdf
  fileSize    Int            // bytes
  
  status      ReceiptStatus  @default(PENDING)
  notes       String?        @db.Text
  reviewedBy  String?        // Admin user ID
  reviewedAt  DateTime?
  
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  user        User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([status])
}

model Video {
  id          String             @id @default(cuid())
  
  title       String
  description String?            @db.Text
  videoUrl    String             // ArvanCloud URL
  thumbnailUrl String?
  duration    Int?               // seconds
  category    String?
  
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
  
  assignments VideoAssignment[]
  
  @@index([category])
}

model VideoAssignment {
  id          String   @id @default(cuid())
  userId      String
  videoId     String
  
  assignedAt  DateTime @default(now())
  watchedAt   DateTime?
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  video       Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  
  @@unique([userId, videoId])
  @@index([userId])
  @@index([videoId])
}

model Product {
  id          String   @id @default(cuid())
  
  title       String
  description String   @db.Text
  price       Float
  imageUrl    String?
  inStock     Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([inStock])
}

model BlogPost {
  id          String   @id @default(cuid())
  
  title       String
  slug        String   @unique
  content     String   @db.Text
  excerpt     String?
  coverImage  String?
  published   Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?
  
  @@index([slug])
  @@index([published])
}

model Notification {
  id          String           @id @default(cuid())
  userId      String
  
  type        NotificationType
  title       String
  message     String           @db.Text
  read        Boolean          @default(false)
  link        String?
  
  createdAt   DateTime         @default(now())
  
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, read])
}
```

### Migration Commands

```bash
# Initialize Prisma
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Reset database (dev only)
npx prisma migrate reset

# Deploy to production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## 4. NextAuth.js Configuration

```typescript
// src/lib/auth.ts

import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

```typescript
// src/app/api/auth/[...nextauth]/route.ts

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

```typescript
// src/middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes protection
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Dashboard routes protection
    if (path.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Public routes
        if (
          path.startsWith("/login") ||
          path.startsWith("/signup") ||
          path === "/" ||
          path.startsWith("/about") ||
          path.startsWith("/shop") ||
          path.startsWith("/blog") ||
          path.startsWith("/contact")
        ) {
          return true;
        }
        
        // Protected routes require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
  ],
};
```

```typescript
// src/types/next-auth.d.ts

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
```

---

## 5. API Design - Complete Contract

### 5.1 Authentication

**POST /api/auth/signup**
```typescript
// Request
{
  email: string;
  password: string;
  name: string;
}

// Response (201)
{
  user: {
    id: string;
    email: string;
    name: string;
    role: "USER";
  }
}

// Error (400/409)
{
  error: string;
}
```

**POST /api/auth/[...nextauth]**
```typescript
// Handled by NextAuth - standard OAuth/credentials flow
```

### 5.2 User Endpoints

**POST /api/user/body-info**
```typescript
// Request
{
  height: number;      // cm
  weight: number;      // kg
  age: number;
  diet: string;
  goals: string;
  medicalNotes?: string;
}

// Response (201)
{
  bodyInfo: {
    id: string;
    userId: string;
    height: number;
    weight: number;
    age: number;
    diet: string;
    goals: string;
    medicalNotes: string | null;
    createdAt: string;
    updatedAt: string;
  }
}
```

**GET /api/user/body-info**
```typescript
// Response (200)
{
  bodyInfo: BodyInfo | null;
}
```

**PUT /api/user/body-info**
```typescript
// Request (same as POST)
// Response (200) - same as POST
```

**POST /api/user/receipt**
```typescript
// Request
{
  fileUrl: string;     // ArvanCloud URL after upload
  fileName: string;
  fileType: string;
  fileSize: number;
  notes?: string;
}

// Response (201)
{
  receipt: {
    id: string;
    userId: string;
    fileUrl: string;
    fileName: string;
    status: "PENDING";
    createdAt: string;
  }
}
```

**GET /api/user/receipt**
```typescript
// Response (200)
{
  receipts: Array<{
    id: string;
    fileUrl: string;
    fileName: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    notes: string | null;
    reviewedAt: string | null;
    createdAt: string;
  }>;
}
```

**GET /api/user/videos**
```typescript
// Response (200)
{
  videos: Array<{
    id: string;
    title: string;
    description: string | null;
    videoUrl: string;
    thumbnailUrl: string | null;
    duration: number | null;
    category: string | null;
    assignedAt: string;
    watchedAt: string | null;
  }>;
}
```

**POST /api/user/videos/[id]/watch**
```typescript
// Request: empty body

// Response (200)
{
  success: true;
  watchedAt: string;
}
```

**GET /api/user/notifications**
```typescript
// Query params: ?unreadOnly=true

// Response (200)
{
  notifications: Array<{
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    link: string | null;
    createdAt: string;
  }>;
  unreadCount: number;
}
```

**PATCH /api/user/notifications/[id]/read**
```typescript
// Response (200)
{
  success: true;
}
```

### 5.3 Admin Endpoints

**GET /api/admin/users**
```typescript
// Query params: ?page=1&limit=20&search=email

// Response (200)
{
  users: Array<{
    id: string;
    email: string;
    name: string | null;
    role: "USER" | "ADMIN";
    createdAt: string;
    hasBodyInfo: boolean;
    receiptStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
    videoCount: number;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

**GET /api/admin/users/[id]**
```typescript
// Response (200)
{
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: string;
    bodyInfo: BodyInfo | null;
    receipts: Receipt[];
    videoAssignments: Array<{
      video: Video;
      assignedAt: string;
      watchedAt: string | null;
    }>;
  }
}
```

**GET /api/admin/receipts**
```typescript
// Query params: ?status=PENDING&page=1&limit=20

// Response (200)
{
  receipts: Array<{
    id: string;
    user: { id: string; email: string; name: string | null };
    fileUrl: string;
    fileName: string;
    status: ReceiptStatus;
    notes: string | null;
    createdAt: string;
  }>;
  total: number;
}
```

**POST /api/admin/receipts/[id]/approve**
```typescript
// Request
{
  videoIds: string[];  // Videos to assign on approval
  notes?: string;
}

// Response (200)
{
  receipt: {
    id: string;
    status: "APPROVED";
    reviewedAt: string;
    reviewedBy: string;
  };
  assignedVideos: number;
}
```

**POST /api/admin/receipts/[id]/reject**
```typescript
// Request
{
  notes: string;
}

// Response (200)
{
  receipt: {
    id: string;
    status: "REJECTED";
    reviewedAt: string;
    reviewedBy: string;
    notes: string;
  };
}
```

**GET /api/admin/videos**
```typescript
// Query params: ?category=strength&page=1&limit=20

// Response (200)
{
  videos: Array<{
    id: string;
    title: string;
    description: string | null;
    videoUrl: string;
    thumbnailUrl: string | null;
    category: string | null;
    createdAt: string;
    assignmentCount: number;
  }>;
  total: number;
}
```

**POST /api/admin/videos**
```typescript
// Request
{
  title: string;
  description?: string;
  videoUrl: string;        // ArvanCloud URL after upload
  thumbnailUrl?: string;
  duration?: number;
  category?: string;
}

// Response (201)
{
  video: Video;
}
```

**PUT /api/admin/videos/[id]**
```typescript
// Request (same as POST, all fields optional)
// Response (200) - returns updated video
```

**DELETE /api/admin/videos/[id]**
```typescript
// Response (200)
{
  success: true;
}
```

**POST /api/admin/videos/assign**
```typescript
// Request
{
  userIds: string[];
  videoIds: string[];
}

// Response (200)
{
  assigned: number;
  assignments: Array<{ userId: string; videoId: string }>;
}
```

**GET /api/admin/products**
```typescript
// Response (200)
{
  products: Product[];
  total: number;
}
```

**POST /api/admin/products**
```typescript
// Request
{
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
}

// Response (201)
{
  product: Product;
}
```

**PUT /api/admin/products/[id]**
```typescript
// Request (same as POST, all optional)
// Response (200)
```

**DELETE /api/admin/products/[id]**
```typescript
// Response (200)
{ success: true; }
```

**GET /api/admin/blog**
```typescript
// Response (200)
{
  posts: BlogPost[];
  total: number;
}
```

**POST /api/admin/blog**
```typescript
// Request
{
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
}

// Response (201)
{
  post: BlogPost;
}
```

### 5.4 Upload Endpoint

**POST /api/upload/presigned-url**
```typescript
// Request
{
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadType: "receipt" | "video" | "image";
}

// Response (200)
{
  uploadUrl: string;      // Presigned URL for direct upload
  fileUrl: string;        // Final URL after upload completes
  key: string;            // S3 object key
  expiresIn: number;      // Seconds until URL expires
}

// Error (400)
{
  error: string;
  details?: string;
}
```

### 5.5 Public Endpoints

**GET /api/blog**
```typescript
// Query: ?page=1&limit=10

// Response (200)
{
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: string;
  }>;
  total: number;
}
```

**GET /api/blog/[slug]**
```typescript
// Response (200)
{
  post: BlogPost;
}
```

**GET /api/products**
```typescript
// Response (200)
{
  products: Array<Product>;
}
```

---

## 6. Code Snippets

### 6.1 ArvanCloud S3 Client

```typescript
// src/lib/arvancloud.ts

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ir-thr-at1", // ArvanCloud region
  endpoint: process.env.ARVAN_ENDPOINT, // e.g., https://s3.ir-thr-at1.arvanstorage.ir
  credentials: {
    accessKeyId: process.env.ARVAN_ACCESS_KEY!,
    secretAccessKey: process.env.ARVAN_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.ARVAN_BUCKET_NAME!;
const MAX_FILE_SIZE = {
  receipt: 10 * 1024 * 1024,  // 10MB
  video: 500 * 1024 * 1024,   // 500MB
  image: 5 * 1024 * 1024,     // 5MB
};

const ALLOWED_TYPES = {
  receipt: ["image/jpeg", "image/png", "application/pdf"],
  video: ["video/mp4", "video/quicktime"],
  image: ["image/jpeg", "image/png", "image/webp"],
};

export async function generatePresignedUrl(
  fileName: string,
  fileType: string,
  fileSize: number,
  uploadType: "receipt" | "video" | "image"
) {
  // Validation
  if (fileSize > MAX_FILE_SIZE[uploadType]) {
    throw new Error(`File size exceeds maximum allowed: ${MAX_FILE_SIZE[uploadType] / 1024 / 1024}MB`);
  }

  if (!ALLOWED_TYPES[uploadType].includes(fileType)) {
    throw new Error(`File type ${fileType} not allowed for ${uploadType}`);
  }

  // Generate unique key
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${uploadType}s/${timestamp}-${sanitizedFileName}`;

  // Create presigned URL for PUT
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
    ContentLength: fileSize,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600, // 1 hour
  });

  // Construct final public URL
  const fileUrl = `${process.env.ARVAN_CDN_URL || process.env.ARVAN_ENDPOINT}/${BUCKET_NAME}/${key}`;

  return {
    uploadUrl,
    fileUrl,
    key,
    expiresIn: 3600,
  };
}

export async function generateDownloadUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

export { s3Client, BUCKET_NAME };
```

```typescript
// src/app/api/upload/presigned-url/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generatePresignedUrl } from "@/lib/arvancloud";
import { z } from "zod";

const requestSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.string(),
  fileSize: z.number().positive(),
  uploadType: z.enum(["receipt", "video", "image"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin-only for video uploads
    if (req.body.uploadType === "video" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = requestSchema.parse(body);

    const presigned = await generatePresignedUrl(
      data.fileName,
      data.fileType,
      data.fileSize,
      data.uploadType
    );

    return NextResponse.json(presigned);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Presigned URL error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
```

### 6.2 Frontend Upload Component

```typescript
// src/components/forms/receipt-upload.tsx

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Upload, FileCheck, AlertCircle } from "lucide-react";

export function ReceiptUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Step 1: Get presigned URL
      const presignedRes = await fetch("/api/upload/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadType: "receipt",
        }),
      });

      if (!presignedRes.ok) {
        const error = await presignedRes.json();
        throw new Error(error.error || "Failed to get upload URL");
      }

      const { uploadUrl, fileUrl, key } = await presignedRes.json();

      // Step 2: Upload directly to ArvanCloud
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(fileUrl);
          } else {
            reject(new Error("Upload failed"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
      });

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);

      await uploadPromise;

      // Step 3: Save receipt metadata
      const receiptRes = await fetch("/api/user/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      if (!receiptRes.ok) {
        throw new Error("Failed to save receipt");
      }

      return await receiptRes.json();
    },
    onSuccess: () => {
      setFile(null);
      setUploadProgress(0);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Only JPEG, PNG, and PDF files are allowed");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="receipt-upload"
          disabled={uploadMutation.isPending}
        />
        
        <label
          htmlFor="receipt-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            Click to upload payment receipt
          </span>
          <span className="text-xs text-gray-500 mt-1">
            JPEG, PNG, or PDF (max 10MB)
          </span>
        </label>
      </div>

      {file && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-red-600 text-sm hover:underline"
              disabled={uploadMutation.isPending}
            >
              Remove
            </button>
          </div>

          {uploadMutation.isPending && (
            <div className="space-y-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">
                Uploading... {uploadProgress}%
              </span>
            </div>
          )}

          {!uploadMutation.isPending && (
            <button
              onClick={() => uploadMutation.mutate(file)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Receipt
            </button>
          )}
        </div>
      )}

      {uploadMutation.isError && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">
            {uploadMutation.error instanceof Error
              ? uploadMutation.error.message
              : "Upload failed"}
          </span>
        </div>
      )}

      {uploadMutation.isSuccess && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <FileCheck className="w-5 h-5" />
          <span className="text-sm">
            Receipt uploaded successfully! Awaiting admin approval.
          </span>
        </div>
      )}
    </div>
  );
}
```

### 6.3 Auth Middleware & Session Hook

```typescript
// src/lib/auth-helpers.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  return session;
}

export async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  return session;
}
```

```typescript
// Example API route with auth
// src/app/api/user/profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  
  if (session instanceof NextResponse) {
    return session; // Return error response
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      bodyInfo: true,
      receipts: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  return NextResponse.json({ user });
}
```

### 6.4 Key Prisma Queries

```typescript
// src/lib/queries/receipt.ts

import { prisma } from "@/lib/prisma";
import { ReceiptStatus } from "@prisma/client";

export async function approveReceipt(
  receiptId: string,
  adminId: string,
  videoIds: string[],
  notes?: string
) {
  // Use transaction to ensure atomicity
  return await prisma.$transaction(async (tx) => {
    // Update receipt
    const receipt = await tx.receipt.update({
      where: { id: receiptId },
      data: {
        status: ReceiptStatus.APPROVED,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        notes,
      },
      include: {
        user: true,
      },
    });

    // Assign videos
    const assignments = await Promise.all(
      videoIds.map((videoId) =>
        tx.videoAssignment.create({
          data: {
            userId: receipt.userId,
            videoId,
          },
        })
      )
    );

    // Create notification
    await tx.notification.create({
      data: {
        userId: receipt.userId,
        type: "RECEIPT_APPROVED",
        title: "Payment Approved!",
        message: `Your payment has been approved. ${videoIds.length} training videos have been assigned to you.`,
        link: "/dashboard/videos",
      },
    });

    return { receipt, assignments };
  });
}

export async function getPendingReceipts(page = 1, limit = 20) {
  const [receipts, total] = await Promise.all([
    prisma.receipt.findMany({
      where: { status: ReceiptStatus.PENDING },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.receipt.count({
      where: { status: ReceiptStatus.PENDING },
    }),
  ]);

  return { receipts, total, page, limit };
}
```

```typescript
// src/lib/queries/video.ts

import { prisma } from "@/lib/prisma";

export async function getUserVideos(userId: string) {
  return await prisma.videoAssignment.findMany({
    where: { userId },
    include: {
      video: true,
    },
    orderBy: { assignedAt: "desc" },
  });
}

export async function assignVideosToUsers(
  userIds: string[],
  videoIds: string[]
) {
  const assignments = [];

  for (const userId of userIds) {
    for (const videoId of videoIds) {
      try {
        const assignment = await prisma.videoAssignment.create({
          data: { userId, videoId },
        });
        assignments.push(assignment);

        // Create notification
        await prisma.notification.create({
          data: {
            userId,
            type: "VIDEO_ASSIGNED",
            title: "New Training Video",
            message: "A new training video has been assigned to you.",
            link: "/dashboard/videos",
          },
        });
      } catch (error) {
        // Skip if already assigned (unique constraint)
        console.error(`Failed to assign video ${videoId} to user ${userId}`);
      }
    }
  }

  return assignments;
}
```

### 6.5 Email Service

```typescript
// src/lib/email.ts

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReceiptApprovedEmail(
  to: string,
  userName: string,
  videoCount: number
) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: "Payment Approved - Training Videos Available",
      html: `
        <h1>Hello ${userName},</h1>
        <p>Great news! Your payment has been approved.</p>
        <p>You now have access to <strong>${videoCount} training videos</strong>.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/videos">View Your Videos</a></p>
        <p>Best regards,<br/>Your Fitness Coach Team</p>
      `,
    });
  } catch (error) {
    console.error("Email send error:", error);
    // Don't throw - email failure shouldn't block the process
  }
}

export async function sendReceiptRejectedEmail(
  to: string,
  userName: string,
  reason: string
) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: "Payment Receipt Update",
      html: `
        <h1>Hello ${userName},</h1>
        <p>We've reviewed your payment receipt.</p>
        <p><strong>Status:</strong> Needs Review</p>
        <p><strong>Note:</strong> ${reason}</p>
        <p>Please contact us or submit a new receipt if needed.</p>
        <p>Best regards,<br/>Your Fitness Coach Team</p>
      `,
    });
  } catch (error) {
    console.error("Email send error:", error);
  }
}
```

---

## 7. Security Checklist

### Input Validation
- ✅ Use Zod schemas for all API request validation
- ✅ Sanitize file names (remove special characters)
- ✅ Validate file types using MIME type checking
- ✅ Enforce file size limits (receipts: 10MB, videos: 500MB)
- ✅ Validate email format before signup
- ✅ Strong password requirements (min 8 chars, 1 uppercase, 1 number)
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ XSS prevention (React auto-escaping + DOMPurify for rich text)

### Authentication & Authorization
- ✅ HTTP-only cookies for session tokens
- ✅ CSRF protection (NextAuth built-in)
- ✅ Role-based access control (middleware + API checks)
- ✅ Password hashing with bcrypt (10+ rounds)
- ✅ Session expiration (30 days, configurable)
- ✅ Prevent user enumeration (same error message for invalid email/password)

### File Upload Security
- ✅ Presigned URLs with expiration (1 hour)
- ✅ Direct browser-to-S3 upload (no server proxy)
- ✅ Content-Type validation on presigned URL generation
- ✅ Content-Length header to prevent oversized uploads
- ✅ Unique file names with timestamp + UUID
- ✅ Separate buckets/prefixes for different file types
- ✅ CORS configuration on ArvanCloud (only allow your domain)

### Rate Limiting
```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis client (use Upstash or local Redis)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different limits for different endpoints
export const ratelimit = {
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 requests per 15 minutes
  }),
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "1 m"), // 50 requests per minute
  }),
  upload: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 uploads per hour
  }),
};

// Usage in API route
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await ratelimit.upload.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }
  
  // ... rest of handler
}
```

### API Security
- ✅ Validate session on every protected API route
- ✅ Check user ownership before data access (e.g., can only view own receipts)
- ✅ Admin-only endpoints verified with role check
- ✅ Prevent mass assignment (explicitly define allowed fields)
- ✅ Use prepared statements (Prisma handles this)
- ✅ Sanitize database query inputs

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use different secrets for dev/staging/production
- ✅ Rotate secrets regularly
- ✅ Use 32+ character random strings for secrets

### CORS Configuration
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_APP_URL },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};
```

---

## 8. Testing Plan

### Testing Stack
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event msw
npm install -D playwright @playwright/test
npm install -D supertest @types/supertest
```

### Unit Tests (Vitest)

```typescript
// src/lib/__tests__/arvancloud.test.ts

import { describe, it, expect, vi } from "vitest";
import { generatePresignedUrl } from "../arvancloud";

describe("ArvanCloud", () => {
  it("should generate presigned URL for valid receipt", async () => {
    const result = await generatePresignedUrl(
      "receipt.pdf",
      "application/pdf",
      1024 * 1024, // 1MB
      "receipt"
    );

    expect(result.uploadUrl).toContain("X-Amz-Signature");
    expect(result.fileUrl).toBeTruthy();
    expect(result.key).toMatch(/^receipts\/\d+-receipt\.pdf$/);
  });

  it("should reject oversized files", async () => {
    await expect(
      generatePresignedUrl(
        "large.pdf",
        "application/pdf",
        20 * 1024 * 1024, // 20MB (exceeds 10MB limit)
        "receipt"
      )
    ).rejects.toThrow("File size exceeds maximum");
  });

  it("should reject invalid file types", async () => {
    await expect(
      generatePresignedUrl(
        "malicious.exe",
        "application/exe",
        1024,
        "receipt"
      )
    ).rejects.toThrow("File type");
  });
});
```

```typescript
// src/lib/__tests__/queries.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../prisma";
import { approveReceipt } from "../queries/receipt";

describe("Receipt Queries", () => {
  beforeEach(async () => {
    // Clean database before each test
    await prisma.notification.deleteMany();
    await prisma.videoAssignment.deleteMany();
    await prisma.receipt.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should approve receipt and assign videos", async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "hashedpassword",
        name: "Test User",
      },
    });

    // Create test receipt
    const receipt = await prisma.receipt.create({
      data: {
        userId: user.id,
        fileUrl: "https://example.com/receipt.pdf",
        fileName: "receipt.pdf",
        fileType: "application/pdf",
        fileSize: 1024,
      },
    });

    // Create test videos
    const video1 = await prisma.video.create({
      data: {
        title: "Video 1",
        videoUrl: "https://example.com/video1.mp4",
      },
    });

    // Approve receipt
    const result = await approveReceipt(
      receipt.id,
      "admin-id",
      [video1.id],
      "Approved!"
    );

    expect(result.receipt.status).toBe("APPROVED");
    expect(result.assignments).toHaveLength(1);

    // Check notification was created
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
    });
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe("RECEIPT_APPROVED");
  });
});
```

### Integration Tests (API Routes)

```typescript
// src/app/api/__tests__/user-receipt.test.ts

import { describe, it, expect } from "vitest";
import { POST, GET } from "../user/receipt/route";
import { NextRequest } from "next/server";

// Mock NextAuth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(() => ({
    user: { id: "user-123", email: "test@example.com", role: "USER" },
  })),
}));

describe("POST /api/user/receipt", () => {
  it("should create receipt for authenticated user", async () => {
    const request = new NextRequest("http://localhost:3000/api/user/receipt", {
      method: "POST",
      body: JSON.stringify({
        fileUrl: "https://storage.com/receipt.pdf",
        fileName: "receipt.pdf",
        fileType: "application/pdf",
        fileSize: 1024000,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.receipt).toBeDefined();
    expect(data.receipt.status).toBe("PENDING");
  });

  it("should reject unauthenticated requests", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = new NextRequest("http://localhost:3000/api/user/receipt", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/user-flow.spec.ts

import { test, expect } from "@playwright/test";

test.describe("User Receipt Flow", () => {
  test("complete user journey from signup to video access", async ({ page }) => {
    // 1. Signup
    await page.goto("/signup");
    await page.fill('input[name="email"]', "newuser@example.com");
    await page.fill('input[name="password"]', "Password123!");
    await page.fill('input[name="name"]', "New User");
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL("/dashboard");

    // 2. Fill body info
    await page.goto("/dashboard/body-info");
    await page.fill('input[name="height"]', "175");
    await page.fill('input[name="weight"]', "70");
    await page.fill('input[name="age"]', "30");
    await page.fill('textarea[name="goals"]', "Build muscle");
    await page.click('button[type="submit"]');
    
    await expect(page.locator("text=Saved successfully")).toBeVisible();

    // 3. Upload receipt
    await page.goto("/dashboard/receipt");
    await page.setInputFiles('input[type="file"]', "test-fixtures/receipt.pdf");
    await page.click('button:has-text("Submit Receipt")');
    
    await expect(page.locator("text=uploaded successfully")).toBeVisible();

    // 4. Check videos (should be empty before approval)
    await page.goto("/dashboard/videos");
    await expect(page.locator("text=No videos assigned yet")).toBeVisible();
  });
});

test.describe("Admin Receipt Approval", () => {
  test("admin can approve receipt and assign videos", async ({ page }) => {
    // Login as admin
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@example.com");
    await page.fill('input[name="password"]', "AdminPass123!");
    await page.click('button[type="submit"]');

    // Go to receipts
    await page.goto("/admin/receipts");
    
    // Find pending receipt
    const firstReceipt = page.locator('[data-testid="receipt-row"]').first();
    await expect(firstReceipt).toContainText("PENDING");
    
    // Open approval modal
    await firstReceipt.locator('button:has-text("Review")').click();
    
    // Select videos
    await page.check('input[type="checkbox"][data-video-id]');
    
    // Approve
    await page.click('button:has-text("Approve")');
    
    await expect(page.locator("text=approved successfully")).toBeVisible();
  });
});
```

### Test Commands

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## 9. Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fitness_coach"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# ArvanCloud S3
ARVAN_ENDPOINT="https://s3.ir-thr-at1.arvanstorage.ir"
ARVAN_ACCESS_KEY="your-access-key"
ARVAN_SECRET_KEY="your-secret-key"
ARVAN_BUCKET_NAME="fitness-coach-media"
ARVAN_CDN_URL="https://your-bucket.cdn.arvanstorage.ir"

# Email (Resend - or use Iranian alternatives)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="noreply@yourfitness.com"

# Rate Limiting (Upstash Redis - or use Iranian alternatives)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 10. Deployment & CI/CD

### Option 1: Vercel + Neon (International)

#### Neon Setup (PostgreSQL)
```bash
# Install Neon CLI
npm i -g neonctl

# Create project
neonctl projects create --name fitness-coach

# Get connection string
neonctl connection-string fitness-coach

# Add to Vercel environment variables
```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... add all other env vars
```

### Option 2: Iranian Services

#### Database Options
1. **Parspack PostgreSQL**: https://parspack.com
2. **Abrak Cloud**: https://abrak.cloud
3. **Fandogh**: https://fandogh.cloud

#### Hosting Options
1. **ArvanCloud PaaS**: https://panel.arvancloud.ir
2. **Fandogh**: Supports Docker containers
3. **Liara**: https://liara.ir (good Next.js support)

#### Liara Deployment Example

```bash
# Install Liara CLI
npm i -g @liara/cli

# Login
liara login

# Create app
liara create --app fitness-coach --platform next

# Deploy
liara deploy --app fitness-coach --port 3000

# Set env vars
liara env:set DATABASE_URL="postgresql://..." --app fitness-coach
liara env:set NEXTAUTH_SECRET="..." --app fitness-coach
```

```yaml
# liara.yaml
app: fitness-coach
platform: next
port: 3000

build:
  args:
    - DATABASE_URL=$DATABASE_URL

run:
  - npx prisma migrate deploy
  - npm run build

cron:
  - command: node scripts/cleanup-old-notifications.js
    schedule: "0 2 * * *"  # Daily at 2 AM
```

### CI/CD with GitHub Actions

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run migrations
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        run: npx prisma migrate deploy

      - name: Run unit tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        run: npm run test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  deploy:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

---

## 11. Week-by-Week Implementation Roadmap

### **Week 1: Foundation & Setup (40-50 hours)**

**Milestone 1.1: Project Setup & Database** (12 hours)
- Initialize Next.js project with TypeScript
- Setup Tailwind CSS v4
- Configure Prisma with PostgreSQL
- Create and run initial migrations
- Setup development environment (ESLint, Prettier)

**Acceptance Criteria:**
- ✅ Next.js app runs on localhost:3000
- ✅ Database connection successful
- ✅ Prisma Studio can view tables
- ✅ Git repository initialized with proper .gitignore

**Milestone 1.2: Authentication System** (15 hours)
- Implement NextAuth.js with Prisma adapter
- Create signup/login pages with form validation
- Setup session management and JWT
- Implement middleware for route protection
- Create user role system (USER/ADMIN)

**Acceptance Criteria:**
- ✅ Users can sign up with email/password
- ✅ Users can log in and log out
- ✅ Sessions persist across page refreshes
- ✅ Protected routes redirect to login
- ✅ Password is hashed with bcrypt

**Milestone 1.3: Public Pages** (15 hours)
- Design and build home page (hero, features, testimonials)
- Create About page
- Build basic Shop page (product listing)
- Create Blog listing page
- Build Contact page with form
- Implement responsive navigation

**Acceptance Criteria:**
- ✅ All public pages accessible without login
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ Navigation between pages works smoothly
- ✅ Contact form validates input

**Milestone 1.4: ArvanCloud Integration** (8 hours)
- Setup ArvanCloud S3 bucket
- Configure CORS and bucket policies
- Implement presigned URL generation
- Test file upload flow
- Add file validation (type, size)

**Acceptance Criteria:**
- ✅ Presigned URLs generated successfully
- ✅ Files upload directly to ArvanCloud
- ✅ File size/type validation works
- ✅ Uploaded files accessible via CDN URL

---

### **Week 2: User Dashboard & Core Features (40-50 hours)**

**Milestone 2.1: User Dashboard Layout** (8 hours)
- Create dashboard layout with sidebar
- Build dashboard overview page (stats cards)
- Implement profile page
- Add notification bell component
- Setup TanStack Query for data fetching

**Acceptance Criteria:**
- ✅ Dashboard accessible only to logged-in users
- ✅ Sidebar navigation works
- ✅ Profile shows user information
- ✅ Loading states display correctly

**Milestone 2.2: Body Information Form** (10 hours)
- Design body info form (height, weight, age, diet, goals, medical notes)
- Implement form validation with Zod
- Create API endpoint for saving body info
- Build edit functionality
- Add success/error notifications

**Acceptance Criteria:**
- ✅ Form validates all required fields
- ✅ Data saves to database
- ✅ Users can edit existing body info
- ✅ Validation errors display clearly
- ✅ Success message after save

**Milestone 2.3: Receipt Upload System** (12 hours)
- Build receipt upload UI component
- Implement file picker with preview
- Create presigned URL request flow
- Implement direct browser-to-S3 upload with progress
- Create API endpoint to save receipt metadata
- Build receipt history view

**Acceptance Criteria:**
- ✅ Users can upload images and PDFs
- ✅ Upload progress shows percentage
- ✅ Receipt appears in user's history
- ✅ Status shows as "PENDING"
- ✅ Error handling for failed uploads

**Milestone 2.4: Video Assignment View** (12 hours)
- Create video listing page for users
- Build video player component
- Implement "mark as watched" functionality
- Create API endpoint to fetch assigned videos
- Add video filtering by category
- Build empty state for no videos

**Acceptance Criteria:**
- ✅ Assigned videos display in list
- ✅ Video player works smoothly
- ✅ "Watched" status saves to database
- ✅ Empty state shows before approval
- ✅ Videos load with pagination

**Milestone 2.5: Notification System** (8 hours)
- Create notification model and API
- Build notification dropdown component
- Implement real-time unread count
- Add mark as read functionality
- Create notification preferences

**Acceptance Criteria:**
- ✅ Notifications appear in dropdown
- ✅ Unread count displays accurately
- ✅ Clicking notification marks as read
- ✅ Links navigate correctly

---

### **Week 3: Admin Panel (40-50 hours)**

**Milestone 3.1: Admin Dashboard & Layout** (8 hours)
- Create admin-only layout with navigation
- Build admin dashboard with statistics
- Implement role-based access control
- Add admin middleware protection
- Create stat cards (users, pending receipts, videos)

**Acceptance Criteria:**
- ✅ Only admin users can access /admin
- ✅ Non-admin users redirected to dashboard
- ✅ Statistics display correctly
- ✅ Navigation between admin sections works

**Milestone 3.2: User Management** (12 hours)
- Build user listing table with search/filter
- Create user detail view
- Display user's body info and receipts
- Show assigned videos per user
- Implement pagination

**Acceptance Criteria:**
- ✅ All users listed in table
- ✅ Search by email works
- ✅ Clicking user shows details
- ✅ Pagination works smoothly

**Milestone 3.3: Receipt Approval System** (15 hours)
- Build pending receipts queue
- Create receipt review modal
- Implement file preview (image/PDF)
- Build video selection interface
- Create approve/reject API endpoints
- Implement approval workflow with video assignment
- Add email notification on approval/rejection

**Acceptance Criteria:**
- ✅ Pending receipts display in queue
- ✅ Admin can view receipt file
- ✅ Multiple videos can be selected for assignment
- ✅ Approval updates status and assigns videos
- ✅ User receives email notification
- ✅ In-app notification created

**Milestone 3.4: Video Management** (15 hours)
- Create video upload interface
- Build video listing with search/filter
- Implement video CRUD operations
- Create video assignment interface (bulk assign)
- Add video categories
- Build video edit/delete functionality

**Acceptance Criteria:**
- ✅ Admin can upload videos to ArvanCloud
- ✅ Videos listed with thumbnails
- ✅ Admin can edit video details
- ✅ Bulk video assignment works
- ✅ Delete removes video and assignments

---

### **Week 4: Shop & Blog CMS (35-45 hours)**

**Milestone 4.1: Product Management** (12 hours)
- Build product CRUD interface
- Create product form (title, description, price, image)
- Implement product listing for admin
- Add image upload for products
- Build product status toggle (in stock)

**Acceptance Criteria:**
- ✅ Admin can create products
- ✅ Products display with images
- ✅ Edit and delete work
- ✅ Stock status updates

**Milestone 4.2: Public Shop** (8 hours)
- Build public product listing page
- Create product detail page
- Implement product grid with responsive design
- Add filters (in stock, price range)
- Style product cards

**Acceptance Criteria:**
- ✅ Products visible on public shop page
- ✅ Product details show on click
- ✅ Responsive on all devices
- ✅ Out-of-stock products clearly marked

**Milestone 4.3: Blog Management** (12 hours)
- Build blog post CRUD interface
- Create rich text editor for content
- Implement slug generation
- Add publish/draft functionality
- Create blog post listing for admin
- Add cover image upload

**Acceptance Criteria:**
- ✅ Admin can create blog posts
- ✅ Rich text formatting works
- ✅ Draft posts not publicly visible
- ✅ Published posts appear on blog

**Milestone 4.4: Public Blog** (8 hours)
- Build public blog listing page
- Create blog post detail page
- Implement pagination
- Add reading time estimate
- Style blog cards and post page

**Acceptance Criteria:**
- ✅ Published posts visible
- ✅ Post content renders correctly
- ✅ Pagination works
- ✅ SEO meta tags present

---

### **Week 5: Polish, Testing & Deployment (35-45 hours)**

**Milestone 5.1: Security Hardening** (10 hours)
- Implement rate limiting on all endpoints
- Add input sanitization
- Setup CORS policies
- Implement CSP headers
- Add request validation middleware
- Review and fix security vulnerabilities

**Acceptance Criteria:**
- ✅ Rate limits prevent abuse
- ✅ All inputs validated and sanitized
- ✅ CORS configured correctly
- ✅ Security scan passes

**Milestone 5.2: Testing** (12 hours)
- Write unit tests for utilities and queries
- Create integration tests for API routes
- Write E2E tests for critical user flows
- Test email sending
- Test file uploads
- Fix bugs found in testing

**Acceptance Criteria:**
- ✅ 80%+ code coverage
- ✅ All API routes tested
- ✅ E2E tests pass for signup → video access flow
- ✅ E2E tests pass for admin approval flow

**Milestone 5.3: Performance Optimization** (8 hours)
- Optimize images (next/image)
- Implement lazy loading
- Add React Query caching strategies
- Optimize database queries (add indexes)
- Setup bundle analyzer
- Reduce bundle size

**Acceptance Criteria:**
- ✅ Lighthouse score >90
- ✅ First contentful paint <2s
- ✅ No unnecessary re-renders
- ✅ Database queries optimized

**Milestone 5.4: Deployment & Monitoring** (10 hours)
- Setup production database (Neon/Supabase or Iranian alternative)
- Configure ArvanCloud production bucket
- Deploy to Vercel/Liara
- Setup environment variables
- Configure custom domain
- Setup error tracking (Sentry)
- Create backup strategy

**Acceptance Criteria:**
- ✅ Application deployed and accessible
- ✅ All features work in production
- ✅ Environment variables configured
- ✅ HTTPS enabled
- ✅ Error tracking active

**Milestone 5.5: Documentation & Handoff** (5 hours)
- Write README with setup instructions
- Document API endpoints
- Create admin user guide
- Write deployment guide
- Document environment variables

**Acceptance Criteria:**
- ✅ README complete
- ✅ API documentation clear
- ✅ Setup instructions tested

---

## 12. Shell Commands Reference

```bash
# Initial Setup
npx create-next-app@latest fitness-coach-platform --typescript --tailwind --app --eslint
cd fitness-coach-platform

# Install Dependencies
npm install @prisma/client @auth/prisma-adapter
npm install next-auth bcryptjs zod
npm install @tanstack/react-query zustand
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install resend
npm install @upstash/ratelimit @upstash/redis

# Dev Dependencies
npm install -D prisma
npm install -D @types/bcryptjs @types/node
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test

# Prisma Setup
npx prisma init
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio

# Development
npm run dev

# Build & Production
npm run build
npm run start

# Testing
npm run test
npm run test:e2e
npm run lint

# Deployment
vercel --prod
# or
liara deploy --app fitness-coach --platform next
```

---

## 13. Additional Recommendations

### State Management Strategy
- **Server State**: Use TanStack Query for all API data
- **Client State**: Use Zustand only for UI state (modals, notifications)
- **Form State**: Use React Hook Form with Zod validation

### Code Organization Tips
- Keep components under 300 lines
- Extract repeated logic into custom hooks
- Use server components by default, client components only when needed
- Colocate related files (component + styles + tests)

### Iranian Service Alternatives

**Storage (ArvanCloud alternatives):**
- Parspack Object Storage: https://parspack.com
- Abrak Storage: https://abrak.cloud

**Email Service:**
- Mailfa: https://mailfa.com (Iranian email service)
- Kavenegar SMS (for SMS notifications): https://kavenegar.com
- Or use Gmail SMTP for development

**Monitoring:**
- Uptime monitoring: UptimeRobot (free tier)
- Error tracking: Sentry (free tier) or self-hosted alternatives

---

## Summary

This architecture provides you with:
- ✅ Complete project structure following Next.js App Router best practices
- ✅ Scalable database schema with proper relationships
- ✅ Secure authentication with role-based access
- ✅ Direct browser-to-cloud file uploads (no server bottleneck)
- ✅ Production-ready API design with type safety
- ✅ Comprehensive security measures
- ✅ Realistic 5-week timeline for solo developer
- ✅ Testing strategy and CI/CD pipeline
- ✅ Multiple deployment options (international + Iranian)

**Estimated Total Time: 190-240 hours (5-6 weeks full-time, or 10-12 weeks part-time)**

Good luck with your build! 🚀