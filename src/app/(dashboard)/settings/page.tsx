"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("privacy");
  const [showPhone, setShowPhone] = useState(true);
  const [receiveNewsletters, setReceiveNewsletters] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold text-[#002f34] mb-6">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setActiveTab("privacy")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "privacy" ? "bg-[#002f34] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  Privacy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "notifications" ? "bg-[#002f34] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  Notifications
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="flex-grow bg-white rounded-xl shadow-sm border p-6 md:p-8">
            {activeTab === "privacy" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-bold text-[#002f34] mb-4 border-b pb-2">Privacy Settings</h2>
                  
                  <div className="space-y-6 mt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900">Show my phone number on my ads</h3>
                        <p className="text-sm text-gray-500 mt-1">If enabled, your phone number will be visible to everyone viewing your active tutor listings.</p>
                      </div>
                      <Switch checked={showPhone} onCheckedChange={setShowPhone} />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900">Receive marketing newsletters</h3>
                        <p className="text-sm text-gray-500 mt-1">Receive tips, updates, and offers from TutorMarket via email.</p>
                      </div>
                      <Switch checked={receiveNewsletters} onCheckedChange={setReceiveNewsletters} />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h2 className="text-xl font-bold text-[#002f34] mb-4 border-b pb-2">Your Data</h2>
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-900 mb-2">Create a copy of your data</h3>
                    <p className="text-sm text-gray-500 mb-4">Request a downloadable copy of your profile data, listings, and chat history. This process may take up to 48 hours.</p>
                    <Button variant="outline" className="border-2 font-bold hover:bg-gray-50">
                      Request data archive
                    </Button>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-red-100">
                  <h3 className="font-bold text-red-600 mb-2">Delete Account</h3>
                  <p className="text-sm text-gray-500 mb-4">Permanently delete your account, listings, and all associated data. This action cannot be undone.</p>
                  <Button variant="destructive" className="font-bold">
                    Delete my account
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-[#002f34] mb-4 border-b pb-2">Notification Preferences</h2>
                <p className="text-gray-500">Manage how you receive alerts and messages.</p>
                {/* Notification settings can be added here */}
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 mt-4">
                  Push notifications are currently managed by your browser settings.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </main>
  );
}
