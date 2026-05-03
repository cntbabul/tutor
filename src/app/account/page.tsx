"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { 
  X, 
  Camera, 
  FileText, 
  Heart, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  Zap, 
  MessageCircle, 
  Bell, 
  HelpCircle, 
  Globe, 
  Settings,
  ChevronRight,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) return null;

  const menuItems = [
    { icon: Camera, label: "Start Teaching", href: "/teach" },
    { icon: FileText, label: "My Listings", href: "/my-listings" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Package, label: "Buy Business Packages", href: "/packages" },
    { icon: ShoppingCart, label: "View Cart", href: "/cart" },
    { icon: CreditCard, label: "Billing & Subscriptions", href: "/billing" },
    { icon: Users, label: "Become an Elite Student", href: "/elite-student", highlight: true },
    { icon: Zap, label: "Become an Elite Tutor", href: "/elite-tutor", highlight: true, isNew: true },
    { icon: MessageCircle, label: "Chat", href: "/chats" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
  ];

  const secondaryItems = [
    { icon: HelpCircle, label: "Help", href: "/help" },
    { icon: Globe, label: "Select language / भाषा चुनें", href: "/language" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative border-x">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b">
        <button onClick={() => router.back()}>
          <X size={28} className="text-primary" />
        </button>
        <div className="flex-1 flex justify-center">
           <span className="text-2xl font-black text-primary italic tracking-tighter">
             Tutor<span className="text-accent">Market</span>
           </span>
        </div>
        <div className="w-7" /> {/* Spacer */}
      </header>

      {/* Profile Section */}
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center text-sm">
           <span className="text-muted-foreground">My Account</span>
           <Link href="/profile/edit" className="text-primary font-bold underline decoration-2 underline-offset-4">
             View & Edit Profile
           </Link>
        </div>

        <div className="border-2 border-yellow-400/50 rounded-lg p-4 flex items-center gap-4 bg-yellow-50/20">
          <Avatar className="h-16 w-16 border-2 border-white shadow-md">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-muted text-primary text-xl font-bold">
              {user?.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary">
              {user?.fullName || "Welcome Guest"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="py-2">
        {menuItems.map((item, idx) => (
          <Link 
            key={idx} 
            href={item.href} 
            className={`flex items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors ${item.highlight ? 'bg-blue-50/50' : ''}`}
          >
            <item.icon size={24} className="text-primary/80" />
            <span className="flex-1 text-[15px] text-primary/90 font-medium">
              {item.label}
            </span>
            {item.isNew && (
              <span className="bg-[#cc3300] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase italic mr-2">
                New
              </span>
            )}
            <ChevronRight size={18} className="text-muted-foreground/50" />
          </Link>
        ))}
      </div>

      <div className="border-t my-2" />

      {/* Secondary Menu */}
      <div className="py-2">
        {secondaryItems.map((item, idx) => (
          <Link 
            key={idx} 
            href={item.href} 
            className="flex items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors"
          >
            <item.icon size={24} className="text-primary/80" />
            <span className="flex-1 text-[15px] text-primary/90 font-medium">
              {item.label}
            </span>
            <ChevronRight size={18} className="text-muted-foreground/50" />
          </Link>
        ))}
      </div>

      <div className="border-t my-2" />

      {/* Logout */}
      <div className="px-4 py-6">
        <SignOutButton>
          <Button variant="outline" className="w-full h-12 border-2 border-primary text-primary font-bold text-lg flex gap-2">
            <LogOut size={20} />
            Logout
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
