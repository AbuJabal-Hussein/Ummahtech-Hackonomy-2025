"use client"

import { useState } from 'react';
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
import { communityGoals } from "@/lib/mock-data";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchGuidance } from './actions';


export default function CommunityGoalsPage() {
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetGuidance = async () => {
    setIsLoading(true);
    setGuidance(null);
    try {
        const progressPercentage = (communityGoals.progress / communityGoals.target) * 100;
        const result = await fetchGuidance(communityGoals.title, progressPercentage, communityGoals.recentActivities);
        setGuidance(result.guidance);
    } catch (error) {
        console.error("Error fetching guidance:", error);
        setGuidance("Sorry, we couldn't generate guidance at this time. Please try again later.");
    }
    setIsLoading(false);
  };

  const progressPercentage = (communityGoals.progress / communityGoals.target) * 100;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">{communityGoals.title}</h1>
          <p className="mt-3 max-w-2xl mx-auto text-foreground/70">{communityGoals.description}</p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">{communityGoals.progress}</span>
              <Progress value={progressPercentage} className="flex-1 h-4" />
              <span className="text-2xl font-bold text-muted-foreground">{communityGoals.target} Businesses</span>
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
                <ul className="space-y-4">
                  {communityGoals.contributors.map((c, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={c.avatarUrl} />
                          <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{c.name}</span>
                      </div>
                      <Badge variant="secondary">Contributed ${c.contribution}</Badge>
                    </li>
                  ))}
                </ul>
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
                    <Button onClick={handleGetGuidance} disabled={isLoading} className="w-full">
                        {isLoading ? (
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
