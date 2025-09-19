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
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createBusinessProfile } from "../actions";

const formSchema = z.object({
  name: z.string().min(3, "Business name must be at least 3 characters."),
  category: z.string().min(1, "Please select a category."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  location: z.string().min(3, "Location must be at least 3 characters."),
});


export default function NewBusinessProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: "destructive", title: "You must be logged in to create a profile."});
        return;
    }
    setIsSubmitting(true);
    
    const result = await createBusinessProfile({
        ...values,
        userId: user.uid,
    });

    if (result.success) {
        toast({ title: "Success", description: "Your business profile has been created."});
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
            <CardTitle className="text-2xl font-headline">Create Business Profile</CardTitle>
            <CardDescription>
              Tell the community about your business. A great profile attracts more supporters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" placeholder="e.g., Amina's Artisanal Coffee" {...form.register("name")} />
                {form.formState.errors.name && <p className="text-sm font-medium text-destructive">{form.formState.errors.name.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                        <SelectItem value="crafts-goods">Crafts & Goods</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="arts-culture">Arts & Culture</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                 {form.formState.errors.category && <p className="text-sm font-medium text-destructive">{form.formState.errors.category.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your business, its mission, and what makes it special." rows={4} {...form.register("description")} />
                 {form.formState.errors.description && <p className="text-sm font-medium text-destructive">{form.formState.errors.description.message}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., City Park, Downtown" {...form.register("location")} />
                {form.formState.errors.location && <p className="text-sm font-medium text-destructive">{form.formState.errors.location.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="photos">Photos</Label>
                <Input id="photos" type="file" multiple />
                <p className="text-sm text-muted-foreground">Upload images that showcase your product or service.</p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" type="button" onClick={() => router.push('/dashboard/borrower')}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}