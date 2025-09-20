'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, DocumentData, collectionGroup, query, where, Timestamp } from 'firebase/firestore';
import type { Business } from '@/lib/mock-data';
import type { Transaction } from '@/app/dashboard/borrower/actions';

// A simplified version for the discover page card.
// In a real app you might want to create a more specific type.
export type EnrichedFundingRequest = Business;


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

export async function getBusinessDetails(businessId: string, ownerId: string = ''): Promise<Partial<Business>> {
    try {
        if (!businessId) {
            console.warn(`getBusinessDetails called with no businessId for owner ${ownerId}.`);
            return {};
        }
        const businessRef = doc(db, 'Businesses', businessId);
        const businessSnap = await getDoc(businessRef);

        if (!businessSnap.exists()) {
            console.warn(`Business with ID ${businessId} not found in 'Businesses' collection.`);
            return {};
        }

        const businessData = businessSnap.data();
        const ownerName = await getUserDisplayName(ownerId);

        const owner = {
            id: ownerId,
            name: ownerName,
            avatarUrl: `https://picsum.photos/seed/${ownerId || businessId}/100/100`,
        };

        return {
            businessId: businessSnap.id,
            name: businessData.name,
            description: businessData.description || 'No description available.',
            category: businessData.category || 'Uncategorized',
            location: businessData.location || 'No location set.',
            imageUrl: businessData.imageUrl || `https://texascoffeeschool.com/wp-content/uploads/2021/10/DSC_0052-scaled.jpg`,
            imageHint: businessData.imageHint || "business photo",
            owner: owner,
            repaymentHistory: [],
            updates: [], 
        };
    } catch (error) {
        console.error(`Error fetching details for business ${businessId}:`, error);
        return {};
    }
}


export async function getFundRequests(): Promise<EnrichedFundingRequest[]> {
    const fundRequestsCol = collection(db, 'FundRequests');
    const fundRequestsSnapshot = await getDocs(fundRequestsCol);

    const enrichedRequests: EnrichedFundingRequest[] = [];

    for (const fundRequestDoc of fundRequestsSnapshot.docs) {
        const fundRequestData = fundRequestDoc.data() as DocumentData;
        const businessId = fundRequestData.business_id;

        const businessDetails = await getBusinessDetails(businessId, fundRequestData.ownerId);

        enrichedRequests.push({
            id: fundRequestDoc.id,
            fundingGoal: fundRequestData.funding_goal || 0,
            fundingRaised: fundRequestData.current_funding || 0,
            loansRaised: 0, // Not calculated for discover page cards
            donationsRaised: 0, // Not calculated for discover page cards
            ...businessDetails,
            name: fundRequestData.businessName || businessDetails.name || 'Untitled Business',
            businessId: businessId, 
            description: businessDetails.description || 'No description available.',
            category: businessDetails.category || 'Uncategorized',
            location: businessDetails.location || 'No location set.',
            imageUrl: businessDetails.imageUrl || `https://picsum.photos/seed/${businessId}/800/600`,
            imageHint: businessDetails.imageHint || 'business',
            owner: businessDetails.owner || { id: fundRequestData.ownerId, name: 'Unknown', avatarUrl: ''},
            repaymentHistory: businessDetails.repaymentHistory || [],
            updates: businessDetails.updates || [],
        } as EnrichedFundingRequest);
    }
    
    return enrichedRequests;
}


export async function getFundRequestById(id: string): Promise<EnrichedFundingRequest | null> {
    const fundRequestRef = doc(db, 'FundRequests', id);
    const fundRequestSnap = await getDoc(fundRequestRef);

    if (!fundRequestSnap.exists()) {
        console.warn(`Fund request with ID ${id} not found.`);
        return null;
    }

    const fundRequestData = fundRequestSnap.data() as DocumentData;
    const businessId = fundRequestData.business_id;

    if (!businessId) {
        console.error(`Fund request with ID ${id} is missing a business_id.`);
        return null;
    }

    const [businessDetails, transactions] = await Promise.all([
        getBusinessDetails(businessId, fundRequestData.ownerId),
        getTransactionsForFundRequest(id),
    ]);

    if (!businessDetails.name || !businessDetails.owner) {
        console.error(`Incomplete business details for businessId: ${businessId}`);
        return null;
    }

    const loansRaised = transactions
        .filter(t => t.type === 'Loan')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const donationsRaised = transactions
        .filter(t => t.type === 'Donation')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
        id: fundRequestSnap.id,
        name: fundRequestData.businessName,
        fundingGoal: fundRequestData.funding_goal || 0,
        fundingRaised: fundRequestData.current_funding || 0,
        loansRaised,
        donationsRaised,
        ...businessDetails,
        businessId: businessId,
        description: businessDetails.description || 'No description available.',
        category: businessDetails.category || 'Uncategorized',
        location: businessDetails.location || 'No location set.',
        imageUrl: businessDetails.imageUrl || `https://picsum.photos/seed/${businessId}/800/600`,
        imageHint: businessDetails.imageHint || 'business',
        owner: businessDetails.owner,
        repaymentHistory: [],
        updates: businessDetails.updates || [],
    } as EnrichedFundingRequest;
}

export async function getTransactionsForFundRequest(fundRequestId: string): Promise<Transaction[]> {
    if (!fundRequestId) return [];
    const transactions: Transaction[] = [];
    const q = query(
        collection(db, 'FundRequests', fundRequestId, 'transactions')
    );
    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const contributorName = await getUserDisplayName(data.contributorId);
        
        transactions.push({
            id: docSnap.id,
            amount: data.amount,
            contributorId: data.contributorId,
            contributorName: contributorName,
            borrowerId: data.borrowerId,
            type: data.type,
            status: data.status,
            date: (data.date as Timestamp).toDate(),
            fundRequestId: fundRequestId,
        });
    }
    
    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}
