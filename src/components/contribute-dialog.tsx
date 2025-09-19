"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DollarSign, Heart, CheckCircle, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ContributeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessName: string;
};

export default function ContributeDialog({ open, onOpenChange, businessName }: ContributeDialogProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [contributionType, setContributionType] = useState("loan");
  const { toast } = useToast();

  const handleConfirm = () => {
    // Simulate payment processing
    setStep(2); // Show loading/confirmation
    setTimeout(() => {
      setStep(3); // Show success
    }, 1500);
  };
  
  const handleClose = () => {
    if (step === 3) {
      toast({
        title: "Contribution Successful!",
        description: `Your ${contributionType} of $${amount} to ${businessName} has been recorded.`,
        className: "bg-primary text-primary-foreground"
      });
    }
    // Reset state for next time
    setTimeout(() => {
        setStep(1);
        setAmount("");
    }, 200);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Contribute to {businessName}</DialogTitle>
              <DialogDescription>
                Choose your contribution type and amount. Your support makes a difference!
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="loan" onValueChange={setContributionType} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="loan"><DollarSign className="mr-2 h-4 w-4" />Loan</TabsTrigger>
                  <TabsTrigger value="donation"><Heart className="mr-2 h-4 w-4" />Donation</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div>
                <Label htmlFor="amount" className="text-right">
                  Amount (USD)
                </Label>
                <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="50.00"
                        className="pl-8"
                    />
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex items-start gap-2 p-3 bg-secondary rounded-lg">
                <Smartphone className="h-5 w-5 mt-0.5 shrink-0"/>
                <span>Payment will be processed via a simulated mobile money API. You'll receive a confirmation on your device.</span>
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" onClick={handleConfirm} disabled={!amount || parseFloat(amount) <= 0}>Confirm &amp; Pay</Button>
            </DialogFooter>
          </>
        )}
        {step === 2 && (
            <div className="flex flex-col items-center justify-center p-8 h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Processing your contribution...</p>
            </div>
        )}
        {step === 3 && (
            <div className="flex flex-col items-center justify-center p-8 h-64">
                <CheckCircle className="h-16 w-16 text-primary" />
                <h3 className="text-2xl font-bold mt-4">Thank You!</h3>
                <p className="mt-2 text-muted-foreground text-center">Your contribution was successful.</p>
                <Button onClick={handleClose} className="mt-6">Done</Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
