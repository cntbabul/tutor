"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, ChevronDown, Search, Navigation, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const POPULAR_LOCATIONS = [
  "Mumbai, Maharashtra",
  "Delhi, Delhi",
  "Bangalore, Karnataka",
  "Hyderabad, Telangana",
  "Ahmedabad, Gujarat",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
];

export default function LocationSelector({ 
  className, 
  value, 
  onChange 
}: { 
  className?: string;
  value?: string;
  onChange?: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalLocation, setInternalLocation] = useState("India");
  
  const location = value !== undefined ? value : internalLocation;
  const setLocation = (val: string) => {
    if (onChange) onChange(val);
    setInternalLocation(val);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key needed for light use)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.county;
            const state = data.address.state;
            
            if (city && state) {
              setLocation(`${city}, ${state}`);
            } else if (city || state) {
              setLocation(city || state);
            } else {
              setLocation("Current Location");
            }
          } else {
            setLocation("Current Location");
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
          setLocation("Location detected");
        } finally {
          setIsLoadingLocation(false);
          setIsOpen(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setIsLoadingLocation(false);
      }
    );
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

  const filteredLocations = POPULAR_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative ${className || "w-72"}`} ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center h-12 bg-white border-2 rounded px-2 gap-2 cursor-pointer transition-all duration-200 ${
          isOpen ? "border-secondary ring-1 ring-secondary/20" : "border-primary"
        }`}
      >
        <Search size={20} className={`${isOpen ? "text-secondary" : "text-primary"}`} />
        <Input
          readOnly
          value={location}
          placeholder="Search city, area or locality"
          className="border-0 focus-visible:ring-0 px-0 h-full text-primary font-medium flex-grow cursor-pointer"
        />
        <ChevronDown
          size={20}
          className={`text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border rounded-sm shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="p-4 border-b space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search city, area or locality"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-secondary/30"
              />
            </div>
            
            <button 
              onClick={handleGetCurrentLocation}
              disabled={isLoadingLocation}
              className="w-full flex items-center gap-2 text-secondary cursor-pointer hover:bg-secondary/5 p-2 rounded transition-colors group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoadingLocation ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Navigation size={18} />
              )}
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold">
                  {isLoadingLocation ? "Detecting location..." : "Use current location"}
                </span>
                <span className="text-[10px] text-muted-foreground group-hover:text-secondary/70">
                  {isLoadingLocation ? "Please wait" : "Enable location services"}
                </span>
              </div>
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            <div className="p-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                Popular Locations
              </p>
              {filteredLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocation(loc);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-2 py-3 hover:bg-muted transition-colors text-left"
                >
                  <MapPin size={18} className="text-muted-foreground" />
                  <span className="text-sm text-primary">{loc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
