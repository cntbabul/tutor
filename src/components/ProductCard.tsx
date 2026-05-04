"use client";

import { Heart, MessageCircle, Phone, Crown, ChevronLeft, ChevronRight, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface TutorListingProps {
  product: {
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
  };
}

export default function ProductCard({ product }: TutorListingProps) {
  // Mock data for missing props to match the design
  const isElite = product.isElite ?? false;
  const isFeatured = product.isFeatured ?? false;
  const date = product.date ?? "3 DAYS AGO";

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <Link href={`/listing/${product.id}`} className="block h-full transition-transform duration-300 hover:-translate-y-1">
      <Card className={`overflow-hidden group cursor-pointer border rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 relative bg-white h-full flex flex-col ${isFeatured ? "border-l-4 border-l-[#ffce32]" : "border-gray-100"
        }`}>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all transform hover:scale-110">
          <Heart size={18} className="text-gray-900" />
        </button>

        <CardContent className="p-0 flex flex-col h-full">
          {/* Image Section */}
          <div className="aspect-[4/3] relative overflow-hidden bg-gray-50 group/carousel">
            <div className="w-full h-full relative">
              <Image
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              
              {/* Carousel Controls */}
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover/carousel:opacity-100 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover/carousel:opacity-100 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Featured Badge */}
            {isFeatured && (
              <div className="absolute top-3 left-3 z-10 bg-[#ffce32] text-black font-bold px-2 py-0.5 text-[10px] uppercase rounded shadow-sm">
                Featured
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-4 flex flex-col flex-grow space-y-3">
            {/* Price and Date */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="text-xl font-extrabold text-[#002f34]">
                  ₹{product.price.toLocaleString()}
                  <span className="text-[13px] font-medium text-gray-500 ml-1">/{product.category === 'Education & Classes' ? 'hr' : 'session'}</span>
                </div>
              </div>
              <div className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                {date}
              </div>
            </div>

            {/* Title & Tutor */}
            <div className="space-y-1">
              <h3 className="text-[15px] font-semibold text-[#002f34] line-clamp-1 leading-snug group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <div className="flex items-center gap-1.5 text-gray-500 text-[13px]">
                <User size={14} className="text-gray-400" />
                <span className="truncate">{product.tutor.name}</span>
                <span className="text-gray-300">•</span>
                <span className="truncate text-gray-400 font-medium">{product.tutor.qualification}</span>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1 text-[12px] text-gray-400 font-medium">
                <MapPin size={14} className="text-gray-300" />
                <span className="truncate max-w-[120px]">{product.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full bg-[#1463a5]/10 text-[#1463a5] hover:bg-[#1463a5] hover:text-white flex items-center justify-center transition-all">
                  <MessageCircle size={16} />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#1463a5]/10 text-[#1463a5] hover:bg-[#1463a5] hover:text-white flex items-center justify-center transition-all">
                  <Phone size={16} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
