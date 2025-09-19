import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign } from "lucide-react";

export default function NewFundingRequestPage() {
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
            <CardTitle className="text-2xl font-headline">Create Funding Request</CardTitle>
            <CardDescription>
              Clearly state your funding needs to the community. Transparency is key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="business-profile">Business Profile</Label>
                <Select>
                  <SelectTrigger id="business-profile">
                    <SelectValue placeholder="Select a business profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amina-coffee">Amina's Artisanal Coffee</SelectItem>
                    {/* Add more profiles dynamically */}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="funding-goal">Funding Goal (USD)</Label>
                 <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="funding-goal" type="number" placeholder="1200" className="pl-8" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="breakdown">Breakdown of Costs</Label>
                <Textarea id="breakdown" placeholder="e.g., New Oven: $500, Ingredients: $200, Packaging: $100" rows={4} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="deadline">Funding Deadline</Label>
                <Input id="deadline" type="date" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="supporting-photos">Supporting Photos</Label>
                <Input id="supporting-photos" type="file" multiple />
                 <p className="text-sm text-muted-foreground">e.g., a photo of the equipment you want to buy.</p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" type="button">Save Draft</Button>
                <Button type="submit">Publish Request</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
