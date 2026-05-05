import { Prisma } from "@prisma/client";

/**
 * Modern Prisma Payload Types
 * These automatically infer the shape of the data based on includes
 */

export type ListingWithRelations = Prisma.ListingGetPayload<{
  include: {
    tutor: {
      include: {
        user: true
      }
    },
    category: true,
    subCategory: true,
  }
}>;

export type UserWithTutorProfile = Prisma.UserGetPayload<{
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
}>;

export type CategoryWithSubCategories = Prisma.CategoryGetPayload<{
  include: {
    subCategories: true
  }
}>;

/**
 * API Response Interfaces
 * These define the contract with the frontend
 */

export interface FormattedTutor {
  name: string;
  qualification: string;
  experience: number;
  rating: number;
  image: string;
  bio?: string;
  userId?: string;
}

export interface FormattedListing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  tutor: FormattedTutor;
  category: string;
  subCategory: string;
  images: string[];
  isFeatured: boolean;
  subjects?: string[];
  mode: string;
  targetClasses: string[];
  latitude?: number | null;
  longitude?: number | null;
  locationName?: string | null;
  city?: string | null;
}

export interface ImageKitOptions {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
}
