"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, DollarSign, Award, Gift, Loader2 } from "lucide-react";
import Link from 'next/link';
import { getContributorData, ContributorData } from './actions';

export default function ContributorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<ContributorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoading(true);
        const contributorData = await getContributorData(currentUser.uid);
        setData(contributorData);
        setIsLoading(false);
      } else {
        setUser(null);
        setData(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const stats = data?.stats;
  const contributions = data?.contributions || [];

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-headline">Contributor Dashboard</h1>
          <p className="text-muted-foreground">Track your contributions and see the impact you're making.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}><CardHeader><CardTitle className="h-6 w-24 bg-muted rounded"></CardTitle></CardHeader><CardContent><div className="h-8 w-32 bg-muted rounded"></div></CardContent></Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Contributed</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">${stats?.totalContributed.toFixed(2) || '0.00'}</div>
                      <p className="text-xs text-muted-foreground">across {stats?.contributionCount || 0} projects</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                      <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">${stats?.activeLoans.toFixed(2) || '0.00'}</div>
                      <p className="text-xs text-muted-foreground">{stats?.activeLoanCount || 0} active loans</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Barakah Points</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{stats?.barakahPoints || 0}</div>
                      <p className="text-xs text-muted-foreground">Top 10% of contributors</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Thank-You Notes</CardTitle>
                      <Gift className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">2</div>
                      <p className="text-xs text-muted-foreground">from Amina &amp; Yusuf</p>
                  </CardContent>
              </Card>
          </div>
        )}

        <Tabs defaultValue="contributions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="contributions">My Contributions</TabsTrigger>
            <TabsTrigger value="recognition">Recognition</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contributions">
            <Card>
                <CardHeader>
                    <CardTitle>Contribution History</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : contributions.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Business</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contributions.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium">{c.businessName}</TableCell>
                                    <TableCell>{c.type}</TableCell>
                                    <TableCell className="text-right">${Number(c.amount).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{c.status}</Badge>
                                    </TableCell>
                                     <TableCell>{c.date.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                          <Link href={`/discover/${c.fundRequestId}`}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>You haven't made any contributions yet.</p>
                        <Button asChild className="mt-4">
                            <Link href="/discover">Discover Projects to Support</Link>
                        </Button>
                    </div>
                  )}
                </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recognition">
             <Card>
                 <CardHeader>
                     <CardTitle>Your Badges</CardTitle>
                     <CardDescription>Earn badges for your contributions to the community.</CardDescription>
                 </CardHeader>
                 <CardContent className="flex flex-wrap gap-4">
                     <Badge className="p-2 text-base bg-accent text-accent-foreground hover:bg-accent/90">
                        <Award className="mr-2 h-5 w-5"/>First Contribution
                     </Badge>
                      <Badge className="p-2 text-base bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        <Heart className="mr-2 h-5 w-5"/>Community Builder
                     </Badge>
                     <Badge className="p-2 text-base bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        <DollarSign className="mr-2 h-5 w-5"/>Loan Leader
                     </Badge>
                 </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
