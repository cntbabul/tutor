"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProductCard from "@/components/ProductCard";
import { API_URL } from "@/lib/constants";
import { Share2, CalendarDays, Edit3, User as UserIcon, Users, Info, Mail, Phone, ExternalLink } from "lucide-react";

export default function CustomProfilePage() {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "STUDENT",
    bio: "",
    qualification: "",
    experience: "",
    hourlyRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: {
            "x-user-id": user.id,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setDbUser(data);
          setFormData({
            name: data.name || user.fullName || "",
            role: data.role || "STUDENT",
            bio: data.tutor?.bio || "",
            qualification: data.tutor?.qualification || "",
            experience: data.tutor?.experience?.toString() || "",
            hourlyRate: data.tutor?.hourlyRate?.toString() || "",
          });
        } else {
          // New user, populate with Clerk defaults
          setFormData((prev) => ({
            ...prev,
            name: user.fullName || "",
          }));
          setIsEditing(true); // Force edit mode if no profile
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [user, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress,
          image: user.imageUrl,
          ...formData,
        }),
      });
      
      if (res.ok) {
        const updatedData = await res.json();
        setDbUser(updatedData);
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || fetching) {
    return (
      <main className="min-h-screen flex flex-col bg-gray-50">

        <div className="flex-grow flex items-center justify-center">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col bg-gray-50">

        <div className="flex-grow flex items-center justify-center">Please sign in to view your profile.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">

      
      <div className="flex-grow container mx-auto px-4 py-8">
        
        {!isEditing ? (
          // PUBLIC PROFILE VIEW
          <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
            {/* Left Column - User Info */}
            <div className="w-full md:w-[300px] shrink-0">
              <div className="bg-transparent">
                <div className="relative w-[120px] h-[120px] mb-4 mx-auto md:mx-0">
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h1 className="text-[28px] font-bold text-[#002f34] mb-6">{dbUser?.name || user.fullName}</h1>
                
                <div className="space-y-3 mb-8">
                  <p className="text-[13px] font-medium text-[#002f34] flex items-center gap-3">
                    <CalendarDays size={18} strokeWidth={1.5} className="text-[#002f34]" /> Member since {new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                  <p className="text-[13px] font-medium text-[#002f34] flex items-center gap-3">
                    <Users size={18} strokeWidth={1.5} className="text-[#002f34]" /> 
                    <span><strong className="font-bold text-[#002f34]">2</strong> Followers</span> 
                    <span className="text-gray-300">|</span> 
                    <span><strong className="font-bold text-[#002f34]">3</strong> Following</span>
                  </p>
                  <p className="text-[13px] font-medium text-[#002f34] flex items-center gap-3">
                    <Info size={18} strokeWidth={1.5} className="text-[#002f34]" /> Real me
                  </p>
                </div>

                <div className="mb-8">
                  <p className="text-[13px] font-bold text-[#002f34] mb-3">User logged in with</p>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full border border-[#002f34] flex items-center justify-center">
                      <Mail size={12} strokeWidth={2} className="text-[#002f34]" />
                    </div>
                    <div className="w-6 h-6 rounded-full border border-[#002f34] flex items-center justify-center">
                      <Phone size={12} strokeWidth={2} className="text-[#002f34]" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="w-full h-12 font-bold text-base bg-[#002f34] hover:bg-[#002f34]/90 text-white rounded flex items-center justify-center gap-2"
                  >
                    <Edit3 size={18} /> Edit Profile
                  </Button>
                  <div className="text-center pt-2">
                    <button className="font-bold text-[14px] text-[#002f34] underline underline-offset-4 decoration-2 decoration-[#002f34] hover:opacity-80 transition-opacity">
                      Share Profile
                    </button>
                  </div>
                </div>
              </div>

              {dbUser?.role === "TUTOR" && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-bold text-[#002f34] mb-4 text-xl">About Tutor</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><strong>Qualification:</strong> {dbUser?.tutor?.qualification}</p>
                    <p><strong>Experience:</strong> {dbUser?.tutor?.experience} Years</p>
                    <p><strong>Hourly Rate:</strong> ₹{dbUser?.tutor?.hourlyRate}/hr</p>
                    {dbUser?.tutor?.bio && (
                      <div className="pt-2">
                        <p className="text-gray-600 italic">"{dbUser.tutor.bio}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Published Ads */}
            <div className="flex-1 md:pl-12">
              
              {(!dbUser?.tutor?.listings || dbUser.tutor.listings.length === 0) ? (
                <div className="flex flex-col items-center justify-center pt-20">
                  {/* Abstract placeholder graphic mimicking OLX */}
                  <div className="w-48 h-48 relative mb-8 flex justify-center items-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-blue-500 rotate-45 transform"></div>
                      <div className="w-20 h-20 bg-yellow-400 rounded-full absolute -top-4 -left-4"></div>
                      <div className="w-16 h-16 bg-[#ffce32] absolute -bottom-4 right-0"></div>
                      <div className="w-32 h-12 bg-[#002f34] absolute bottom-8 -left-8"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#002f34] mb-3">You haven't listed anything yet</h3>
                  <p className="text-base text-gray-500 mb-8">Let go of what you don't use anymore</p>
                  <Button className="h-12 px-8 font-bold text-base bg-[#002f34] hover:bg-[#002f34]/90 text-white">
                    Start selling
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dbUser.tutor.listings.map((listing: any) => {
                    // Map db listing to ProductCard expected props
                    const formattedListing = {
                      id: listing.id,
                      title: listing.title,
                      price: listing.price,
                      location: "India",
                      category: listing.category?.name || "Education",
                      subCategory: listing.subCategory?.name || "Classes",
                      images: listing.images || [],
                      isFeatured: false,
                      isElite: false,
                      date: "RECENT",
                      tutor: {
                        name: dbUser.name,
                        qualification: dbUser.tutor.qualification,
                      }
                    };
                    return <ProductCard key={listing.id} product={formattedListing} />;
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          // EDIT PROFILE FORM
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full border-4 border-gray-50"
                />
                <div>
                  <p className="font-bold text-gray-900">{user.primaryEmailAddress?.emailAddress}</p>
                  <p className="text-sm text-gray-500">Avatar is synced from your Google/Clerk account</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">I want to be a</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all ${formData.role === "STUDENT" ? "border-[#3a77ff] bg-blue-50 ring-1 ring-[#3a77ff]" : "hover:border-gray-300"}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="STUDENT" 
                        checked={formData.role === "STUDENT"}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="hidden"
                      />
                      <div className="font-bold text-center text-gray-900">Student</div>
                      <div className="text-xs text-center text-gray-500 mt-1">I want to learn</div>
                    </label>
                    
                    <label className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all ${formData.role === "TUTOR" ? "border-[#3a77ff] bg-blue-50 ring-1 ring-[#3a77ff]" : "hover:border-gray-300"}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="TUTOR" 
                        checked={formData.role === "TUTOR"}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="hidden"
                      />
                      <div className="font-bold text-center text-gray-900">Tutor</div>
                      <div className="text-xs text-center text-gray-500 mt-1">I want to teach</div>
                    </label>
                  </div>
                </div>

                {formData.role === "TUTOR" && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-bold text-lg">Tutor Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <Textarea 
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Tell students about yourself and your teaching style..."
                        rows={4}
                        required={formData.role === "TUTOR"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
                      <Input 
                        value={formData.qualification}
                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                        placeholder="e.g. M.Sc Mathematics, B.Tech CS"
                        required={formData.role === "TUTOR"}
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                        <Input 
                          type="number"
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          placeholder="e.g. 5"
                          min="0"
                          required={formData.role === "TUTOR"}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
                        <Input 
                          type="number"
                          value={formData.hourlyRate}
                          onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                          placeholder="e.g. 500"
                          min="0"
                          required={formData.role === "TUTOR"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1 h-12 bg-[#3a77ff] hover:bg-[#3a77ff]/90 text-white font-bold text-lg">
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
    </main>
  );
}
