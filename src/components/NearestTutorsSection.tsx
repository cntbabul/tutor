"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface TutorListing {
  id: string;
  title: string;
  price: number;
  location: string;
  category: string;
  subCategory: string;
  images: string[];
  isFeatured?: boolean;
  isElite?: boolean;
  date?: string;
  tutor: {
    name: string;
    qualification: string;
  };
}

export default function NearestTutorsSection() {
  const [tutors, setTutors] = useState<TutorListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch nearest tutors (for now, fetching all listings from our API)
    const fetchTutors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/listings");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        
        // Add mock elite/featured flags for demonstration if not provided by backend
        const enhancedData = data.map((tutor: any, index: number) => ({
          ...tutor,
          isElite: index % 2 === 0, // Alternate elite status
          isFeatured: index % 3 === 0, // Alternate featured status
          date: index === 0 ? "TODAY" : index === 1 ? "YESTERDAY" : `${index + 2} DAYS AGO`
        }));
        
        setTutors(enhancedData);
      } catch (error) {
        console.error("Error fetching nearest tutors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Your Nearest Tutors</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[280px] h-[300px] shrink-0 bg-gray-100 animate-pulse rounded border border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tutors.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[22px] font-normal text-[#002f34]">Your Nearest Tutors</h2>
        <a href="#" className="text-sm font-bold text-gray-900 underline hover:no-underline">
          View more
        </a>
      </div>
      
      {/* Horizontal scrolling container */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {tutors.map((tutor) => (
          <ProductCard key={tutor.id} product={tutor} />
        ))}
      </div>
    </div>
  );
}
