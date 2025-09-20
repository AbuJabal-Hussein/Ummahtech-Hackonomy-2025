'use server';

import { db } from '@/lib/firebase';
import { collectionGroup, query, where, getDocs, getDoc, Timestamp } from 'firebase/firestore';
import type { Transaction } from '@/app/dashboard/borrower/actions';

export type ContributorStats = {
    totalContributed: number;
    contributionCount: number;
    activeLoans: number;
    activeLoanCount: number;
    barakahPoints: number;
}

export type ContributorData = {
    contributions: Transaction[];
    stats: ContributorStats;
}

export async function getContributorData(userId: string): Promise<ContributorData> {
    if (!userId) return { contributions: [], stats: { totalContributed: 0, contributionCount: 0, activeLoans: 0, activeLoanCount: 0, barakahPoints: 0 }};

    const contributions: Transaction[] = [];
    let totalContributed = 0;
    let activeLoans = 0;
    let activeLoanCount = 0;

    const q = query(
        collectionGroup(db, 'transactions'),
        where('contributorId', '==', userId)
    );
    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const fundRequestRef = docSnap.ref.parent.parent;
        let businessName = "Unknown Business";
        let fundRequestStatus = "Unknown";

        if (fundRequestRef) {
            const fundRequestSnap = await getDoc(fundRequestRef);
            if (fundRequestSnap.exists()) {
                const fundRequestData = fundRequestSnap.data();
                businessName = fundRequestData.businessName;
                fundRequestStatus = fundRequestData.status;
            }
        }
        
        const amount = Number(data.amount) || 0;
        
        const contribution: Transaction = {
            id: docSnap.id,
            amount: String(amount),
            contributorId: data.contributorId,
            borrowerId: data.borrowerId,
            type: data.type,
            status: data.status,
            date: (data.date as Timestamp).toDate(),
            fundRequestId: fundRequestRef?.id || '',
            businessName: businessName,
        };

        contributions.push(contribution);

        totalContributed += amount;

        if (data.type === 'Loan' && fundRequestStatus !== 'Completed') {
            activeLoans += amount;
            activeLoanCount++;
        }
    }
    
    // Sort contributions by most recent
    contributions.sort((a, b) => b.date.getTime() - a.date.getTime());

    const stats: ContributorStats = {
        totalContributed,
        contributionCount: contributions.length,
        activeLoans,
        activeLoanCount,
        barakahPoints: Math.floor(totalContributed), // 1 point per dollar
    };

    return { contributions, stats };
}
