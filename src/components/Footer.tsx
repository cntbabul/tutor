"use client";

import { Globe, Share2, PlayCircle, Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted mt-auto mb-14 lg:mb-0">
      {/* Upper Footer - Links */}
      <div className="border-t border-b py-8 lg:py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-primary uppercase text-sm">Popular Categories</h4>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li><a href="#" className="hover:text-primary">Cars</a></li>
              <li><a href="#" className="hover:text-primary">Flats for rent</a></li>
              <li><a href="#" className="hover:text-primary">Mobile Phones</a></li>
              <li><a href="#" className="hover:text-primary">Jobs</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-primary uppercase text-sm">Trending Searches</h4>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li><a href="#" className="hover:text-primary">Bikes</a></li>
              <li><a href="#" className="hover:text-primary">Watches</a></li>
              <li><a href="#" className="hover:text-primary">Books</a></li>
              <li><a href="#" className="hover:text-primary">Dogs</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-primary uppercase text-sm">About Us</h4>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li><a href="#" className="hover:text-primary">About OLX Group</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary">OLXPeople</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-primary uppercase text-sm">OLX</h4>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li><a href="#" className="hover:text-primary">Help</a></li>
              <li><a href="#" className="hover:text-primary">Sitemap</a></li>
              <li><a href="#" className="hover:text-primary">Legal & Privacy information</a></li>
              <li><a href="#" className="hover:text-primary">Blog</a></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <h4 className="font-bold text-primary uppercase text-sm">Follow Us</h4>
              <div className="flex gap-4 text-muted-foreground">
                <Globe size={20} className="hover:text-primary cursor-pointer" />
                <Camera size={20} className="hover:text-primary cursor-pointer" />
                <Share2 size={20} className="hover:text-primary cursor-pointer" />
                <PlayCircle size={20} className="hover:text-primary cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer - Copyright */}
      <div className="bg-primary py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-white text-xs">
          <div className="font-bold uppercase tracking-wider">
            Free Classifieds in India
          </div>
          <div>
            © 2006-2024 OLX
          </div>
        </div>
      </div>
    </footer>
  );
}
