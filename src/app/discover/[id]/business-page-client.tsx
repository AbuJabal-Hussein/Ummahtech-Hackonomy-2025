"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MapPin, Calendar, Clock, BookOpen, LineChart, TrendingUp, User as UserIcon } from "lucide-react";
import ContributeDialog from "@/components/contribute-dialog";
import type { Business } from "@/lib/mock-data";
import type { Transaction } from "@/app/dashboard/borrower/actions";
import { Badge } from "@/components/ui/badge";

type BusinessPageClientProps = {
  business: Business;
  transactions: Transaction[];
};

export default function BusinessPageClient({ business, transactions }: BusinessPageClientProps) {
  const [isContributeOpen, setContributeOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const fundingProgress = (business.fundingRaised / business.fundingGoal) * 100;
  const loanProgress = (business.loansRaised / business.fundingGoal) * 100;
  const donationProgress = (business.donationsRaised / business.fundingGoal) * 100;
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
            <Button size="lg" className="mt-4 md:mt-0" onClick={() => setContributeOpen(true)} disabled={isFunded || !user}>
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
                  <div className="w-full bg-secondary rounded-full h-3 flex overflow-hidden mt-2">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${loanProgress}%` }}
                      title={`Loans: $${business.loansRaised.toLocaleString()}`}
                    ></div>
                    <div
                      className="bg-accent h-full"
                      style={{ width: `${donationProgress}%` }}
                      title={`Donations: $${business.donationsRaised.toLocaleString()}`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{fundingProgress.toFixed(0)}%</span>
                    <span>{isFunded ? "Goal Reached!" : `${business.fundingGoal - business.fundingRaised} to go`}</span>
                  </div>
                   <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-3">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            <span>Loans: ${business.loansRaised.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-accent"></span>
                            <span>Donations: ${business.donationsRaised.toLocaleString()}</span>
                        </div>
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
                      <CardTitle>Transaction History</CardTitle>
                      <CardDescription>A record of contributions and repayments for this request.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {transactions.length > 0 ? (
                        <ul className="space-y-3">
                          {transactions.map((transaction) => (
                            <li key={transaction.id} className="flex justify-between items-center text-sm p-3 bg-card border rounded-md">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                      <AvatarFallback><UserIcon className="h-4 w-4"/></AvatarFallback>
                                  </Avatar>
                                  <div>
                                      <p className="font-medium">{transaction.contributorName}</p>
                                      <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                                          <Calendar className="h-3 w-3" />
                                          {new Date(transaction.date).toLocaleDateString()}
                                      </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-right">
                                    <div>
                                      <span className="font-medium text-primary">${Number(transaction.amount).toLocaleString()}</span>
                                      <div className="flex gap-1 justify-end">
                                          <Badge variant={transaction.type === 'Repayment' ? 'outline' : 'secondary'} className="text-xs">
                                              {transaction.type}
                                          </Badge>
                                          <Badge variant={transaction.status === 'Completed' ? 'default' : 'destructive'} className={`text-xs ${transaction.status === 'Completed' ? 'bg-accent text-accent-foreground' : ''}`}>
                                              {transaction.status}
                                          </Badge>
                                      </div>
                                    </div>
                                </div>
                              </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No transactions for this request yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      {user && (
         <ContributeDialog 
            open={isContributeOpen} 
            onOpenChange={setContributeOpen} 
            businessName={business.name}
            fundRequestId={business.id}
            user={user}
            borrowerId={business.owner.id}
        />
      )}
    </>
  );
}
