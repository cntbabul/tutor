"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ChevronRight, User as UserIcon, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { CATEGORIES, CATEGORY_LABELS, API_URL, PRICING_TYPES } from "@/lib/constants";
import { useApiClient, listingApi } from "@/lib/api";
import LocationSelector from "@/components/LocationSelector";
import { useRouter, useSearchParams } from "next/navigation";
import ImageKit from "imagekit-javascript";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORY_ICONS: Record<string, any> = {
  tutoring: Camera,
  programming: Camera,
  languages: Camera,
  music: Camera,
  sports: Camera,
};

export default function TeachPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const api = useApiClient();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditing = !!editId;

  const imagekit = useMemo(() => new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
  }), []);
  const [category, setCategory] = useState("tutoring");
  const [priceType, setPriceType] = useState("monthly");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{
    id: string;
    file: File;
    preview: string;
    url?: string;
    isUploading: boolean;
    error?: boolean;
  }[]>([]);

  useEffect(() => {
    console.log("ImageKit Config Check:", {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ? "Present" : "Missing",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ? "Present" : "Missing",
    });
  }, []);

  const [location, setLocation] = useState("India");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pricingDetails, setPricingDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    if (user?.fullName && !userName && !isEditing) {
      setUserName(user.fullName);
    }
  }, [user, userName, isEditing]);

  useEffect(() => {
    if (isEditing && editId && !hasInitialized) {
      const fetchListing = async () => {
        try {
          const res = await listingApi.getListing(api, editId);
          const l = res.data;
          setTitle(l.title);
          setDescription(l.description);
          setPrice(l.price.toString());
          setCategory(l.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')); // Handle category mapping
          setLocation(l.location);
          setPhone(l.phone || ""); // Ensure phone is handled
          setPricingDetails(l.pricingDetails || "");
          setPriceType(l.priceType || "monthly");
          
          if (l.images && l.images.length > 0) {
            setPhotos(l.images.map((url: string) => ({
              id: Math.random().toString(36).substring(7),
              preview: url,
              url: url,
              isUploading: false
            })));
          }
          setHasInitialized(true);
        } catch (err) {
          console.error("Failed to fetch listing for edit:", err);
          alert("Failed to load listing data");
        }
      };
      fetchListing();
    }
  }, [editId, isEditing, api, hasInitialized]);

  const listingMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        const response = await listingApi.updateListing(api, user?.id || "", editId, data);
        return response.data;
      } else {
        const response = await listingApi.createListing(api, user?.id || "", data);
        return response.data;
      }
    },
    onSuccess: () => {
      alert(isEditing ? "Ad updated successfully!" : "Ad posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", editId] });
      router.push("/my-ads");
    },
    onError: (error: any) => {
      alert(error.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newPhotos = selectedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7) + Date.now(),
        file,
        preview: URL.createObjectURL(file),
        isUploading: true,
      }));

      setPhotos((prev) => [...prev, ...newPhotos]);

      // Start uploading each photo
      newPhotos.forEach(async (photoObj) => {
        try {
          // Fetch auth parameters manually for each upload
          const authResponse = await api.get("/api/imagekit/auth");
          const authData = authResponse.data;

          const result = await imagekit.upload({
            file: photoObj.file,
            fileName: photoObj.file.name,
            tags: ["teach-ad"],
            ...authData, // token, signature, expire
          });

          console.log("ImageKit Upload Success:", result);

          setPhotos((prev) => {
            return prev.map(p => p.id === photoObj.id ? { ...p, url: result.url, isUploading: false } : p);
          });
        } catch (err) {
          console.error("Upload failed for file:", photoObj.file.name, err);
          setPhotos((prev) => {
            return prev.map(p => p.id === photoObj.id ? { ...p, isUploading: false, error: true } : p);
          });
        }
      });
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find(p => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter(p => p.id !== id);
    });
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!title) missingFields.push("Title");
    if (!price) missingFields.push("Price");
    if (!category) missingFields.push("Category");
    if (!location) missingFields.push("Location");

    if (missingFields.length > 0) {
      alert(`Please fill in the following mandatory fields: ${missingFields.join(", ")}`);
      return;
    }

    if (photos.length === 0) {
      alert("Please upload at least one photo");
      return;
    }

    if (photos.some(p => p.isUploading)) {
      alert("Please wait for all photos to finish uploading");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Get uploaded image URLs
      const uploadedImageUrls = photos.map(p => p.url).filter(Boolean) as string[];
      console.log("Submitting listing with images:", uploadedImageUrls);

      if (uploadedImageUrls.length === 0 && photos.length > 0) {
        console.error("No image URLs found. Photos state:", photos);
        alert("Photo upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // 2. Submit the listing
      listingMutation.mutate({
        title,
        description,
        price: Number(price),
        priceType,
        pricingDetails,
        category,
        location,
        phone,
        images: uploadedImageUrls,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">


      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#002f34] text-center mb-6 uppercase tracking-wide">Post Your Ad</h1>

        <div className="max-w-[800px] mx-auto bg-white rounded shadow-sm border border-gray-200">

          {/* Selected Category */}
          <Select value={category} onValueChange={(val) => setCategory(val || "tutoring")}>
            <SelectTrigger className="w-full h-auto p-6 border-b border-gray-200 flex justify-between items-center bg-white rounded-t rounded-b-none border-t-0 border-l-0 border-r-0 hover:bg-gray-50 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden shadow-none transition-colors group">
              <div className="flex flex-col items-start text-left">
                <h2 className="text-[15px] font-bold text-[#002f34] mb-1">SELECTED CATEGORY</h2>
                <p className="text-[13px] text-gray-500 group-hover:text-gray-700 transition-colors">
                  {CATEGORY_LABELS[category]}
                </p>
              </div>

            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-[#002f34] font-bold">Education & Classes</SelectLabel>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#002f34] mb-6">INCLUDE SOME DETAILS</h2>

            <div className="space-y-6 max-w-lg">
              <div>
                <label className="block text-[13px] text-[#002f34] mb-1">Ad title *</label>
                <Input
                  className="h-12 border-gray-300 focus-visible:ring-1 focus-visible:ring-[#002f34]"
                  maxLength={70}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">Mention the key features of your item (e.g. brand, model, age, type)</span>
                  <span className="text-xs text-gray-400">{title.length} / 70</span>
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-[#002f34] mb-1">Description *</label>
                <Textarea
                  className="min-h-[120px] border-gray-300 focus-visible:ring-1 focus-visible:ring-[#002f34] resize-none"
                  maxLength={4096}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">Include condition, features and reason for selling</span>
                  <span className="text-xs text-gray-400">{description.length} / 4096</span>
                </div>
              </div>
            </div>
          </div>
          {/* set a price */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#002f34] mb-6">SET A PRICE</h2>
            <div className="max-w-lg space-y-6">

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-[13px] text-[#002f34] mb-1">Price *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium border-r pr-2 border-gray-300">₹</span>
                    <Input
                      type="number"
                      className="h-12 pl-12 border-gray-300 focus-visible:ring-1 focus-visible:ring-[#002f34]"
                      placeholder="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-[13px] text-[#002f34] mb-1">Pricing Type *</label>
                  <Select value={priceType} onValueChange={(val) => setPriceType(val || "monthly")}>
                    <SelectTrigger className="w-full h-12 border-gray-300 focus-visible:ring-1 focus-visible:ring-[#002f34]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICING_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-[#002f34] mb-1">Additional details (Optional)</label>
                <Input
                  className="h-12 border-gray-300 focus-visible:ring-1 focus-visible:ring-[#002f34]"
                  placeholder="e.g., Price is negotiable, first demo class is free"
                  maxLength={100}
                  value={pricingDetails}
                  onChange={(e) => setPricingDetails(e.target.value)}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">Add any comments regarding your pricing</span>
                </div>
              </div>

            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#002f34] mb-6">Upload Photos
              <span className="text-sm font-normal text-[#002f34] mt-1"> (Add photos of your textbooks, notes, or any learning materials)</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
              {Array.from({ length: 12 }).map((_, i) => {
                const photo = photos[i];
                if (photo) {
                  return (
                    <div key={photo.id} className={`relative w-24 h-24 border-2 rounded overflow-hidden group transition-colors ${photo.error ? "border-red-500" : "border-gray-300"}`}>
                      <img
                        src={photo.preview}
                        alt={`Upload ${i + 1}`}
                        className={`w-full h-full object-cover ${photo.isUploading ? "opacity-50" : "opacity-100"}`}
                      />

                      {photo.isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="w-6 h-6 border-2 border-[#002f34] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                }
                return (
                  <button
                    key={i}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-24 h-24 border-2 flex flex-col items-center justify-center transition-colors rounded ${i === photos.length ? "border-[#002f34] bg-[#002f34]/5" : "border-gray-300 bg-gray-50"} hover:bg-gray-100`}
                  >
                    <Camera size={28} className={i === photos.length ? "text-[#002f34]" : "text-gray-400"} />
                    {i === photos.length && <span className="text-xs font-bold text-[#002f34] mt-1">Add photo</span>}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-red-500 mt-2">This field is mandatory</p>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#002f34] mb-6">CONFIRM YOUR LOCATION</h2>
            <div className="max-w-lg">
              <LocationSelector
                className="w-full"
                value={location}
                onChange={setLocation}
              />
              <p className="text-xs text-gray-400 mt-2">Choose the location where you want your ad to be visible</p>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#002f34] mb-6">REVIEW YOUR DETAILS</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-full h-full text-gray-400 p-2" />
                )}
              </div>
              <div className="flex-1 max-w-sm">
                <label className="block text-[13px] text-gray-500 mb-1">Name</label>
                <Input
                  className="h-12 border-gray-300 focus-visible:ring-1 focus-visible:ring-[#002f34]"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>

            <div className="max-w-sm mt-6">
              <h3 className="text-sm font-bold text-[#002f34] mb-3">Let's verify your account</h3>
              <label className="block text-[13px] text-gray-500 mb-1">Mobile number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                <Input
                  className="h-12 pl-12 border-gray-300 focus-visible:ring-1 focus-visible:ring-[#002f34]"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 flex items-center">
            <Button
              disabled={isSubmitting || listingMutation.isPending}
              onClick={handleSubmit}
              className="h-12 px-8 font-bold text-base bg-[#002f34] hover:bg-[#002f34]/90 text-white border-[3px] border-[#002f34]"
            >
              {isSubmitting || listingMutation.isPending ? "Processing..." : isEditing ? "Update now" : "Post now"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </main>
  );
}
