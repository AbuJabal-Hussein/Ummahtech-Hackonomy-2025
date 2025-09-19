'use server';

import { getContributionGuidance } from '@/ai/flows/community-goal-guidance';

type ContributionGuidance = {
    guidance: string;
};

export async function fetchGuidance(goal: string, progress: number, activities: string[]): Promise<ContributionGuidance> {
    return await getContributionGuidance({
        goalDescription: goal,
        progressPercentage: progress,
        recentActivities: activities,
    });
}
