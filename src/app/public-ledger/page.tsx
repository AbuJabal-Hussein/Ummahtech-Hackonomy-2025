import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data simulating a public ledger
const ledgerEntries = [
  {
    transactionId: "TXN-1001",
    date: "2024-03-15",
    type: "Contribution",
    from: "Contributor A",
    to: "Amina's Artisanal Coffee",
    amount: 50.00,
    status: "Completed",
  },
  {
    transactionId: "TXN-1002",
    date: "2024-03-16",
    type: "Contribution",
    from: "Contributor B",
    to: "Yusuf's Eid Bakery",
    amount: 100.00,
    status: "Completed",
  },
  {
    transactionId: "TXN-1003",
    date: "2024-03-18",
    type: "Repayment",
    from: "Amina's Artisanal Coffee",
    to: "Platform",
    amount: 25.00,
    status: "Completed",
  },
    {
    transactionId: "TXN-1004",
    date: "2024-03-20",
    type: "Donation",
    from: "Contributor C",
    to: "Farida's Bike Repair",
    amount: 75.00,
    status: "Completed",
  },
   {
    transactionId: "TXN-1005",
    date: "2024-03-21",
    type: "Funding",
    from: "Platform",
    to: "Amina's Artisanal Coffee",
    amount: 1200.00,
    status: "Disbursed",
  },
];

export default function PublicLedgerPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Public Ledger</h1>
          <p className="mt-3 max-w-2xl mx-auto text-foreground/70">
            A transparent record of all contributions and repayments on the Barakah Ledger platform.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>This ledger is read-only and provides a full history of platform activity to ensure trust and accountability.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerEntries.map((entry) => (
                  <TableRow key={entry.transactionId}>
                    <TableCell className="font-mono text-xs">{entry.transactionId}</TableCell>
                    <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={entry.type === "Contribution" || entry.type === "Donation" ? "secondary" : "outline"}>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.from}</TableCell>
                    <TableCell className="font-medium">{entry.to}</TableCell>
                    <TableCell className="text-right">${entry.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={entry.status === 'Completed' || entry.status === 'Disbursed' ? 'default' : 'destructive'} className={entry.status === 'Disbursed' ? 'bg-accent text-accent-foreground' : ''}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
