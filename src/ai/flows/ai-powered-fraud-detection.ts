'use server';
/**
 * @fileOverview Implements an AI-powered fraud detection system to monitor user actions,
 * funding requests, and transactions, flagging potentially fraudulent activities.
 *
 * - aiPoweredFraudDetection - A function that initiates the fraud detection process.
 * - AiPoweredFraudDetectionInput - The input type for the aiPoweredFraudDetection function.
 * - AiPoweredFraudDetectionOutput - The return type for the aiPoweredFraudDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredFraudDetectionInputSchema = z.object({
  userActions: z.string().describe('A log of recent user actions on the platform.'),
  fundingRequests: z.string().describe('Details of recent funding requests submitted by users.'),
  transactions: z.string().describe('A record of recent transactions on the platform.'),
});
export type AiPoweredFraudDetectionInput = z.infer<typeof AiPoweredFraudDetectionInputSchema>;

const AiPoweredFraudDetectionOutputSchema = z.object({
  flaggedActivities: z
    .string()
    .describe(
      'A summary of potentially fraudulent activities identified, with reasons for flagging them.'
    ),
});
export type AiPoweredFraudDetectionOutput = z.infer<typeof AiPoweredFraudDetectionOutputSchema>;

export async function aiPoweredFraudDetection(input: AiPoweredFraudDetectionInput): Promise<AiPoweredFraudDetectionOutput> {
  return aiPoweredFraudDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredFraudDetectionPrompt',
  input: {schema: AiPoweredFraudDetectionInputSchema},
  output: {schema: AiPoweredFraudDetectionOutputSchema},
  prompt: `You are an AI-powered fraud detection system for the Barakah Ledger platform.

You will receive logs of user actions, funding requests, and transactions.
Your task is to analyze these logs and identify potentially fraudulent activities based on predefined heuristics.

User Actions: {{{userActions}}}
Funding Requests: {{{fundingRequests}}}
Transactions: {{{transactions}}}

Provide a summary of potentially fraudulent activities identified, with clear reasons for flagging them. Focus on suspicious patterns, anomalies, and deviations from normal behavior. Return an empty summary if no fraud detected.
`,
});

const aiPoweredFraudDetectionFlow = ai.defineFlow(
  {
    name: 'aiPoweredFraudDetectionFlow',
    inputSchema: AiPoweredFraudDetectionInputSchema,
    outputSchema: AiPoweredFraudDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
