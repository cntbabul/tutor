import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function seed() {
  // Create user
  const user = await prisma.user.create({
    data: {
      email: `tutor${Date.now()}@example.com`,
      name: "Rahul Sharma",
      role: "TUTOR",
      image: "https://images.unsplash.com/photo-1568602471122-78329su12a?w=400&q=80"
    }
  });

  // Create tutor
  const tutor = await prisma.tutor.create({
    data: {
      userId: user.id,
      bio: "Expert Mathematics Tutor",
      qualification: "M.Sc Mathematics",
      experience: 8,
      hourlyRate: 500,
      rating: 4.8,
      isVerified: true
    }
  });

  // Create categories
  let category = await prisma.category.findFirst({ where: { slug: "high-school" } });
  if (!category) {
    category = await prisma.category.create({
      data: { name: "High School", slug: "high-school" }
    });
  }

  let subCategory = await prisma.subCategory.findFirst({ where: { slug: "class-10" } });
  if (!subCategory) {
    subCategory = await prisma.subCategory.create({
      data: { name: "Class 10", slug: "class-10", categoryId: category.id }
    });
  }

  // Create listings
  await prisma.listing.create({
    data: {
      title: "Mathematics for Class 10 (CBSE/SEBA)",
      description: "Complete coverage of syllabus with weekly tests.",
      subjects: ["Mathematics", "Science"],
      tutorId: tutor.id,
      categoryId: category.id,
      subCategoryId: subCategory.id,
      price: 500
    }
  });

  await prisma.listing.create({
    data: {
      title: "Physics Crash Course Class 12",
      description: "Quick revision for board exams.",
      subjects: ["Physics"],
      tutorId: tutor.id,
      categoryId: category.id,
      subCategoryId: subCategory.id,
      price: 800
    }
  });

  console.log("Seeded database with mock listings!");
}

seed().catch(console.error);
