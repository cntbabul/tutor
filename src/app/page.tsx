import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CategoryBar from "@/components/CategoryBar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />
      
      {/* Categories */}
      <CategoryBar />
      
      {/* Main Content Area */}
      <div className="flex-grow">
        {/* Banner Space (Optional placeholder for OLX banner) */}
        <div className="container mx-auto px-4 py-4 lg:py-8">
          <div className="w-full h-32 md:h-48 lg:h-64 bg-muted rounded overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-bold text-2xl lg:text-4xl bg-gradient-to-r from-muted to-muted/50">
              ADVERTISING BANNER
            </div>
          </div>
        </div>

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
