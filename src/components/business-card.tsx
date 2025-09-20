import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { Business } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

type BusinessCardProps = {
  business: Business;
};

export default function BusinessCard({ business }: BusinessCardProps) {
  const fundingProgress = (business.fundingRaised / business.fundingGoal) * 100;
  const isFunded = fundingProgress >= 100;

  // Use the top-level ID which should be the FundRequest ID
  const linkId = business.id;

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link href={`/discover/${linkId}`} className="block">
        <div className="relative">
          <Image
            src={business.imageUrl}
            alt={business.name}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
            data-ai-hint={business.imageHint}
          />
          {isFunded && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">Funded</Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-muted-foreground">{business.category}</p>
        <h3 className="text-lg font-bold font-headline mt-1">
          <Link href={`/discover/${linkId}`} className="hover:text-primary transition-colors">
            {business.name}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground mt-1">by {business.owner.name}</p>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-medium text-primary">${business.fundingRaised.toLocaleString()}</span>
            <span className="text-muted-foreground">${business.fundingGoal.toLocaleString()}</span>
          </div>
          <Progress value={fundingProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">{fundingProgress.toFixed(0)}% funded</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant={isFunded ? "secondary" : "default"}>
          <Link href={`/discover/${linkId}`}>{isFunded ? "View Details" : "Contribute"}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
