"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Car, 
  Building2, 
  Smartphone, 
  Briefcase, 
  Monitor, 
  Bike, 
  Gamepad2, 
  Armchair, 
  BookOpen, 
  Dog,
  Grid,
  GraduationCap,
  School,
  Library,
  Globe,
  ChevronDown,
  Menu
} from "lucide-react";

const categories = [
  { name: "All Levels", icon: Grid, value: "" },
  { name: "Lower Primary", icon: BookOpen, value: "lower-primary" },
  { name: "ME (Middle)", icon: GraduationCap, value: "middle" },
  { name: "High School", icon: School, value: "high-school" },
  { name: "HS (11-12)", icon: Library, value: "higher-secondary" },
  { name: "Competitive", icon: Briefcase, value: "competitive" },
  { name: "Languages", icon: Globe, value: "languages" },
  { name: "Skills", icon: Gamepad2, value: "skills" },
];

function CategoryBarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategoryValue = searchParams.get("category") || "";
  const currentCategory = categories.find(c => c.value === currentCategoryValue) || categories[0];

  const handleSelectCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`/?${params.toString()}`);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border-b sticky top-16 z-40 shadow-sm hidden lg:block">
      <div className="container mx-auto flex items-center px-4 gap-4">
        {/* All Categories Dropdown Container */}
        <div className="relative shrink-0" ref={dropdownRef}>
          {/* Categories Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 py-2 px-4 font-bold text-white bg-[#3a77ff] rounded hover:bg-[#3a77ff]/90 transition-colors my-2 h-10 shadow-sm"
          >
            <Menu size={20} strokeWidth={2.5} />
            <span className="uppercase tracking-tight text-[13px]">
              {currentCategoryValue === "" ? "All Categories" : currentCategory.name}
            </span>
            <ChevronDown size={18} strokeWidth={2.5} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-sm shadow-xl z-50 py-2 animate-in fade-in-0 zoom-in-95 duration-100">
              {categories.map((cat) => {
                const isSelected = cat.value === currentCategoryValue;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleSelectCategory(cat.value)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left group ${
                      isSelected ? "bg-blue-50" : "hover:bg-blue-50"
                    }`}
                  >
                    <cat.icon size={18} className={`${isSelected ? "text-[#3a77ff]" : "text-gray-500"} group-hover:text-[#3a77ff]`} />
                    <span className={`text-sm font-medium ${isSelected ? "text-[#3a77ff]" : "text-gray-700"} group-hover:text-[#3a77ff]`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-grow overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max items-center py-2">
              {categories.map((cat) => {
                const isSelected = cat.value === currentCategoryValue;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleSelectCategory(cat.value)}
                    className="flex items-center gap-2 px-4 py-2 transition-colors group relative"
                  >
                    <span className={`text-sm font-medium transition-colors ${
                      isSelected ? "text-[#3a77ff]" : "text-primary group-hover:text-[#3a77ff]"
                    }`}>
                      {cat.name}
                    </span>
                    {isSelected && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3a77ff] rounded-t-md" />
                    )}
                  </button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default function CategoryBar() {
  return (
    <Suspense fallback={<div className="h-16 bg-white border-b hidden lg:block"></div>}>
      <CategoryBarContent />
    </Suspense>
  );
}
