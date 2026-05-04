"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="flex-grow flex items-center h-12 bg-white border-2 border-primary rounded relative focus-within:border-secondary transition-colors"
    >
      <Input 
        placeholder="Search for subjects, tutors, or classes..." 
        className="border-0 focus-visible:ring-0 h-full rounded-none pr-14 pl-4 text-primary font-medium" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button 
        type="submit"
        className="absolute right-[-2px] top-[-2px] bottom-[-2px] w-12 bg-secondary text-white hover:bg-secondary/90 flex items-center justify-center transition-colors rounded-r-[3px] border-y-2 border-r-2 border-secondary"
      >
        <Search size={22} strokeWidth={2.5} />
      </Button>
    </form>
  );
}
