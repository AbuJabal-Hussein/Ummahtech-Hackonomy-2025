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
        
        const fundRequestData = fundRequestDoc.data();
        const fundingGoal = fundRequestData.funding_goal || 0;

        // 1. Update the current_funding on the FundRequest
        const newFunding = (fundRequestData.current_funding || 0) + data.amount;
        
        const updateData: { current_funding: number, status?: string } = { current_funding: newFunding };

        // 2. Check if the funding goal has been met and update status
        if (newFunding >= fundingGoal && fundRequestData.status !== 'Funded') {
            updateData.status = 'Funded';
        }

        transaction.update(fundRequestRef, updateData);
        
        // 3. Create a new transaction document
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
