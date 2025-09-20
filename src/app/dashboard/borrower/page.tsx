"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, MapPin, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBusinessProfiles, getFundingRequests, getRepayments, BusinessProfile, FundingRequest, Transaction } from "./actions";

export default function BorrowerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [requests, setRequests] = useState<FundingRequest[]>([]);
  const [repayments, setRepayments] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoading(true);
        const [fetchedProfiles, fetchedRequests, fetchedRepayments] = await Promise.all([
            getBusinessProfiles(currentUser.uid),
            getFundingRequests(currentUser.uid),
            getRepayments(currentUser.uid),
        ]);
        setProfiles(fetchedProfiles);
        setRequests(fetchedRequests);
        setRepayments(fetchedRepayments);
      } else {
        setUser(null);
        setProfiles([]);
        setRequests([]);
        setRepayments([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline">Borrower Dashboard</h1>
            <p className="text-muted-foreground">Manage your business profiles and funding requests.</p>
          </div>
          <div className="flex gap-2">
             <Button asChild>
                <Link href="/dashboard/borrower/new-profile">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Business Profile
                </Link>
             </Button>
             <Button asChild variant="secondary">
                <Link href="/dashboard/borrower/new-request">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Funding Request
                </Link>
             </Button>
          </div>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="requests">My Funding Requests</TabsTrigger>
            <TabsTrigger value="profiles">My Business Profiles</TabsTrigger>
            <TabsTrigger value="repayments">Repayments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests">
             {isLoading ? (
                <div className="flex justify-center items-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
             ) : (
                <div className="grid gap-6">
                {requests.map((req) => (
                    <Card key={req.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{req.businessName}</CardTitle>
                            <CardDescription>
                            <Badge variant={req.status === "Funded" ? "default" : "secondary"} className={req.status === 'Funded' ? 'bg-accent text-accent-foreground' : ''}>
                                {req.status}
                            </Badge>
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm"><Edit className="mr-2 h-4 w-4"/> Manage</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-medium text-primary">${req.raised.toLocaleString()}</span>
                        <span className="text-muted-foreground">${req.fundingGoal.toLocaleString()}</span>
                        </div>
                        <Progress value={(req.raised / req.fundingGoal) * 100} className="h-2" />
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline">Post Update</Button>
                    </CardFooter>
                    </Card>
                ))}
                {requests.length === 0 && (
                    <Card className="flex flex-col items-center justify-center p-12">
                        <CardTitle>No Funding Requests Yet</CardTitle>
                        <CardDescription className="mt-2">Create a request to start your funding journey.</CardDescription>
                        <Button className="mt-4" asChild><Link href="/dashboard/borrower/new-request">Create Request</Link></Button>
                    </Card>
                )}
                </div>
             )}
          </TabsContent>
          
          <TabsContent value="profiles">
             {isLoading ? (
                <div className="flex justify-center items-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
             ) : (
                <div className="grid gap-6">
                    {profiles.map(profile => (
                       <Link key={profile.id} href={`/discover/${profile.id}`} className="block hover:shadow-lg transition-shadow rounded-lg">
                            <Card>
                                <CardHeader className="flex flex-row justify-between items-start">
                                    <div>
                                        <CardTitle>{profile.name}</CardTitle>
                                        <CardDescription>{profile.category}</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* router.push(`/dashboard/borrower/edit-profile/${profile.id}`) */ }}>
                                        <Edit className="mr-2 h-4 w-4"/> Edit Profile
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2">{profile.description}</p>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        <span>{profile.location}</span>
                                    </div>
                                </CardContent>
                            </Card>
                       </Link>
                    ))}
                    {profiles.length === 0 && (
                        <Card className="flex flex-col items-center justify-center p-12">
                            <CardTitle>No Business Profiles</CardTitle>
                            <CardDescription className="mt-2">Create a business profile first.</CardDescription>
                            <Button className="mt-4" asChild><Link href="/dashboard/borrower/new-profile">Create Profile</Link></Button>
                        </Card>
                    )}
                </div>
             )}
          </TabsContent>
          
          <TabsContent value="repayments">
            <Card>
              <CardHeader>
                <CardTitle>Repayment History</CardTitle>
                <CardDescription>A record of all repayments you have made.</CardDescription>
              </CardHeader>
              <CardContent>
                 {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                 ) : repayments.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Fund Request ID</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {repayments.map(repayment => (
                                <TableRow key={repayment.id}>
                                    <TableCell>{repayment.date.toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-xs">{repayment.fundRequestId}</TableCell>
                                    <TableCell className="text-right">${repayment.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{repayment.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No repayments made yet.</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
