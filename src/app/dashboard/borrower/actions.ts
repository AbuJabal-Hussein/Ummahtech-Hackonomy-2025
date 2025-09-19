'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

export interface BusinessProfile {
    id: string;
    name: string;
    category: string;
    description: string;
    location: string;
    ownerId: string;
}

export interface FundingRequest {
    id: string;
    businessName: string;
    businessId: string;
    fundingGoal: number;
    raised: number;
    status: string;
}

export async function getBusinessProfiles(userId: string): Promise<BusinessProfile[]> {
    if (!userId) return [];
    const q = query(collection(db, "businesses"), where("ownerId", "==", userId));
    const querySnapshot = await getDocs(q);
    const profiles: BusinessProfile[] = [];
    querySnapshot.forEach((doc) => {
        profiles.push({ id: doc.id, ...doc.data() } as BusinessProfile);
    });
    return profiles;
}

export async function getFundingRequests(userId: string): Promise<FundingRequest[]> {
    if (!userId) return [];
    const q = query(collection(db, "fundRequests"), where("ownerId", "==", userId));
    const querySnapshot = await getDocs(q);
    const requests: FundingRequest[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
            id: doc.id,
            businessName: data.businessName,
            businessId: data.businessId,
            fundingGoal: data.fundingGoal,
            raised: data.raised || 0,
            status: data.status,
        } as FundingRequest);
    });
    return requests;
}

export async function createFundingRequest(requestData: {
    ownerId: string;
    businessId: string;
    businessName: string;
    fundingGoal: number;
    breakdown: string;
    deadline: Date;
}) {
    try {
        await addDoc(collection(db, 'fundRequests'), {
            ...requestData,
            deadline: Timestamp.fromDate(requestData.deadline),
            raised: 0,
            status: 'Pending',
            createdAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating funding request: ", error);
        return { success: false, error: "Failed to create funding request." };
    }
}
