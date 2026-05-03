"use client";

import { Home, MessageCircle, Plus, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Chats", icon: MessageCircle, href: "/chats" },
  { label: "Teach", icon: Plus, href: "/teach", isSpecial: true },
  { label: "My Tutors", icon: Heart, href: "/my-tutors" },
  { label: "Account", icon: User, href: "/account" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex lg:hidden items-center justify-between px-2 py-1 h-14">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (item.isSpecial) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-6 bg-white rounded-full p-1"
            >
              <div className="bg-white border-4 border-t-secondary border-l-accent border-r-secondary border-b-accent rounded-full p-2 shadow-lg">
                <Icon className="w-6 h-6 text-primary" strokeWidth={3} />
              </div>
              <span className="text-[10px] font-bold mt-1 uppercase text-primary">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 gap-1 ${
              isActive ? "text-primary font-bold" : "text-muted-foreground"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
