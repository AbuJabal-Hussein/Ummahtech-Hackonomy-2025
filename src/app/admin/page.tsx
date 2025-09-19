import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adminData } from "@/lib/mock-data";
import { Ban, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform oversight and management.</p>
          </div>
          <Button asChild>
            <Link href="/admin/fraud-detection">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Fraud Detection Tool
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="businesses">Manage Businesses</TabsTrigger>
            <TabsTrigger value="requests">Review Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Approve, ban, or flag user accounts.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData.users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={user.flagged ? "destructive" : "default"}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" className="text-green-600"><CheckCircle className="h-4 w-4"/></Button>
                           <Button variant="ghost" size="sm" className="text-red-600"><Ban className="h-4 w-4"/></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="businesses">
            <Card>
               <CardHeader>
                <CardTitle>Business Profile Management</CardTitle>
                <CardDescription>Approve or flag business profiles for quality and authenticity.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData.businesses.map(b => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.name}</TableCell>
                        <TableCell>{b.owner}</TableCell>
                        <TableCell>
                          <Badge variant={b.flagged ? "destructive" : "default"}>{b.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" className="text-green-600"><CheckCircle className="h-4 w-4"/></Button>
                           <Button variant="ghost" size="sm" className="text-red-600"><AlertTriangle className="h-4 w-4"/></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests">
             <Card>
               <CardHeader>
                <CardTitle>Funding Request Review</CardTitle>
                <CardDescription>Review new funding requests before they go public.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData.fundingRequests.map(fr => (
                      <TableRow key={fr.id}>
                        <TableCell className="font-medium">{fr.business}</TableCell>
                        <TableCell>${fr.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={fr.flagged ? "destructive" : "default"}>{fr.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" className="text-green-600"><CheckCircle className="h-4 w-4"/></Button>
                           <Button variant="ghost" size="sm" className="text-red-600"><AlertTriangle className="h-4 w-4"/></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
