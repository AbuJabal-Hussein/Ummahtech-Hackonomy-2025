
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, DocumentData, collectionGroup, query, where, Timestamp } from 'firebase/firestore';
import type { Business } from '@/lib/mock-data';
import type { Transaction } from '@/app/dashboard/borrower/actions';

// A simplified version for the discover page card.
// In a real app you might want to create a more specific type.
export type EnrichedFundingRequest = Business;

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

        // In a real app, you would fetch owner details from a 'users' collection
        // For now, we'll use mock owner data.
        const owner = {
            name: businessData.name || "Unknown Owner",
            avatarUrl: `https://picsum.photos/seed/${ownerId || businessId}/100/100`,
        };

        return {
            id: businessSnap.id,
            name: businessData.name,
            description: businessData.description || 'No description available.',
            category: businessData.category || 'Uncategorized',
            location: businessData.location || 'No location set.',
            imageUrl: businessData.imageUrl || `https://picsum.photos/seed/${businessSnap.id}/800/600`,
            imageHint: businessData.imageHint || "business photo",
            owner: owner,
            repaymentHistory: [], // This will be replaced by live transaction data
            updates: [], // Mock data, adjust as needed
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
            // From FundRequest
            id: fundRequestDoc.id, // Using fund request ID for the card key
            name: fundRequestData.businessName,
            fundingGoal: fundRequestData.funding_goal || 0,
            fundingRaised: fundRequestData.current_funding || 0,
            businessId: businessId, // Pass businessId along
            // From Business
            ...businessDetails,
            // Fallbacks for any missing business details
            description: businessDetails.description || 'No description available.',
            category: businessDetails.category || 'Uncategorized',
            location: businessDetails.location || 'No location set.',
            imageUrl: businessDetails.imageUrl || `https://picsum.photos/seed/${businessId}/800/600`,
            imageHint: businessDetails.imageHint || 'business',
            owner: businessDetails.owner || { name: 'Unknown', avatarUrl: ''},
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

    const businessDetails = await getBusinessDetails(businessId, fundRequestData.ownerId);

    // Ensure all required fields for 'Business' type are present
    if (!businessDetails.name || !businessDetails.owner) {
        console.error(`Incomplete business details for businessId: ${businessId}`);
        return null;
    }

    return {
        id: fundRequestSnap.id,
        name: fundRequestData.businessName,
        fundingGoal: fundRequestData.funding_goal || 0,
        fundingRaised: fundRequestData.current_funding || 0,
        businessId: businessId,
        ...businessDetails,
        description: businessDetails.description || 'No description available.',
        category: businessDetails.category || 'Uncategorized',
        location: businessDetails.location || 'No location set.',
        imageUrl: businessDetails.imageUrl || `https://picsum.photos/seed/${businessId}/800/600`,
        imageHint: businessDetails.imageHint || 'business',
        owner: businessDetails.owner, // Already checked for existence
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
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
            id: doc.id,
            amount: data.amount,
            contributorId: data.contributor_id,
            borrowerId: data.borrowerId,
            type: data.type,
            status: data.status,
            date: (data.date as Timestamp).toDate(),
            fundRequestId: fundRequestId,
        });
    });
    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}
