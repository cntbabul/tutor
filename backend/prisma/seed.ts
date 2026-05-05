import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

dotenv.config();

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing data
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tutor.deleteMany();
  await prisma.user.deleteMany();

  // 2. Categories & Subcategories
  const categoriesData = [
    { name: "Lower Primary", slug: "lower-primary", classes: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] },
    { name: "ME", slug: "me", classes: ["Class 6", "Class 7", "Class 8"] },
    { name: "High School", slug: "high-school", classes: ["Class 9", "Class 10"] },
    { name: "HS", slug: "hs", classes: ["Class 11", "Class 12"] },
    { name: "Others", slug: "others", classes: ["Degree", "Competitive Exams"] },
  ];

  for (const cat of categoriesData) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        subCategories: {
          create: cat.classes.map(cls => ({
            name: cls,
            slug: cls.toLowerCase().replace(/\s+/g, "-"),
          })),
        },
      },
      include: {
        subCategories: true,
      }
    });
    console.log(`Created category: ${category.name}`);
  }

  // 3. Tutors and Listings
  const tutorsData = [
    {
      name: "Anjali Sharma",
      email: "anjali@example.com",
      qualification: "M.Sc in Biology",
      experience: 5,
      bio: "I provide comprehensive science tuition for young learners. Focusing on conceptual clarity and fun learning.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      listings: [
        {
          title: "Expert Science Tutor for Classes 1-5",
          description: "I provide comprehensive science tuition for young learners. Focusing on conceptual clarity and fun learning.",
          price: 500,
          categoryName: "Lower Primary",
          subCategoryName: "Class 1",
          subjects: ["Science", "EVS"],
        }
      ]
    },
    {
      name: "Rahul Verma",
      email: "rahul@example.com",
      qualification: "B.Tech, IIT Madras",
      experience: 3,
      bio: "Preparing students for board exams with intensive math practice and doubt clearing sessions.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      listings: [
        {
          title: "Mathematics Specialist for High School (Class 9-10)",
          description: "Preparing students for board exams with intensive math practice and doubt clearing sessions.",
          price: 800,
          categoryName: "High School",
          subCategoryName: "Class 10",
          subjects: ["Mathematics"],
        }
      ]
    },
    {
      name: "Priya Das",
      email: "priya@example.com",
      qualification: "M.A. in English",
      experience: 8,
      bio: "Master English grammar and explore classic literature. Specialized coaching for Class 11 & 12 students.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      listings: [
        {
          title: "English Grammar & Literature - HS Level",
          description: "Master English grammar and explore classic literature. Specialized coaching for Class 11 & 12 students.",
          price: 600,
          categoryName: "HS",
          subCategoryName: "Class 12",
          subjects: ["English", "Literature"],
        }
      ]
    }
  ];

  for (const t of tutorsData) {
    const user = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        image: t.image,
        role: "TUTOR",
        tutor: {
          create: {
            bio: t.bio,
            qualification: t.qualification,
            experience: t.experience,
            hourlyRate: t.listings[0].price,
            rating: 4.5 + Math.random() * 0.5,
          }
        }
      },
      include: {
        tutor: true,
      }
    });

    const tutor = user.tutor!;

    for (const l of t.listings) {
      const category = await prisma.category.findUnique({ where: { name: l.categoryName } });
      const subCategory = await prisma.subCategory.findFirst({
        where: { name: l.subCategoryName, categoryId: category?.id }
      });

      if (category && subCategory) {
        await prisma.listing.create({
          data: {
            title: l.title,
            description: l.description,
            price: l.price,
            subjects: l.subjects,
            tutorId: tutor.id,
            categoryId: category.id,
            subCategoryId: subCategory.id,
            targetClasses: [l.subCategoryName], // default to the primary subcategory class
            mode: "OFFLINE",
            latitude: 12.9716 + (Math.random() - 0.5) * 0.1, // Mock Bangalore coords
            longitude: 77.5946 + (Math.random() - 0.5) * 0.1,
            locationName: "Indiranagar, Bangalore",
            city: "Bangalore",
          }
        });
      }
    }
    console.log(`Created tutor & listings for: ${t.name}`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
