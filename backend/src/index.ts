import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import ImageKit from "imagekit";

dotenv.config();

neonConfig.webSocketConstructor = ws;

const app = express();
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5000;

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-user-id", "Authorization"]
}));
app.use(express.json());

// Routes
app.get("/api/listings", async (req, res) => {
  const { q } = req.query;
  
  try {
    const listings = await prisma.listing.findMany({
      where: q ? {
        OR: [
          { title: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } },
          { category: { name: { contains: q as string, mode: 'insensitive' } } },
          { subCategory: { name: { contains: q as string, mode: 'insensitive' } } },
        ]
      } : {},
      include: {
        tutor: {
          include: {
            user: true
          }
        },
        category: true,
        subCategory: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map to match the frontend expected format if necessary
    const formattedListings = listings.map(l => ({
      id: l.id,
      title: l.title,
      description: l.description,
      price: l.price,
      location: "India", // Placeholder or from tutor profile if added
      tutor: {
        name: l.tutor.user.name,
        qualification: l.tutor.qualification,
        experience: l.tutor.experience,
        rating: l.tutor.rating,
        image: l.tutor.user.image,
      },
      category: l.category.name,
      subCategory: l.subCategory.name,
      images: ["https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"], // Placeholder
      isFeatured: false
    }));

    res.json(formattedListings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        tutor: {
          include: {
            user: true
          }
        },
        category: true,
        subCategory: true,
      }
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const formattedListing = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: "India",
      tutor: {
        name: listing.tutor.user.name,
        qualification: listing.tutor.qualification,
        experience: listing.tutor.experience,
        rating: listing.tutor.rating,
        image: listing.tutor.user.image,
        bio: listing.tutor.bio
      },
      category: listing.category.name,
      subCategory: listing.subCategory.name,
      subjects: listing.subjects,
      images: ["https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"],
      isFeatured: false
    };

    res.json(formattedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true
      }
    });
    
    const formattedCategories = categories.map(c => ({
      name: c.name,
      slug: c.slug,
      classes: c.subCategories.map(sc => sc.name)
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/api/users/profile", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        tutor: {
          include: {
            listings: {
              include: {
                category: true,
                subCategory: true
              }
            }
          }
        } 
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

app.post("/api/users/profile", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const { name, email, image, role, bio, qualification, experience, hourlyRate } = req.body;
  
  if (!userId || !email) {
    return res.status(400).json({ error: "Missing userId or email" });
  }

  try {
    // Upsert User
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { name, email, image, role },
      create: { id: userId, name, email, image, role }
    });

    // If role is TUTOR, upsert Tutor details
    let tutor = null;
    if (role === "TUTOR" && bio) {
      tutor = await prisma.tutor.upsert({
        where: { userId: userId },
        update: { bio, qualification, experience: Number(experience), hourlyRate: Number(hourlyRate) },
        create: { 
          userId: userId, 
          bio, 
          qualification, 
          experience: Number(experience), 
          hourlyRate: Number(hourlyRate),
          isVerified: false
        }
      });
    }

    res.json({ ...user, tutor });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to save user profile" });
  }
});

app.post("/api/listings", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const { 
    title, 
    description, 
    price, 
    category, 
    location, 
    phone,
    images,
    priceType,
    pricingDetails
  } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // 1. Get or create the User
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@clerk.user`, // Placeholder since we don't have email here
          name: "New User",
          role: "TUTOR"
        }
      });
    }

    // 2. Get or create the Tutor profile
    let tutor = await prisma.tutor.findUnique({ where: { userId: user.id } });
    if (!tutor) {
      tutor = await prisma.tutor.create({
        data: {
          userId: user.id,
          bio: "New Tutor",
          qualification: "N/A",
          experience: 0,
          hourlyRate: Number(price) || 0,
        }
      });
    }

    // 3. Get or create Category and SubCategory
    // We'll treat the 'category' from frontend as the subcategory name for simplicity
    // and put it under a generic "Education & Classes" parent.
    const parentCategoryName = "Education & Classes";
    const parentCategorySlug = "education-classes";
    
    const categoryRecord = await prisma.category.upsert({
      where: { slug: parentCategorySlug },
      update: {},
      create: { name: parentCategoryName, slug: parentCategorySlug }
    });

    const subCategorySlug = category.toLowerCase().replace(/\s+/g, '-');
    const subCategoryRecord = await prisma.subCategory.upsert({
      where: { id: `sc-${subCategorySlug}` }, // Mocking ID for upsert if slug isn't unique in schema
      update: {},
      create: { 
        id: `sc-${subCategorySlug}`,
        name: category.charAt(0).toUpperCase() + category.slice(1), 
        slug: subCategorySlug, 
        categoryId: categoryRecord.id 
      }
    });

    // 4. Create the Listing
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: Number(price),
        tutorId: tutor.id,
        categoryId: categoryRecord.id,
        subCategoryId: subCategoryRecord.id,
        subjects: [category], // Placeholder
      }
    });

    res.json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

app.get("/api/imagekit/auth", (req, res) => {
  console.log("ImageKit Auth requested");
  try {
    const result = imagekit.getAuthenticationParameters();
    console.log("Auth result:", result);
    res.json(result);
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    res.status(500).json({ error: "Failed to generate auth parameters" });
  }
});

app.listen(PORT, () => {
  console.log(`Tutor Backend running on http://localhost:${PORT}`);
});
