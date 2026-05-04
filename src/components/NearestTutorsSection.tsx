"use client";

import { useEffect, useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { API_URL } from "@/lib/constants";
import { useProducts } from "@/hooks/useProducts";

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
  const { data, isLoading } = useProducts();

  const tutors = useMemo<TutorListing[]>(() => {
    if (!data) return [];
    return data.map((tutor: any, index: number) => ({
      ...tutor,
      date: index === 0 ? "TODAY" : index === 1 ? "YESTERDAY" : `${index + 2} DAYS AGO`
    }));
  }, [data]);

  if (isLoading) {
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
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-[#002f34] tracking-tight">Your Nearest Tutors</h2>
          <p className="text-gray-500 text-sm">Top-rated tutors in your neighborhood</p>
        </div>
        <a href="#" className="text-sm font-bold text-[#1463a5] bg-[#1463a5]/5 px-4 py-2 rounded-full hover:bg-[#1463a5] hover:text-white transition-all">
          View all
        </a>
      </div>

      {/* Horizontal scrolling container */}
      <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x">
        {tutors.map((tutor: TutorListing) => (
          <div key={tutor.id} className="w-[300px] shrink-0 snap-start">
            <ProductCard product={tutor} />
          </div>
        ))}
      </div>
    </div>
  );
}
