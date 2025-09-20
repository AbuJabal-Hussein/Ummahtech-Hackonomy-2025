'use server';

import { getContributionGuidance } from '@/ai/flows/community-goal-guidance';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query, where, Timestamp, doc, getDoc } from 'firebase/firestore';

type ContributionGuidance = {
    guidance: string;
};

export type Contributor = {
  name: string;
  avatarUrl: string;
  contribution: number;
};

export type CommunityGoalsData = {
  progress: number;
  target: number;
  contributors: Contributor[];
  recentActivities: string[];
};

// Helper function to get user display name
async function getUserDisplayName(userId: string): Promise<{ name: string, avatarUrl: string }> {
    if (!userId) return { name: 'Anonymous', avatarUrl: '' };
    try {
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            return {
                name: userData.displayName || 'Anonymous',
                avatarUrl: `https://picsum.photos/seed/${userId}/100/100`
            };
        }
        return { name: 'Anonymous', avatarUrl: '' };
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return { name: 'Anonymous', avatarUrl: '' };
    }
}


export async function getCommunityGoalsData(): Promise<CommunityGoalsData> {
    const thirtyDaysAgo = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    // 1. Get Progress: Count funded businesses in the last 30 days
    const fundedRequestsQuery = query(
        collection(db, 'FundRequests'),
        where('status', '==', 'Funded'),
        where('createdAt', '>=', thirtyDaysAgo) 
    );
    const fundedSnapshot = await getDocs(fundedRequestsQuery);
    const progress = fundedSnapshot.size;
    const target = 5; // The goal is static for now

    // 2. Get Top Contributors & Recent Activities
    const transactionsQuery = query(
        collection(db, 'transactions'),
        where('date', '>=', thirtyDaysAgo),
        orderBy('date', 'desc')
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);

    const contributorMap: Record<string, { id: string, name: string; avatarUrl: string; contribution: number }> = {};
    const recentActivities: string[] = [];
    
    for (const docSnap of transactionsSnapshot.docs) {
        const data = docSnap.data();
        const amount = Number(data.amount) || 0;
        const contributorId = data.contributorId;

        if (contributorMap[contributorId]) {
            contributorMap[contributorId].contribution += amount;
        } else {
            const { name, avatarUrl } = await getUserDisplayName(contributorId);
            contributorMap[contributorId] = { id: contributorId, name, avatarUrl, contribution: amount };
        }

        // Populate recent activities (limit to 4)
        if (recentActivities.length < 4) {
             const parentRequestRef = docSnap.ref.parent.parent;
             if (parentRequestRef) {
                 const requestSnap = await getDoc(parentRequestRef);
                 if (requestSnap.exists()) {
                     recentActivities.push(`${contributorMap[contributorId].name} contributed $${amount} to ${requestSnap.data().businessName}.`);
                 }
             }
        }
    }
    
    const contributors = Object.values(contributorMap)
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 4);

    return { progress, target, contributors, recentActivities };
}

export async function fetchGuidance(goal: string, progress: number, activities: string[]): Promise<ContributionGuidance> {
    return await getContributionGuidance({
        goalDescription: goal,
        progressPercentage: progress,
        recentActivities: activities,
    });
}
