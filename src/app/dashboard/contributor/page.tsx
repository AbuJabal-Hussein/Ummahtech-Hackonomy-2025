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
import { Heart, DollarSign, Award, Gift } from "lucide-react";

const mockContributions = [
  {
    id: 1,
    business: "Amina's Artisanal Coffee",
    type: "Loan",
    amount: 200,
    status: "Repaying",
  },
  {
    id: 2,
    business: "Yusuf's Eid Bakery",
    type: "Donation",
    amount: 50,
    status: "Completed",
  },
  {
    id: 3,
    business: "Farida's Bike Repair",
    type: "Loan",
    amount: 100,
    status: "Pending Repayment",
  },
];

export default function ContributorDashboard() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-headline">Contributor Dashboard</h1>
          <p className="text-muted-foreground">Track your contributions and see the impact you're making.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Contributed</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$350.00</div>
                    <p className="text-xs text-muted-foreground">across 3 projects</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$300.00</div>
                    <p className="text-xs text-muted-foreground">2 active loans</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Barakah Points</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">350</div>
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Business</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockContributions.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium">{c.business}</TableCell>
                                    <TableCell>{c.type}</TableCell>
                                    <TableCell className="text-right">${c.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{c.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
