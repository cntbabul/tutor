"use client";

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
  Globe
} from "lucide-react";

const categories = [
  { name: "All Levels", icon: Grid },
  { name: "Lower Primary", icon: BookOpen },
  { name: "ME (Middle)", icon: GraduationCap },
  { name: "High School", icon: School },
  { name: "HS (11-12)", icon: Library },
  { name: "Competitive", icon: Briefcase },
  { name: "Languages", icon: Globe },
  { name: "Skills", icon: Gamepad2 },
];

export default function CategoryBar() {
  return (
    <div className="bg-white border-b sticky top-16 z-40">
      <div className="container mx-auto">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  className="flex flex-col lg:flex-row items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                >
                  <div className="p-2 rounded-full lg:bg-transparent group-hover:bg-muted">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-primary">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
