import { businesses } from "@/lib/mock-data";
import BusinessPageClient from "./business-page-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type BusinessPageProps = {
  params: { id: string };
};

export default function BusinessPage({ params }: BusinessPageProps) {
  const business = businesses.find((b) => b.id === params.id);

  if (!business) {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12 text-center">
                <h1 className="text-4xl font-bold">Business Not Found</h1>
                <p className="text-muted-foreground mt-4">The business you are looking for does not exist.</p>
                <Button asChild className="mt-8">
                    <Link href="/discover">Back to Discover</Link>
                </Button>
            </div>
        </div>
    )
  }

  return <BusinessPageClient business={business} />;
}
