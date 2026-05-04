# Tutor Marketplace (OLX Clone)

A high-fidelity marketplace for educational services, built with **Next.js 15 (App Router)**, **React 19**, and **Tailwind CSS v4**.

## 🚀 Features

- **Ad Posting Flow**: Intuitive "Teach" flow to post tutor listings with multi-photo support.
- **Image Management**: Seamless integration with **ImageKit** for optimized image hosting and delivery.
- **User Dashboard**: Dedicated "My Ads" section to manage, edit, and delete your listings.
- **Multi-Image Carousel**: High-performance image sliders for both marketplace cards and detail pages.
- **Modern Search**: Responsive search and category filtering for finding the right tutors.
- **Auth**: Secure user authentication powered by **Clerk (v7)**.
- **Backend**: Robust API built with **Prisma 7** and **Neon PostgreSQL**.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui.
- **State & Data**: TanStack Query (React Query v5), Axios.
- **Auth**: Clerk.
- **Database**: Prisma 7, Neon (PostgreSQL).
- **Storage**: ImageKit.io.

## 📦 Project Structure

- `src/app/`: Next.js App Router (Pages & Layouts).
- `src/components/`: Reusable UI components.
- `src/lib/api.ts`: Centralized, authenticated API client (Axios).
- `src/hooks/`: Custom hooks using TanStack Query for reactive data fetching.
- `backend/`: Express server handling business logic and database interactions.

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (Latest LTS)
- Clerk Account
- ImageKit.io Account
- Neon Database instance

### 2. Environment Variables
Create a `.env.local` in the root directory:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=...
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=...
IMAGEKIT_PRIVATE_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Installation
```bash
npm install
cd backend && npm install
```

### 4. Running Development
```bash
# Terminal 1 (Frontend)
npm run dev

# Terminal 2 (Backend)
cd backend && npm run dev
```

## 📜 Rules for AI Agents
Detailed project rules and architectural guidelines can be found in [AGENTS.md](./AGENTS.md).
