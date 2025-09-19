import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

export default function NewBusinessProfilePage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 md:p-8 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/borrower">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Create Business Profile</CardTitle>
            <CardDescription>
              Tell the community about your business. A great profile attracts more supporters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" placeholder="e.g., Amina's Artisanal Coffee" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., Food & Beverage" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your business, its mission, and what makes it special." rows={4} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., City Park, Downtown" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="photos">Photos</Label>
                <Input id="photos" type="file" multiple />
                <p className="text-sm text-muted-foreground">Upload images that showcase your product or service.</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="future-plans">Future Plans</Label>
                <Textarea id="future-plans" placeholder="What are your goals? How will the funding help you achieve them?" rows={3} />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" type="button">Cancel</Button>
                <Button type="submit">Save Profile</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
