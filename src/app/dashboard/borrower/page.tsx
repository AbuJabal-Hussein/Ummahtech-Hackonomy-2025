import Link from "next/link";
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
import { PlusCircle, Edit } from "lucide-react";

const mockRequests = [
  {
    id: 1,
    name: "Amina's Artisanal Coffee",
    status: "Funded",
    raised: 1200,
    goal: 1200,
  },
  {
    id: 2,
    name: "Eid Bakery Expansion",
    status: "In Progress",
    raised: 550,
    goal: 800,
  },
];

const mockProfiles = [
    {
        id: 1,
        name: "Amina's Artisanal Coffee",
        category: "Food & Beverage",
    }
];

export default function BorrowerDashboard() {
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
            <div className="grid gap-6">
              {mockRequests.map((req) => (
                <Card key={req.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{req.name}</CardTitle>
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
                      <span className="text-muted-foreground">${req.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={(req.raised / req.goal) * 100} className="h-2" />
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Post Update</Button>
                  </CardFooter>
                </Card>
              ))}
              {mockRequests.length === 0 && (
                <Card className="flex flex-col items-center justify-center p-12">
                    <CardTitle>No Funding Requests Yet</CardTitle>
                    <CardDescription className="mt-2">Create a request to start your funding journey.</CardDescription>
                    <Button className="mt-4" asChild><Link href="/dashboard/borrower/new-request">Create Request</Link></Button>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="profiles">
             <div className="grid gap-6">
                {mockProfiles.map(profile => (
                     <Card key={profile.id}>
                        <CardHeader className="flex flex-row justify-between items-start">
                             <div>
                                <CardTitle>{profile.name}</CardTitle>
                                <CardDescription>{profile.category}</CardDescription>
                             </div>
                             <Button variant="ghost" size="sm"><Edit className="mr-2 h-4 w-4"/> Edit Profile</Button>
                        </CardHeader>
                     </Card>
                ))}
                {mockProfiles.length === 0 && (
                    <Card className="flex flex-col items-center justify-center p-12">
                        <CardTitle>No Business Profiles</CardTitle>
                        <CardDescription className="mt-2">Create a business profile first.</CardDescription>
                        <Button className="mt-4" asChild><Link href="/dashboard/borrower/new-profile">Create Profile</Link></Button>
                    </Card>
                )}
             </div>
          </TabsContent>
          
          <TabsContent value="repayments">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Repayments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <p>No upcoming repayments.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
