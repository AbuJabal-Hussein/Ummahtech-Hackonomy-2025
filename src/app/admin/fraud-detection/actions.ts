'use server';

import { aiPoweredFraudDetection } from '@/ai/flows/ai-powered-fraud-detection';

type FraudDetectionResult = {
    flaggedActivities: string;
}

export async function fetchFraudAnalysis(userActions: string, fundingRequests: string, transactions: string): Promise<FraudDetectionResult> {
    return await aiPoweredFraudDetection({
        userActions,
        fundingRequests,
        transactions,
    });
}
