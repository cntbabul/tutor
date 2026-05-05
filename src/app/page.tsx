import BottomNav from "@/components/BottomNav";
import CategoryBar from "@/components/CategoryBar";
import BannerCarousel from "@/components/BannerCarousel";
import NearestTutorsSection from "@/components/NearestTutorsSection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Categories */}
      <CategoryBar />

      {/* Main Content Area */}
      <div className="flex-grow">
        {/* Advertising Carousel Banner */}
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <BannerCarousel />
        </div>
        {/* Nearest Tutors Section */}
        <NearestTutorsSection />

        {/* Product Grid */}
        <ProductGrid />
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </main>
  );
}
