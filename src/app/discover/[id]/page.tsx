import BusinessPageClient from "./business-page-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getFundRequestById, getTransactionsForFundRequest } from "../actions";

type BusinessPageProps = {
  params: { id: string };
};

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { id } = params;
  const [business, transactions] = await Promise.all([
    getFundRequestById(id),
    getTransactionsForFundRequest(id),
  ]);
  
  if (!business) {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12 text-center">
                <h1 className="text-4xl font-bold">Business Not Found</h1>
                <p className="text-muted-foreground mt-4">The business you are looking for does not exist or is no longer accepting funding.</p>
                <Button asChild className="mt-8">
                    <Link href="/discover">Back to Discover</Link>
                </Button>
            </div>
        </div>
    )
  }
  return <BusinessPageClient business={business} transactions={transactions} />;
}
