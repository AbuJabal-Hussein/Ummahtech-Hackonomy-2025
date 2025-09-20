'use server';

import { db } from '@/lib/firebase';
import { collectionGroup, getDocs, query, Timestamp, getDoc } from 'firebase/firestore';

// This function is also in discover/actions.ts, ideally it would be in a shared lib file.
async function getUserDisplayName(userId: string): Promise<string> {
    if (!userId) return 'Anonymous';
    try {
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data().displayName || 'Anonymous';
        }
        return 'Anonymous';
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return 'Anonymous';
    }
}

export interface LedgerEntry {
    transactionId: string;
    date: Date;
    type: 'Contribution' | 'Repayment' | 'Donation' | 'Loan';
    from: string;
    to: string;
    amount: number;
    status: string;
}


export async function getLedgerEntries(): Promise<LedgerEntry[]> {
    const ledger: LedgerEntry[] = [];
    
    // Query the 'transactions' collection group
    const transactionsQuery = query(collectionGroup(db, 'transactions'));
    const querySnapshot = await getDocs(transactionsQuery);

    for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const fundRequestRef = docSnap.ref.parent.parent;
        
        let contributorName = 'Anonymous';
        let businessName = 'N/A';

        // Get contributor name
        if (data.contributorId) {
            contributorName = await getUserDisplayName(data.contributorId);
        }

        // Get business name from parent FundRequest
        if (fundRequestRef) {
            const fundRequestSnap = await getDoc(fundRequestRef);
            if (fundRequestSnap.exists()) {
                businessName = fundRequestSnap.data().businessName || 'Untitled Business';
            }
        }
        
        // Determine 'from' and 'to' based on transaction type
        let from, to;
        if (data.type === 'Repayment') {
            from = businessName;
            to = "Platform"; 
        } else {
            from = contributorName;
            to = businessName;
        }

        ledger.push({
            transactionId: docSnap.id,
            date: (data.date as Timestamp).toDate(),
            type: data.type,
            from: from,
            to: to,
            amount: Number(data.amount) || 0,
            status: data.status,
        });
    }

    // Sort by most recent date
    ledger.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return ledger;
}