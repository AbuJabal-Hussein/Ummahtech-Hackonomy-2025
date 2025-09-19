"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBusinessProfiles, createFundingRequest, BusinessProfile } from "../actions";

const formSchema = z.object({
  businessId: z.string().min(1, "Please select a business profile."),
  fundingGoal: z.coerce.number().positive("Funding goal must be a positive number."),
  breakdown: z.string().min(10, "Please provide a breakdown of costs."),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), "Please select a valid date."),
});


export default function NewFundingRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const fetchedProfiles = await getBusinessProfiles(currentUser.uid);
        setProfiles(fetchedProfiles);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessId: "",
      fundingGoal: 0,
      breakdown: "",
      deadline: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: "destructive", title: "You must be logged in."});
        return;
    }
    setIsSubmitting(true);
    
    const selectedProfile = profiles.find(p => p.id === values.businessId);
    if (!selectedProfile) {
        toast({ variant: "destructive", title: "Invalid business profile selected."});
        setIsSubmitting(false);
        return;
    }

    const result = await createFundingRequest({
        ownerId: user.uid,
        businessId: values.businessId,
        businessName: selectedProfile.name,
        fundingGoal: values.fundingGoal,
        breakdown: values.breakdown,
        deadline: new Date(values.deadline),
    });

    if (result.success) {
        toast({ title: "Success", description: "Your funding request has been published."});
        router.push("/dashboard/borrower");
    } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
    }
    setIsSubmitting(false);
  }


  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 md:p-8 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/borrower">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Create Funding Request</CardTitle>
            <CardDescription>
              Clearly state your funding needs to the community. Transparency is key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="business-profile">Business Profile</Label>
                <Controller
                  control={form.control}
                  name="businessId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="business-profile">
                        <SelectValue placeholder="Select a business profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map(profile => (
                            <SelectItem key={profile.id} value={profile.id}>{profile.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.businessId && <p className="text-sm font-medium text-destructive">{form.formState.errors.businessId.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="funding-goal">Funding Goal (USD)</Label>
                 <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="funding-goal" type="number" placeholder="1200" className="pl-8" {...form.register("fundingGoal")} />
                </div>
                 {form.formState.errors.fundingGoal && <p className="text-sm font-medium text-destructive">{form.formState.errors.fundingGoal.message}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="breakdown">Breakdown of Costs</Label>
                <Textarea id="breakdown" placeholder="e.g., New Oven: $500, Ingredients: $200, Packaging: $100" rows={4} {...form.register("breakdown")}/>
                 {form.formState.errors.breakdown && <p className="text-sm font-medium text-destructive">{form.formState.errors.breakdown.message}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="deadline">Funding Deadline</Label>
                <Input id="deadline" type="date" {...form.register("deadline")} />
                {form.formState.errors.deadline && <p className="text-sm font-medium text-destructive">{form.formState.errors.deadline.message}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="supporting-photos">Supporting Photos</Label>
                <Input id="supporting-photos" type="file" multiple />
                 <p className="text-sm text-muted-foreground">e.g., a photo of the equipment you want to buy.</p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" type="button" disabled={isSubmitting}>Save Draft</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {isSubmitting ? "Publishing..." : "Publish Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
