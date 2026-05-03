"use client";

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function TeachPage() {
  return (
    <main className="min-h-screen flex flex-col bg-muted/30 pb-20 lg:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-primary">Create Your Teaching Profile</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="e.g. John Doe" />
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Highest Qualification</label>
                <Input placeholder="e.g. B.Tech in CSE / M.A in English" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Experience (Years)</label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Hourly Rate (₹)</label>
                  <Input type="number" placeholder="500" />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Bio / About You</label>
                <Textarea placeholder="Describe your teaching style, philosophy, and background..." className="h-32" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Listing Details (What you teach)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title for your Service</label>
                <Input placeholder="e.g. Science & Maths for Classes 1-5" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Academic Level</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lower-primary">Lower Primary</SelectItem>
                      <SelectItem value="me">ME (Middle)</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="hs">HS (11-12)</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Target Classes</label>
                  <Input placeholder="e.g. Class 1, 2, 3" />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Subjects Covered</label>
                <Input placeholder="e.g. Science, Mathematics, English" />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button className="flex-1 bg-primary text-white h-12 text-lg font-bold">
              Publish Listing
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
