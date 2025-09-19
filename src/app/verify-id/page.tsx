"use client";

import { useState, useEffect, useRef } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, Camera, Video, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyIdPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        // Only checking for permission, not starting the stream yet
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Immediately stop the tracks to not keep the camera on
        stream.getTracks().forEach(track => track.stop());
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();
  }, []);

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
        if (hasCameraPermission === false) {
             toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
            return;
        }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (error) {
        console.error('Error starting camera:', error);
        toast({
          variant: 'destructive',
          title: 'Could not start camera',
          description: 'Please ensure your camera is not being used by another application.',
        });
      }
    }
  };


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
            <Label>Live Selfie</Label>
             <div className="w-full aspect-video rounded-md bg-muted flex items-center justify-center overflow-hidden">
                <video ref={videoRef} className={`w-full h-full object-cover ${!isCameraOn && 'hidden'}`} autoPlay muted playsInline />
                {!isCameraOn && <Camera className="h-16 w-16 text-muted-foreground" />}
            </div>
             {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser settings to use this feature.
                  </AlertDescription>
                </Alert>
             )}
            <div className="flex items-center gap-2">
                <Button onClick={toggleCamera} variant="outline" className="flex-1" disabled={hasCameraPermission === null}>
                    {isCameraOn ? <VideoOff className="mr-2"/> : <Video className="mr-2"/>}
                    {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
                </Button>
                <Button size="icon" disabled={!isCameraOn}>
                    <Camera className="h-5 w-5" />
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">Center your face in the frame and take a clear photo.</p>
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
