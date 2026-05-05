"use client";

import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useSearchParams } from "next/navigation";

export default function ProductGrid() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || undefined;
  const categorySlug = searchParams.get("category") || undefined;
  
  const { data: products, isLoading, error } = useProducts({ q, categorySlug });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-destructive">
        Error loading products. Please ensure the backend is running.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#002f34] tracking-tight">
            Available Tutors Near You
          </h2>
          <p className="text-gray-500 mt-1">Verified educators ready to help you grow</p>
        </div>
      </div>

      {(!products || !Array.isArray(products) || products.length === 0) ? (
        <div className="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-xl text-muted-foreground">No tutors found matching your search.</p>
          <Button variant="link" onClick={() => window.location.href = "/"} className="mt-4 text-primary font-bold">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-12 mb-8">
        <button className="px-6 py-3 border-2 border-primary rounded font-bold text-primary hover:border-4 transition-all">
          Load more
        </button>
      </div>
    </div>
  );
}
