export interface Tutor {
  name: string;
  qualification: string;
  experience: number;
  rating: number;
  image: string;
  bio?: string;
  userId?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  tutor: Tutor;
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
  date?: string; // Client-side virtual field
}

export interface FetchListingsParams {
  q?: string;
  categoryId?: string;
  subCategoryId?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  targetClass?: string;
  city?: string;
  mode?: string;
}
