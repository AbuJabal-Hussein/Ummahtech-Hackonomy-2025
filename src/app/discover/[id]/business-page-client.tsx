"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MapPin, Calendar, Clock, BookOpen, LineChart, TrendingUp } from "lucide-react";
import ContributeDialog from "@/components/contribute-dialog";
import type { Business } from "@/lib/mock-data";

type BusinessPageClientProps = {
  business: Business;
};

export default function BusinessPageClient({ business }: BusinessPageClientProps) {
  const [isContributeOpen, setContributeOpen] = useState(false);

  const fundingProgress = (business.fundingRaised / business.fundingGoal) * 100;
  const isFunded = fundingProgress >= 100;

  return (
    <>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="md:flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-primary font-semibold">{business.category}</p>
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mt-1">{business.name}</h1>
              <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={business.owner.avatarUrl} alt={business.owner.name} />
                  <AvatarFallback>{business.owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>by {business.owner.name}</span>
                <MapPin className="h-4 w-4 ml-2" />
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

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Column (Image and funding) */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <Card className="overflow-hidden shadow-lg">
                <Image
                  src={business.imageUrl}
                  alt={business.name}
                  width={800}
                  height={500}
                  className="w-full h-64 object-cover"
                  data-ai-hint={business.imageHint}
                />
              </Card>
              <Card className="shadow-lg">
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
                    <span>{isFunded ? "Goal Reached!" : `${business.fundingGoal - business.fundingRaised} to go`}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column (Tabs) */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="story" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="story"><BookOpen className="mr-2 h-4 w-4" />Our Story</TabsTrigger>
                  <TabsTrigger value="updates"><TrendingUp className="mr-2 h-4 w-4" />Updates</TabsTrigger>
                  <TabsTrigger value="track-record"><LineChart className="mr-2 h-4 w-4" />Track Record</TabsTrigger>
                </TabsList>
                
                <TabsContent value="story" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About Our Project</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none text-foreground/80">
                      <p>{business.description}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="updates" className="mt-6">
                   <Card>
                    <CardHeader>
                      <CardTitle>Latest News</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {business.updates.length > 0 ? (
                          <div className="space-y-6">
                              {business.updates.map((update, index) => (
                                  <div key={index} className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                          <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
                                              <Clock className="h-4 w-4" />
                                          </div>
                                          <div className="w-px flex-grow bg-border my-2"></div>
                                      </div>
                                      <div>
                                          <p className="text-sm text-muted-foreground mb-1">{new Date(update.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                          <p className="text-foreground/90">{update.text}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="flex justify-center items-center h-32 text-center">
                              <p className="text-muted-foreground">No updates posted yet. Be the first to contribute and see this project grow!</p>
                          </div>
                      )}
                      </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="track-record" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Repayment History</CardTitle>
                      <CardDescription>A record of loan repayments made through the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {business.repaymentHistory.length > 0 ? (
                        <ul className="space-y-3">
                          {business.repaymentHistory.map((repayment, index) => (
                            <li key={index} className="flex justify-between items-center text-sm p-3 bg-secondary/30 rounded-md">
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{new Date(repayment.date).toLocaleDateString()}</span>
                              </div>
                              <span className="font-medium text-primary">${repayment.amount.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No repayments made yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <ContributeDialog open={isContributeOpen} onOpenChange={setContributeOpen} businessName={business.name} />
    </>
  );
}
