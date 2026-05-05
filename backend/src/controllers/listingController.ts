import type { Request, Response } from "express";
import prisma from "@/config/db.js";
import type { ListingWithRelations, FormattedListing } from "@/types/types.js";

export const getListings = async (req: Request, res: Response) => {
  const { q, categoryId, subCategoryId, categorySlug, subCategorySlug, targetClass, city, mode } = req.query;

  try {
    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } },
        { category: { name: { contains: q as string, mode: 'insensitive' } } },
        { subCategory: { name: { contains: q as string, mode: 'insensitive' } } },
      ];
    }

    if (categoryId) where.categoryId = categoryId as string;
    if (categorySlug) where.category = { slug: categorySlug as string };
    if (subCategoryId) where.subCategoryId = subCategoryId as string;
    if (subCategorySlug) where.subCategory = { slug: subCategorySlug as string };
    if (targetClass) where.targetClasses = { has: targetClass as string };
    if (city) where.city = { contains: city as string, mode: 'insensitive' };
    if (mode) where.mode = mode as string;

    const listings = await prisma.listing.findMany({
      where,
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

    const formattedListings: FormattedListing[] = (listings as ListingWithRelations[]).map(l => ({
      id: l.id,
      title: l.title,
      description: l.description,
      price: l.price,
      location: l.locationName ?? "India",
      tutor: {
        name: l.tutor?.user?.name ?? "Anonymous Tutor",
        qualification: l.tutor?.qualification ?? "Not specified",
        experience: l.tutor?.experience ?? 0,
        rating: l.tutor?.rating ?? 0,
        image: l.tutor?.user?.image ?? "",
      },
      category: l.category?.name ?? "General",
      subCategory: l.subCategory?.name ?? "Other",
      images: (l.images && l.images.length > 0) ? l.images : ["https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"],
      isFeatured: false,
      mode: l.mode,
      targetClasses: l.targetClasses,
      latitude: l.latitude,
      longitude: l.longitude,
      locationName: l.locationName,
      city: l.city,
      subjects: l.subjects
    }));

    res.json(formattedListings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

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

    const l = listing as ListingWithRelations;
    const formattedListing: FormattedListing = {
      id: l.id,
      title: l.title,
      description: l.description,
      price: l.price,
      location: l.locationName ?? "India",
      tutor: {
        name: l.tutor?.user?.name ?? "Anonymous Tutor",
        qualification: l.tutor?.qualification ?? "Not specified",
        experience: l.tutor?.experience ?? 0,
        rating: l.tutor?.rating ?? 0,
        image: l.tutor?.user?.image ?? "",
        bio: l.tutor?.bio ?? "",
        userId: l.tutor?.userId,
      },
      category: l.category?.name ?? "General",
      subCategory: l.subCategory?.name ?? "Other",
      subjects: l.subjects,
      images: (l.images && l.images.length > 0) ? l.images : ["https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"],
      isFeatured: false,
      mode: l.mode,
      targetClasses: l.targetClasses,
      latitude: l.latitude,
      longitude: l.longitude,
      locationName: l.locationName,
      city: l.city
    };

    res.json(formattedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
};

export const createListing = async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  const {
    title,
    description,
    price,
    categoryId,
    subCategoryId,
    targetClasses,
    mode,
    latitude,
    longitude,
    locationName,
    city,
    images,
    subjects,
    category, // Legacy fallback
  } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@clerk.user`,
          name: "New User",
          role: "TUTOR"
        }
      });
    }

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

    let finalCategoryId = categoryId;
    let finalSubCategoryId = subCategoryId;

    // Legacy fallback if IDs are missing but category string is present
    if (!finalCategoryId && category) {
      const parentCategoryName = "Education & Classes";
      const parentCategorySlug = "education-classes";

      const categoryRecord = await prisma.category.upsert({
        where: { slug: parentCategorySlug },
        update: {},
        create: { name: parentCategoryName, slug: parentCategorySlug }
      });

      const subCategorySlug = category.toLowerCase().replace(/\s+/g, '-');
      const subCategoryRecord = await prisma.subCategory.upsert({
        where: { id: `sc-${subCategorySlug}` },
        update: {},
        create: {
          id: `sc-${subCategorySlug}`,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          slug: subCategorySlug,
          categoryId: categoryRecord.id
        }
      });

      finalCategoryId = categoryRecord.id;
      finalSubCategoryId = subCategoryRecord.id;
    }

    const safePrice = parseFloat(price) || 0;
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: safePrice,
        tutorId: tutor.id,
        categoryId: finalCategoryId,
        subCategoryId: finalSubCategoryId,
        targetClasses: Array.isArray(targetClasses) ? targetClasses : [],
        mode: mode || "OFFLINE",
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        locationName,
        city,
        subjects: Array.isArray(subjects) ? subjects : (category ? [category] : []),
        images: Array.isArray(images) ? images : [],
      }
    });

    res.json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
};

export const updateListing = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.headers["x-user-id"] as string;
  const { 
    title, 
    description, 
    price, 
    images, 
    mode, 
    targetClasses, 
    latitude, 
    longitude, 
    locationName, 
    city,
    subjects 
  } = req.body;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { tutor: true }
    });

    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.tutor.userId !== userId) return res.status(403).json({ error: "Forbidden" });

    const safePrice = parseFloat(price) || listing.price;
    
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        title,
        description,
        price: safePrice,
        images: Array.isArray(images) ? images : listing.images,
        mode: mode || listing.mode,
        targetClasses: Array.isArray(targetClasses) ? targetClasses : listing.targetClasses,
        latitude: latitude ? parseFloat(latitude) : listing.latitude,
        longitude: longitude ? parseFloat(longitude) : listing.longitude,
        locationName: locationName || listing.locationName,
        city: city || listing.city,
        subjects: Array.isArray(subjects) ? subjects : listing.subjects,
      }
    });

    res.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { tutor: true }
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.tutor.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not own this listing" });
    }

    await prisma.listing.delete({
      where: { id }
    });

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};
