"use client";

import { Heart, MessageCircle, Phone, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

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
  const isElite = product.isElite ?? true;
  const isFeatured = product.isFeatured ?? true;
  const date = product.date ?? "3 DAYS AGO";

  return (
    <Link href={`/listing/${product.id}`} className="block h-full w-[280px] shrink-0">
      <Card className={`overflow-hidden group cursor-pointer border rounded shadow-sm hover:shadow-md transition-shadow relative bg-white h-full flex flex-col ${
        isFeatured ? "border-l-[5px] border-l-[#ffce32]" : "border-gray-200"
      }`}>
        
        {/* Elite Ribbon */}
        {isElite && (
          <div className="absolute top-0 right-0 z-20">
            <div className="bg-[#1463a5] text-white text-[9px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-sm rounded-bl-md">
              <Crown size={10} className="fill-current" />
              ELITE
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
          <Heart size={18} className="text-gray-900" />
        </button>

        <CardContent className="p-0 flex flex-col h-full">
          {/* Image Section */}
          <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 p-2">
            <div className="w-full h-full relative rounded overflow-hidden">
              <Image
                src={product.images[0] || "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80"}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Featured Badge inside image */}
            {isFeatured && (
              <div className="absolute bottom-4 left-4 z-10 bg-[#ffce32] text-black font-bold px-2 py-0.5 text-[10px] uppercase rounded-sm shadow-sm">
                Featured
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-3 flex flex-col flex-grow">
            {/* Price and Date */}
            <div className="flex justify-between items-start mb-1">
               <div className="font-bold text-[18px] text-gray-900 leading-none">
                 ₹ {product.price.toLocaleString()}
                 <span className="text-xs font-normal text-gray-500 ml-1">/hr</span>
               </div>
               <div className="text-[9px] text-gray-400 uppercase tracking-tight">
                 {date}
               </div>
            </div>
            
            {/* Title */}
            <h3 className="text-sm text-gray-600 line-clamp-1 mt-1 font-normal">
              {product.title} • {product.tutor.name}
            </h3>
            
            {/* Spacer to push actions to bottom */}
            <div className="flex-grow"></div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-end mt-3 pt-2">
              <div className="text-[11px] text-gray-400 truncate max-w-[120px]">
                {product.location}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 rounded-full bg-[#1463a5] hover:bg-[#0f4b7a] flex items-center justify-center text-white transition-colors">
                  <MessageCircle size={14} className="fill-current" />
                </button>
                <button className="w-7 h-7 rounded-full bg-[#1463a5] hover:bg-[#0f4b7a] flex items-center justify-center text-white transition-colors">
                  <Phone size={14} className="fill-current" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
