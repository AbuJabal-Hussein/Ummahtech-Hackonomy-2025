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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Camera } from "lucide-react";

export default function VerifyIdPage() {
  return (
    <div className="flex items-center justify-center min-h-screen-minus-header bg-background p-4">
      <style jsx global>{`
        .min-h-screen-minus-header {
          min-height: calc(100vh - 4rem); 
        }
      `}</style>
      <Card className="mx-auto max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Verify Your Identity</CardTitle>
          <CardDescription>
            To ensure trust and safety on the platform, please upload a valid ID and a selfie.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="id-upload">Government-Issued ID</Label>
            <div className="flex items-center gap-2">
              <Input id="id-upload" type="file" className="flex-1" />
              <Button size="icon" variant="outline">
                <UploadCloud className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">e.g., Driver's License, Passport, National ID Card.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="selfie-upload">Selfie</Label>
            <div className="flex items-center gap-2">
              <Input id="selfie-upload" type="file" accept="image/*" capture="user" className="flex-1" />
              <Button size="icon" variant="outline">
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Please provide a clear photo of your face.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button className="w-full">Submit for Verification</Button>
            <Button variant="link" size="sm" asChild>
                <Link href="/dashboard/borrower">Skip for now</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
