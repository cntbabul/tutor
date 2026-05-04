"use client";

import { MapPin, ChevronDown, Plus, User, Bell, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import LocationSelector from "./LocationSelector";
import { Show, UserButton, useAuth, useUser, SignInButton } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-muted/30 backdrop-blur-sm lg:bg-muted">
      {/* Top Main Header */}
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => window.location.href = "/"}>
          <svg
            width="48px"
            height="48px"
            viewBox="0 0 1024 1024"
            className="text-primary fill-current"
          >
            <path d="M661.333 256c70.656 0 128 57.344 128 128s-57.344 128-128 128-128-57.344-128-128 57.344-128 128-128zM362.667 256c70.656 0 128 57.344 128 128s-57.344 128-128 128-128-57.344-128-128 57.344-128 128-128zM362.667 597.333c70.656 0 128 57.344 128 128s-57.344 128-128 128-128-57.344-128-128 57.344-128 128-128zM661.333 597.333c70.656 0 128 57.344 128 128s-57.344 128-128 128-128-57.344-128-128 57.344-128 128-128z"></path>
          </svg>
        </div>

        {/* Location Selector Component */}
        <div className="hidden lg:block">
          <LocationSelector />
        </div>

        {/* Search Bar Component */}
        <SearchBar />

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-5">


          <button className="flex flex-col items-center gap-0.5 text-primary hover:text-secondary transition-colors group">
            <div className="p-1 group-hover:bg-muted rounded-full transition-colors relative">
              <MessageCircle size={24} strokeWidth={2.5} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Chat</span>
          </button>



          <Button 
            onClick={() => window.location.href = "/teach"}
            className="h-11 px-6 rounded-full border-[5px] border-t-[#3a77ff] border-l-[#ffce32] border-r-[#3a77ff] border-b-[#ffce32] bg-white text-primary font-bold hover:bg-white shadow-sm flex gap-2 group transition-transform active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="tracking-wide uppercase">Teach</span>
          </Button>

          <NotificationDropdown />
          {/* User Avatar Dropdown */}
          <UserDropdown />
        </div>

        {/* Mobile Icons */}
        <div className="lg:hidden flex items-center gap-4">
          <div className="lg:hidden scale-[0.85] mr-[-8px]">
            <NotificationDropdown />
          </div>

          <Show when={isSignedIn}>
            <UserButton />
          </Show>

          <Show when={!isSignedIn}>
            <SignInButton mode="modal">
              <Avatar className="h-9 w-9 border-2 border-primary/10 cursor-pointer hover:border-primary/30 transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/5 text-primary">
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            </SignInButton>
          </Show>
        </div>
      </div>
    </header>
  );
}
