"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  image?: string;
  text: string;
  date: string;
  isUnread: boolean;
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const notifications: Notification[] = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=100&q=80",
      text: "Your ad 'Mathematics for Class 10' is now live!",
      date: "Oct 24",
      isUnread: false,
    },
    {
      id: "2",
      text: "You have a new message from a student regarding your Physics listing.",
      date: "Sep 27",
      isUnread: true,
    },
    {
      id: "3",
      text: "Reminder: Update your availability for the upcoming weekend classes.",
      date: "Sep 06",
      isUnread: true,
    },
    {
      id: "4",
      text: "Congratulations! You have been upgraded to an Elite Tutor.",
      date: "Aug 15",
      isUnread: true,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setOpen(!open)}
        className="text-primary hover:bg-muted p-2 rounded-full transition-colors relative group focus:outline-none"
      >
        <Bell size={24} strokeWidth={2.5} />
        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-[-20px] top-[calc(100%+8px)] w-[320px] bg-white border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.1)] rounded z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Arrow */}
          <div className="absolute -top-2 right-[26px] w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45 z-[-1]"></div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.map((notif, index) => (
              <div 
                key={notif.id} 
                className={`flex gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${index !== notifications.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                {/* Image Placeholder */}
                <div className="shrink-0 pt-1">
                  {notif.image ? (
                    <img src={notif.image} alt="Item" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex flex-wrap items-center justify-center p-1.5 opacity-80">
                      {/* Generic abstract dots representing OLX placeholder */}
                      <div className="w-2 h-2 bg-gray-300 rounded-full m-0.5"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full m-0.5"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full m-0.5"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full m-0.5"></div>
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div>
                  <p className={`text-sm text-gray-800 leading-tight ${notif.isUnread ? 'font-bold' : 'font-normal'}`}>
                    {notif.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5 font-medium">
                    {notif.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          <button className="w-full py-3 bg-white text-[#3a77ff] font-bold text-[13px] border-t border-gray-200 hover:bg-gray-50 rounded-b transition-colors tracking-wide">
            + SHOW MORE
          </button>
        </div>
      )}
    </div>
  );
}
