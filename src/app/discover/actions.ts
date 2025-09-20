'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';
import type { Business } from '@/lib/mock-data';

// A simplified version for the discover page card.
// In a real app you might want to create a more specific type.
export type EnrichedFundingRequest = Business;

async function getBusinessDetails(businessId: string, ownerId: string): Promise<Partial<Business>> {
    try {
        if (!businessId) {
            console.warn(`getBusinessDetails called with no businessId.`);
            return {};
        }
        const businessRef = doc(db, 'Businesses', businessId);
        const businessSnap = await getDoc(businessRef);

        if (!businessSnap.exists()) {
            console.warn(`Business with ID ${businessId} not found.`);
            return {};
        }

        const businessData = businessSnap.data();

        // In a real app, you would fetch owner details from a 'users' collection
        // For now, we'll use mock owner data.
        const owner = {
            name: businessData.ownerName || "Unknown Owner",
            avatarUrl: `https://picsum.photos/seed/${ownerId}/100/100`,
        };

        return {
            id: businessSnap.id,
            description: businessData.description || 'No description available.',
            category: businessData.category || 'Uncategorized',
            location: businessData.location || 'No location set.',
            imageUrl: businessData.imageUrl || `https://picsum.photos/seed/${businessSnap.id}/800/600`,
            imageHint: businessData.imageHint || "business photo",
            owner: owner,
            repaymentHistory: [], // Mock data, adjust as needed
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

    const businessDetails = await getBusinessDetails(businessId, fundRequestData.ownerId);

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
        owner: businessDetails.owner || { name: 'Unknown', avatarUrl: ''},
        repaymentHistory: businessDetails.repaymentHistory || [],
        updates: businessDetails.updates || [],
    } as EnrichedFundingRequest;
}