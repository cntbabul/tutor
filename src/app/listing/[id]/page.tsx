"use client";

import { useParams } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useListing } from "@/hooks/useListing";
import { 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  User, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  MessageCircle, 
  Phone,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export default function ListingPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: listing, isLoading, error } = useListing(id);

  if (isLoading) return <div className="p-8 text-center">Loading Listing...</div>;
  if (error || !listing) return <div className="p-8 text-center text-destructive">Listing not found.</div>;

  return (
    <main className="min-h-screen bg-[#f2f4f5] pb-20 lg:pb-12">
      <Header />
      
      {/* Mobile Back Button */}
      <div className="lg:hidden bg-white px-4 py-2 flex items-center gap-4 border-b">
        <Link href="/">
          <ArrowLeft size={24} className="text-primary" />
        </Link>
        <span className="font-bold truncate">{listing.title}</span>
      </div>

      <div className="container mx-auto px-0 lg:px-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Image Gallery */}
            <div className="bg-black lg:rounded-lg overflow-hidden relative aspect-video md:aspect-[21/9]">
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-contain"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
                  <Share2 size={20} />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
                  <Heart size={20} />
                </Button>
              </div>
            </div>

            {/* Title & Key Specs */}
            <Card className="rounded-none lg:rounded-lg border-none lg:border">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <Badge variant="secondary" className="bg-accent text-primary font-bold">
                       {listing.category}
                     </Badge>
                     <span className="text-xs text-muted-foreground">• Posted 2 days ago</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-primary">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin size={16} />
                    <span>{listing.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-y py-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <BookOpen size={24} className="text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold">Target Classes</span>
                        <span className="text-sm font-bold">{listing.subCategory}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <CheckCircle2 size={24} className="text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold">Experience</span>
                        <span className="text-sm font-bold">{listing.tutor.experience} Years</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <User size={24} className="text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold">Qualification</span>
                        <span className="text-sm font-bold">{listing.tutor.qualification}</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-primary uppercase text-sm tracking-wider">About this Tuition</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-4 px-4 lg:px-0">
            
            {/* Price Card */}
            <Card className="border-none lg:border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">₹ {listing.price}</span>
                  <span className="text-muted-foreground">/ per hour</span>
                </div>
                <Button className="w-full h-12 bg-primary text-white font-bold text-lg hover:bg-primary/90">
                  Contact Tutor
                </Button>
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
                  <span>Service ID: {listing.id}</span>
                  <button className="underline font-bold uppercase">Report</button>
                </div>
              </CardContent>
            </Card>

            {/* Tutor Card */}
            <Card className="border-none lg:border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-primary">Tutor Profile</h3>
                  <Badge variant="outline" className="text-green-600 border-green-600">Verified</Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={listing.tutor.image} />
                    <AvatarFallback>{listing.tutor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-primary">{listing.tutor.name}</span>
                    <span className="text-xs text-muted-foreground">Member since Jan 2024</span>
                    <div className="flex items-center text-accent-foreground font-bold text-sm mt-1">
                      <Star size={14} className="fill-current mr-1" />
                      {listing.tutor.rating} (12 reviews)
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-primary text-primary font-bold h-12 border-2">
                  Chat with Tutor
                </Button>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="bg-[#e9f2f3] border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-primary uppercase text-xs">Safety Tips</h3>
                <ul className="text-xs space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Meet the tutor in a public place or with a guardian present.</li>
                  <li>Verify academic certificates and IDs before paying.</li>
                  <li>Avoid paying in advance for multiple sessions.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 bg-white border-t p-3 flex gap-3 z-50">
        <Button variant="outline" className="flex-1 border-primary text-primary font-bold h-12">
          <MessageCircle className="mr-2" /> Chat
        </Button>
        <Button className="flex-1 bg-primary text-white font-bold h-12">
          <Phone className="mr-2" /> Call Now
        </Button>
      </div>

      <BottomNav />
    </main>
  );
}
