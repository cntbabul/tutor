import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Search, BookOpen, ShieldCheck, CreditCard, MessageCircle, FileText } from "lucide-react";

export default function HelpPage() {
  const categories = [
    { icon: <BookOpen className="w-8 h-8 text-[#3a77ff]" />, title: "Posting & Managing Ads", desc: "Learn how to list your tutoring services" },
    { icon: <ShieldCheck className="w-8 h-8 text-[#3a77ff]" />, title: "Trust & Safety", desc: "Keep your account and interactions secure" },
    { icon: <CreditCard className="w-8 h-8 text-[#3a77ff]" />, title: "Payments & Billing", desc: "Manage packages, featured ads, and invoices" },
    { icon: <MessageCircle className="w-8 h-8 text-[#3a77ff]" />, title: "Chat & Communication", desc: "How to connect with students or tutors" },
    { icon: <FileText className="w-8 h-8 text-[#3a77ff]" />, title: "Account Settings", desc: "Update your profile, password, and privacy" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Help Center Hero */}
      <div className="bg-[#002f34] py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Hi, how can we help you?</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
            <Input 
              type="text" 
              placeholder="Search for articles, topics, or FAQs..." 
              className="w-full pl-14 pr-4 py-6 text-lg rounded-xl shadow-lg border-0 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-white"
            />
          </div>
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        
        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#002f34] mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center group">
                <div className="mb-4 p-4 bg-blue-50 rounded-full group-hover:bg-[#3a77ff]/10 transition-colors">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-sm text-gray-500">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular FAQs */}
        <div className="mb-16 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-[#002f34] mb-6">Popular FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base font-medium">How do I post a tutoring advertisement?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                To post an ad, click the &quot;Teach&quot; button at the top right of the screen. You'll be asked to provide details such as your subject category, hourly rate, and teaching experience. Once submitted, your ad will be live immediately.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base font-medium">How can I become an Elite Tutor?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                You can become an Elite Tutor by upgrading your account via the &quot;Become an Elite Seller&quot; option in your profile dropdown. Elite Tutors get priority ranking, a special badge, and increased visibility.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base font-medium">Is it safe to share my phone number?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                We prioritize your safety. By default, your phone number is hidden, and interested students must message you through our secure in-app chat. You can toggle phone number visibility in your Privacy Settings.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-base font-medium">How do I edit or delete my existing ad?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Go to &quot;My ADS&quot; from the user dropdown menu. Here you'll see a list of all your active and inactive listings. Click the three dots next to any ad to edit its details, pause it, or delete it permanently.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Support */}
        <div className="bg-[#f0f4f8] p-8 rounded-xl text-center border border-blue-100">
          <h2 className="text-2xl font-bold text-[#002f34] mb-3">Still need help?</h2>
          <p className="text-gray-600 mb-6">Our support team is available 24/7 to assist you with any issues.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-[#002f34] hover:bg-[#002f34]/90 text-white font-bold h-12 px-8 text-base">
              Contact Support
            </Button>
            <Button variant="outline" className="border-2 border-[#002f34] text-[#002f34] font-bold h-12 px-8 text-base hover:bg-[#002f34]/5">
              Live Chat
            </Button>
          </div>
        </div>

      </div>

      <Footer />
      <BottomNav />
    </main>
  );
}
