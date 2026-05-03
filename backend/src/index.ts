import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const app = express();
const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
const adapter = new PrismaNeon(sql);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data for Tutor Marketplace
const MOCK_CATEGORIES = [
  { name: "Lower Primary", slug: "lower-primary", classes: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
  { name: "ME", slug: "me", classes: ["Class 6", "Class 7", "Class 8"] },
  { name: "High School", slug: "high-school", classes: ["Class 9", "Class 10"] },
  { name: "HS", slug: "hs", classes: ["Class 11", "Class 12"] },
  { name: "Others", slug: "others", classes: ["Degree", "Competitive Exams"] },
];

const MOCK_TUTOR_LISTINGS = [
  {
    id: "1",
    title: "Expert Science Tutor for Classes 1-5",
    description: "I provide comprehensive science tuition for young learners. Focusing on conceptual clarity and fun learning.",
    price: 500, // per hour
    location: "Bandra West, Mumbai",
    tutor: {
      name: "Anjali Sharma",
      qualification: "M.Sc in Biology",
      experience: 5,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    },
    category: "Lower Primary",
    subCategory: "Class 1, 2, 3",
    images: ["https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"],
    isFeatured: true,
  },
  {
    id: "2",
    title: "Mathematics Specialist for High School (Class 9-10)",
    description: "Preparing students for board exams with intensive math practice and doubt clearing sessions.",
    price: 800,
    location: "Koramangala, Bengaluru",
    tutor: {
      name: "Rahul Verma",
      qualification: "B.Tech, IIT Madras",
      experience: 3,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    },
    category: "High School",
    subCategory: "Class 10",
    images: ["https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"],
    isFeatured: false,
  },
  {
    id: "3",
    title: "English Grammar & Literature - HS Level",
    description: "Master English grammar and explore classic literature. Specialized coaching for Class 11 & 12 students.",
    price: 600,
    location: "Salt Lake, Kolkata",
    tutor: {
      name: "Priya Das",
      qualification: "M.A. in English",
      experience: 8,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    },
    category: "HS",
    subCategory: "Class 12",
    images: ["https://images.unsplash.com/photo-1524178232363-1fb28f74b0cd?w=800&q=80"],
    isFeatured: true,
  },
];

// Routes
app.get("/api/listings", (req, res) => {
  const { q } = req.query;
  let listings = MOCK_TUTOR_LISTINGS;
  
  if (q && typeof q === "string") {
    const search = q.toLowerCase();
    listings = MOCK_TUTOR_LISTINGS.filter(l => 
      l.title.toLowerCase().includes(search) ||
      l.description.toLowerCase().includes(search) ||
      l.category.toLowerCase().includes(search) ||
      l.subCategory.toLowerCase().includes(search)
    );
  }
  
  res.json(listings);
});

app.get("/api/listings/:id", (req, res) => {
  const { id } = req.params;
  const listing = MOCK_TUTOR_LISTINGS.find(l => l.id === id);
  
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  
  res.json(listing);
});

app.get("/api/categories", (req, res) => {
  res.json(MOCK_CATEGORIES);
});

app.listen(PORT, () => {
  console.log(`Tutor Backend running on http://localhost:${PORT}`);
});
