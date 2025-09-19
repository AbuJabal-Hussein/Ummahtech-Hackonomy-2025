"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { businesses } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Heart, MapPin, Calendar, Clock } from "lucide-react";
import ContributeDialog from "@/components/contribute-dialog";

type BusinessPageProps = {
  params: { id: string };
};

export default function BusinessPage({ params }: BusinessPageProps) {
  const [isContributeOpen, setContributeOpen] = useState(false);
  const business = businesses.find((b) => b.id === params.id);

  if (!business) {
    notFound();
  }

  const fundingProgress = (business.fundingRaised / business.fundingGoal) * 100;
  const isFunded = fundingProgress >= 100;

  return (
    <>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="md:flex items-start justify-between mb-8">
              <div>
                  <p className="text-sm text-primary font-semibold">{business.category}</p>
                  <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mt-1">{business.name}</h1>
                  <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                      <Avatar className="h-8 w-8">
                          <AvatarImage src={business.owner.avatarUrl} alt={business.owner.name}/>
                          <AvatarFallback>{business.owner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>by {business.owner.name}</span>
                      <MapPin className="h-4 w-4 ml-2"/>
                      <span>{business.location}</span>
                  </div>
              </div>
               <Button size="lg" className="mt-4 md:mt-0" onClick={() => setContributeOpen(true)} disabled={isFunded}>
                  {isFunded ? 'Fully Funded' : (
                      <>
                        <Heart className="mr-2 h-5 w-5" /> Contribute
                      </>
                  )}
              </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-lg mb-8">
                <Image
                  src={business.imageUrl}
                  alt={business.name}
                  width={800}
                  height={500}
                  className="w-full h-64 md:h-96 object-cover"
                  data-ai-hint={business.imageHint}
                />
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle>About this Project</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none text-foreground/80">
                    <p>{business.description}</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column (Funding Details & Updates) */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg mb-8">
                <CardHeader>
                  <CardTitle>Funding Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">${business.fundingRaised.toLocaleString()}</span>
                    <span className="text-muted-foreground">raised of ${business.fundingGoal.toLocaleString()}</span>
                  </div>
                  <Progress value={fundingProgress} className="w-full mt-2 h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{fundingProgress.toFixed(0)}%</span>
                    <span>{isFunded ? "Goal Reached!" : "In Progress"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Repayment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {business.repaymentHistory.length > 0 ? (
                    <ul className="space-y-3">
                      {business.repaymentHistory.map((repayment, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2"/>
                            <span>{new Date(repayment.date).toLocaleDateString()}</span>
                          </div>
                          <span className="font-medium text-primary">${repayment.amount.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No repayments made yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
           {/* Updates Section */}
           <div className="mt-8">
                <h2 className="text-2xl font-bold font-headline mb-4">Updates</h2>
                {business.updates.length > 0 ? (
                    <div className="space-y-6">
                        {business.updates.map((update, index) => (
                            <Card key={index} className="p-4 shadow-sm">
                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>{new Date(update.date).toLocaleDateString()}</span>
                                </div>
                                <p>{update.text}</p>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="flex justify-center items-center h-32">
                        <p className="text-muted-foreground">No updates posted yet.</p>
                    </Card>
                )}
            </div>
        </div>
      </div>
      <ContributeDialog open={isContributeOpen} onOpenChange={setContributeOpen} businessName={business.name}/>
    </>
  );
}
