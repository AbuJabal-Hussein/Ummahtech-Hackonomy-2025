import BusinessCard from "@/components/business-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { getFundRequests } from "./actions";

export default async function DiscoverPage() {
  const businesses = await getFundRequests();
  const categories = [...new Set(businesses.map((b) => b.category))];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Discover Projects</h1>
          <p className="mt-3 max-w-2xl mx-auto text-foreground/70">
            Find and support entrepreneurs in your community. Your contribution makes a real impact.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-4 bg-card rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
              <label htmlFor="search" className="text-sm font-medium text-muted-foreground">Search</label>
              <Search className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
              <Input id="search" placeholder="Business name..." className="pl-10 mt-1" />
            </div>
            <div>
              <label htmlFor="category" className="text-sm font-medium text-muted-foreground">Category</label>
              <Select>
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase().replace(/ /g, "-")}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="status" className="text-sm font-medium text-muted-foreground">Funding Status</label>
              <Select>
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue placeholder="Any Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="any">Any Status</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="funded">Funded</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div>
              <label htmlFor="location" className="text-sm font-medium text-muted-foreground">Location</label>
              <Input id="location" placeholder="City or neighborhood" className="mt-1" />
            </div>
          </div>
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </div>
  );
}
