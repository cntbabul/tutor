"use client";

import { Search, MapPin, ChevronDown, Plus, User, Heart, Bell, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LoginModal from "./LoginModal";
import { Show, UserButton, useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const { isSignedIn } = useAuth();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-muted/30 backdrop-blur-sm lg:bg-muted">
      {/* Top Main Header */}
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <svg
            width="48px"
            height="48px"
            viewBox="0 0 1024 1024"
            className="text-primary fill-current"
          >
            <path d="M661.333 256c70.656 0 128 57.344 128 128s-57.344 128-128 128-128-57.344-128-128 57.344-128 128-128zM362.667 256c70.656 0 128 57.344 128 128s-57.344 128-128 128-128-57.344-128-128 57.344-128 128-128zM362.667 597.333c70.656 0 128 57.344 128 128s-57.344 128-128 128-128-57.344-128-128 57.344-128 128-128zM661.333 597.333c70.656 0 128 57.344 128 128s-57.344 128-128 128-128-57.344-128-128 57.344-128 128-128z"></path>
          </svg>
        </div>

        {/* Location Selector (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center w-72 h-12 bg-white border-2 border-primary rounded px-2 gap-2">
          <Search size={20} className="text-primary" />
          <Input 
            placeholder="India" 
            className="border-0 focus-visible:ring-0 px-0 h-full placeholder:text-primary font-medium" 
          />
          <ChevronDown size={20} className="text-primary" />
        </div>

        <form onSubmit={handleSearch} className="flex-grow flex items-center h-12 bg-white border-2 border-primary rounded overflow-hidden">
          <Input 
            placeholder="Search for subjects, tutors, or classes..." 
            className="border-0 focus-visible:ring-0 h-full rounded-none" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button 
            type="submit"
            variant="ghost" 
            className="bg-primary text-white h-full rounded-none px-4 hover:bg-primary/90"
          >
            <Search size={24} />
          </Button>
        </form>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <button className="text-primary hover:bg-muted p-2 rounded-full transition-colors relative">
             <MessageCircle size={24} />
             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
          </button>

          <Show when={isSignedIn}>
            <UserButton />
          </Show>

          <Show when={!isSignedIn}>
            <LoginModal>
              <Button variant="ghost" className="font-bold hover:bg-transparent px-0 flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <span>Login</span>
                <ChevronDown size={16} className="text-muted-foreground" />
              </Button>
            </LoginModal>
          </Show>
          
          <Button className="h-12 px-6 rounded-full border-4 border-t-secondary border-l-accent border-r-secondary border-b-accent bg-white text-primary font-bold hover:bg-white shadow-md flex gap-2">
            <Plus size={20} />
            TEACH
          </Button>
        </div>

        {/* Mobile Icons */}
        <div className="lg:hidden flex items-center gap-4">
          <button className="relative p-1 text-primary hover:bg-muted rounded-full transition-colors">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <Show when={isSignedIn}>
            <UserButton />
          </Show>

          <Show when={!isSignedIn}>
            <LoginModal>
              <Avatar className="h-9 w-9 border-2 border-primary/10 cursor-pointer hover:border-primary/30 transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/5 text-primary">
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            </LoginModal>
          </Show>
        </div>
      </div>
    </header>
  );
}
