'use server';

import { db } from '@/lib/firebase';
import { doc, runTransaction, collection, Timestamp, getDoc } from 'firebase/firestore';

export async function createTransaction(data: {
  fundRequestId: string;
  userId: string;
  borrowerId: string;
  amount: number;
  type: 'Loan' | 'Donation';
}) {
  try {
    const fundRequestRef = doc(db, 'FundRequests', data.fundRequestId);

    await runTransaction(db, async (transaction) => {
        const fundRequestDoc = await transaction.get(fundRequestRef);
        if (!fundRequestDoc.exists()) {
            throw new Error('Fund request does not exist!');
        }

        // 1. Update the current_funding on the FundRequest
        const newFunding = (fundRequestDoc.data().current_funding || 0) + data.amount;
        transaction.update(fundRequestRef, { current_funding: newFunding });
        
        // 2. Create a new transaction document
        const newTransactionRef = doc(collection(fundRequestRef, 'transactions'));
        transaction.set(newTransactionRef, {
            amount: data.amount,
            type: data.type,
            contributorId: data.userId,
            borrowerId: data.borrowerId,
            status: 'Completed',
            date: Timestamp.now(),
        });
    });

    return { success: true };
  } catch (error) {
    console.error('Transaction failed: ', error);
    return { success: false, error: 'Failed to process transaction.' };
  }
}
