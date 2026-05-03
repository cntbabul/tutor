"use client";

import { Heart, Star, User, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
    tutor: {
      name: string;
      qualification: string;
      experience: number;
      rating: number;
      image: string;
    };
  };
}

export default function ProductCard({ product }: TutorListingProps) {
  return (
    <Link href={`/listing/${product.id}`} className="block">
      <Card className="overflow-hidden group cursor-pointer border-muted shadow-sm hover:shadow-md transition-shadow relative bg-white h-full">
      {/* Featured Badge */}
      {product.isFeatured && (
        <Badge className="absolute top-2 left-2 z-10 bg-accent text-primary font-bold border-none rounded-none px-2 uppercase text-[10px]">
          Top Rated
        </Badge>
      )}

      {/* Wishlist Button */}
      <button className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm">
        <Heart size={20} className="text-primary" />
      </button>

      <CardContent className="p-0">
        {/* Tutor Hero Image (or Subject Image) */}
        <div className="aspect-[16/10] relative overflow-hidden bg-muted">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
            <div className="flex items-center gap-2">
               <Avatar className="h-8 w-8 border-2 border-white">
                 <AvatarImage src={product.tutor.image} />
                 <AvatarFallback><User size={16} /></AvatarFallback>
               </Avatar>
               <span className="text-sm font-bold truncate">{product.tutor.name}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
             <Badge variant="secondary" className="text-[10px] uppercase font-bold">
               {product.category}
             </Badge>
             <div className="flex items-center text-accent-foreground font-bold text-sm bg-accent px-2 py-0.5 rounded">
                <Star size={14} className="fill-current mr-1" />
                {product.tutor.rating}
             </div>
          </div>
          
          <h3 className="font-bold text-lg text-primary line-clamp-2 leading-tight h-12">
            {product.title}
          </h3>
          
          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
             {product.tutor.qualification} • {product.tutor.experience} yrs exp.
          </p>

          <div className="flex items-center gap-1 mt-3 text-primary font-bold text-xl">
             ₹{product.price} <span className="text-xs font-normal text-muted-foreground">/hr</span>
          </div>
          
          <div className="flex items-center gap-1 mt-4 text-[10px] text-muted-foreground uppercase border-t pt-3">
            <BookOpen size={12} />
            <span className="truncate">{product.subCategory}</span>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
