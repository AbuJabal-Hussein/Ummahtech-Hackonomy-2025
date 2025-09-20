"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Heart, CheckCircle, Smartphone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createTransaction } from "@/app/discover/[id]/actions";

type ContributeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessName: string;
  fundRequestId: string;
  user: User;
  borrowerId: string;
};

export default function ContributeDialog({ open, onOpenChange, businessName, fundRequestId, user, borrowerId }: ContributeDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [contributionType, setContributionType] = useState<"Loan" | "Donation">("Loan");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setIsProcessing(true);
    setStep(2); // Show loading/confirmation
    
    const result = await createTransaction({
        fundRequestId: fundRequestId,
        userId: user.uid,
        borrowerId: borrowerId,
        amount: parseFloat(amount),
        type: contributionType
    });

    setIsProcessing(false);

    if (result.success) {
        setStep(3); // Show success
    } else {
        setStep(1); // Go back to input form
        toast({
            variant: "destructive",
            title: "Contribution Failed",
            description: result.error || "An unexpected error occurred. Please try again.",
        });
    }
  };
  
  const handleClose = () => {
    if (step === 3) {
      toast({
        title: "Contribution Successful!",
        description: `Your ${contributionType} of $${amount} to ${businessName} has been recorded.`,
        className: "bg-primary text-primary-foreground"
      });
      router.refresh(); // Refresh the page to show the new transaction and updated funding
    }
    // Reset state for next time
    setTimeout(() => {
        setStep(1);
        setAmount("");
        setIsProcessing(false);
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
              <Tabs defaultValue="Loan" onValueChange={(value) => setContributionType(value as "Loan" | "Donation")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="Loan"><DollarSign className="mr-2 h-4 w-4" />Loan</TabsTrigger>
                  <TabsTrigger value="Donation"><Heart className="mr-2 h-4 w-4" />Donation</TabsTrigger>
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
                <span>Payment will be processed and recorded on the ledger.</span>
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
              <Button type="submit" onClick={handleConfirm} disabled={!amount || parseFloat(amount) <= 0 || isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirm & Pay'}
              </Button>
            </DialogFooter>
          </>
        )}
        {step === 2 && (
            <div className="flex flex-col items-center justify-center p-8 h-64">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
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
