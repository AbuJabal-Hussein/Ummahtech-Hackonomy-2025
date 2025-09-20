"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchGuidance, getCommunityGoalsData, CommunityGoalsData } from './actions';


export default function CommunityGoalsPage() {
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoadingGuidance, setIsLoadingGuidance] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [communityData, setCommunityData] = useState<CommunityGoalsData | null>(null);

  const goalDetails = {
      title: "Launch 5 Businesses This Month!",
      description: "Our collective goal is to help at least five new entrepreneurs get their projects off the ground in the next 30 days. Every contribution, big or small, gets us closer."
  };

  useEffect(() => {
    async function loadData() {
      setIsLoadingPage(true);
      const data = await getCommunityGoalsData();
      setCommunityData(data);
      setIsLoadingPage(false);
    }
    loadData();
  }, []);


  const handleGetGuidance = async () => {
    if (!communityData) return;
    setIsLoadingGuidance(true);
    setGuidance(null);
    try {
        const progressPercentage = (communityData.progress / communityData.target) * 100;
        const result = await fetchGuidance(goalDetails.title, progressPercentage, communityData.recentActivities);
        setGuidance(result.guidance);
    } catch (error) {
        console.error("Error fetching guidance:", error);
        setGuidance("Sorry, we couldn't generate guidance at this time. Please try again later.");
    }
    setIsLoadingGuidance(false);
  };

  const progressPercentage = communityData ? (communityData.progress / communityData.target) * 100 : 0;

  if (isLoadingPage || !communityData) {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">{goalDetails.title}</h1>
          <p className="mt-3 max-w-2xl mx-auto text-foreground/70">{goalDetails.description}</p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">{communityData.progress}</span>
              <Progress value={progressPercentage} className="flex-1 h-4" />
              <span className="text-2xl font-bold text-muted-foreground">{communityData.target} Businesses</span>
            </div>
            <p className="text-center mt-2 text-sm text-muted-foreground">{progressPercentage.toFixed(0)}% of our goal achieved!</p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Supporters This Month</CardTitle>
              </CardHeader>
              <CardContent>
                {communityData.contributors.length > 0 ? (
                    <ul className="space-y-4">
                        {communityData.contributors.map((c, i) => (
                            <li key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                <AvatarImage src={c.avatarUrl} />
                                <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{c.name}</span>
                            </div>
                            <Badge variant="secondary">Contributed ${c.contribution.toLocaleString()}</Badge>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>Be the first supporter of the month!</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb/>AI Contribution Guide</CardTitle>
                    <CardDescription>Get AI-powered tips on how to best help us reach our goal.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGetGuidance} disabled={isLoadingGuidance} className="w-full">
                        {isLoadingGuidance ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : "Get Guidance"}
                    </Button>
                    {guidance && (
                        <Alert className="mt-4 bg-background">
                            <AlertTitle>Suggestion</AlertTitle>
                            <AlertDescription>
                                {guidance}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
