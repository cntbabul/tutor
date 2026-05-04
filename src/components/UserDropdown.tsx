"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ClipboardList,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Star,
  BadgeCheck,
  HelpCircle,
  Settings,
  Languages,
  Smartphone,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClerk, useUser, useAuth } from "@clerk/nextjs";

// ─── Types ──────────────────────────────────────────────────────────────────

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  badge?: string;
  dividerAfter?: boolean;
  action?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut, openSignIn } = useClerk();
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Capture PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

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

  const menuItems: MenuItem[] = [
    {
      icon: <ClipboardList size={18} />,
      label: "My ADS",
      href: "/my-ads",
      dividerAfter: false,
    },
    {
      icon: <ShoppingBag size={18} />,
      label: "Buy Business Packages",
      href: "/packages",
    },

    {
      icon: <CreditCard size={18} />,
      label: "Bought Packages & Billing",
      href: "/billing",
      dividerAfter: true,
    },
    {
      icon: <Star size={18} />,
      label: "Become an Elite Buyer",
      href: "/elite-buyer",
    },
    {
      icon: <BadgeCheck size={18} />,
      label: "Become an Elite Seller",
      href: "/elite-seller",
      badge: "New",
      dividerAfter: true,
    },
    {
      icon: <HelpCircle size={18} />,
      label: "Help",
      href: "/help",
    },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      href: "/settings",
      dividerAfter: true,
    },
    {
      icon: <Smartphone size={18} />,
      label: "Install Tutor App",
      action: async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            setDeferredPrompt(null);
          }
        } else {
          alert("App installation is not supported or already installed.");
        }
      },
    },
    {
      icon: <LogOut size={18} />,
      label: "Logout",
      action: () => signOut({ redirectUrl: "/" }),
    },
  ];

  const displayName =
    user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "User";

  if (!isSignedIn) {
    return (
      <button
        onClick={() => openSignIn()}
        className="font-bold text-[16px] text-[#002f34] underline hover:no-underline px-2"
      >
        Login
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Trigger ── */}
      <button
        id="user-dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 cursor-pointer hover:bg-muted p-1 pr-2 rounded-lg transition-colors group focus:outline-none"
      >
        <Avatar className="h-9 w-9 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
          <AvatarImage src={user?.imageUrl || ""} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Dropdown Panel ── */}
      {open && (
        <div
          role="menu"
          aria-labelledby="user-dropdown-trigger"
          className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-xl border bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5 z-[100] overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          {/* Profile Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b bg-primary/5">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={user?.imageUrl || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{displayName}</p>
              <Link
                href="/profile"
                className="inline-block mt-1 text-xs font-medium text-white bg-primary hover:bg-primary/90 transition-colors px-3 py-1 rounded-full"
                onClick={() => setOpen(false)}
              >
                View and edit profile
              </Link>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="py-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.action ? (
                  <button
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      item.action?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-gray-500 group-hover:text-primary transition-colors flex-shrink-0">
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    role="menuitem"
                    href={item.href || "#"}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-gray-500 group-hover:text-primary transition-colors flex-shrink-0">
                      {item.icon}
                    </span>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}

                  </Link>
                )}

                {/* Divider */}
                {item.dividerAfter && <hr className="my-1 border-gray-100" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
