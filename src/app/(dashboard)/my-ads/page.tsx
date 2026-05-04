"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { useApiClient, userApi, listingApi } from "@/lib/api";

export default function MyAdsPage() {
  const queryClient = useQueryClient();
  const api = useApiClient();
  const { user, isLoaded } = useUser();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await userApi.getProfile(api, user.id);
      return response.data;
    },
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const response = await listingApi.deleteListing(api, user?.id || "", listingId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      alert("Ad deleted successfully");
    },
    onError: (error: any) => {
      alert("Error deleting ad: " + (error.response?.data?.error || error.message));
    },
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this ad?")) {
      deleteMutation.mutate(id);
    }
  };

  const listings = profile?.tutor?.listings || [];

  if (!isLoaded || isLoading) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-muted rounded-md" />
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold mb-4">Please sign in to view your ads</h2>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#002f34]">My Ads</h1>
          <Button asChild className="bg-[#002f34] hover:bg-[#002f34]/90">
            <Link href="/teach" className="flex items-center gap-2">
              <Plus size={18} />
              Post New Ad
            </Link>
          </Button>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-lg text-gray-500 mb-4">You haven't posted any ads yet.</p>
            <Button asChild variant="outline">
              <Link href="/teach">Start Teaching Now</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing: any) => (
              <div key={listing.id} className="relative group">
                <ProductCard
                  product={{
                    ...listing,
                    tutor: {
                      name: user.fullName || "Me",
                      qualification: profile?.tutor?.qualification || ""
                    }
                  }}
                />
                <button
                  onClick={(e) => handleDelete(e, listing.id)}
                  className="absolute top-2 right-2 z-30 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete Ad"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
    </main>
  );
}

