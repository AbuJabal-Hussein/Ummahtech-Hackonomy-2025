"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { fetchFraudAnalysis } from './actions';

const defaultUserActions = `User 'JohnDoe' attempted login 5 times in 2 minutes.
User 'JaneSmith' updated business profile location from 'New York' to 'Lagos'.
User 'MikeR' created 3 new funding requests in 1 hour.`;

const defaultFundingRequests = `Request FR-1023 by 'JohnDoe' for '$5000' for 'New Gadget Resale'.
Request FR-1024 by 'AliceW' for '$300' for 'Community Garden'.`;

const defaultTransactions = `TXN-9987: 'JaneSmith' repaid '$50' from a different wallet than contributed.
TXN-9988: 'JohnDoe' received a '$1000' contribution from a newly created account.`;


export default function FraudDetectionPage() {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userActions, setUserActions] = useState(defaultUserActions);
    const [fundingRequests, setFundingRequests] = useState(defaultFundingRequests);
    const [transactions, setTransactions] = useState(defaultTransactions);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const res = await fetchFraudAnalysis(userActions, fundingRequests, transactions);
            setResult(res.flaggedActivities || "No fraudulent activities detected.");
        } catch (error) {
            console.error("Error fetching fraud analysis:", error);
            setResult("An error occurred while analyzing the data. Please try again.");
        }
        setIsLoading(false);
    }

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto p-4 md:p-8 max-w-4xl">
                 <div className="mb-6">
                    <Button variant="ghost" asChild>
                        <Link href="/admin">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Admin Dashboard
                        </Link>
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">AI-Powered Fraud Detection</CardTitle>
                        <CardDescription>
                            Analyze user actions, funding requests, and transactions to identify potentially fraudulent activities based on pre-defined heuristics.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="user-actions">User Actions</Label>
                            <Textarea id="user-actions" value={userActions} onChange={e => setUserActions(e.target.value)} rows={4} placeholder="Log of recent user actions..."/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="funding-requests">Funding Requests</Label>
                            <Textarea id="funding-requests" value={fundingRequests} onChange={e => setFundingRequests(e.target.value)} rows={3} placeholder="Details of recent funding requests..."/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="transactions">Transactions</Label>
                            <Textarea id="transactions" value={transactions} onChange={e => setTransactions(e.target.value)} rows={3} placeholder="Record of recent transactions..."/>
                        </div>
                        
                        <Button onClick={handleAnalyze} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                            {isLoading ? "Analyzing..." : "Analyze for Fraud"}
                        </Button>

                        {result && (
                            <Alert variant={result === "No fraudulent activities detected." ? "default" : "destructive"}>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Analysis Result</AlertTitle>
                                <AlertDescription className="whitespace-pre-wrap">
                                    {result}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
