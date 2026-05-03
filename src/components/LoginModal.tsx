"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";

interface LoginModalProps {
  children: React.ReactNode;
}

export default function LoginModal({ children }: LoginModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-8">
        <DialogHeader className="flex flex-col items-center gap-4">
          <div className="p-4 bg-muted rounded-full">
            <User size={48} className="text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to TutorMarket</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Sign in to book sessions, chat with tutors, and track your progress.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <SignInButton mode="modal">
            <Button 
              variant="outline" 
              className="w-full h-12 flex items-center justify-center gap-3 border-2 hover:bg-muted transition-all font-medium text-lg"
            >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </SignInButton>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-bold">OR</span>
            </div>
          </div>

          <Button variant="ghost" className="w-full text-primary font-bold underline">
            Login with Phone/Email
          </Button>
        </div>

        <div className="text-center text-[10px] text-muted-foreground px-4">
          By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </div>
      </DialogContent>
    </Dialog>
  );
}
