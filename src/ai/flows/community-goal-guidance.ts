'use server';

/**
 * @fileOverview Provides AI-powered suggestions on how to contribute effectively to community goals.
 *
 * - getContributionGuidance - A function that returns contribution guidance for a community goal.
 * - ContributionGuidanceInput - The input type for the getContributionGuidance function.
 * - ContributionGuidanceOutput - The return type for the getContributionGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContributionGuidanceInputSchema = z.object({
  goalDescription: z
    .string()
    .describe('The description of the community goal.'),
  progressPercentage: z
    .number()
    .describe('The current progress towards the goal as a percentage (0-100).'),
  recentActivities: z
    .array(z.string())
    .describe(
      'A list of recent activities related to the community goal. This should contain at least 3 items.'
    ),
});
export type ContributionGuidanceInput = z.infer<
  typeof ContributionGuidanceInputSchema
>;

const ContributionGuidanceOutputSchema = z.object({
  guidance: z.string().describe('AI-powered suggestions on how to contribute effectively.'),
});
export type ContributionGuidanceOutput = z.infer<
  typeof ContributionGuidanceOutputSchema
>;

export async function getContributionGuidance(
  input: ContributionGuidanceInput
): Promise<ContributionGuidanceOutput> {
  return communityGoalGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communityGoalGuidancePrompt',
  input: {schema: ContributionGuidanceInputSchema},
  output: {schema: ContributionGuidanceOutputSchema},
  prompt: `You are a community engagement expert. Provide suggestions on how users can contribute effectively to the community goal described below, given the current progress and recent activities.

Goal Description: {{{goalDescription}}}
Progress: {{{progressPercentage}}}%
Recent Activities:
{{#each recentActivities}}- {{{this}}}\n{{/each}}

Suggestions:
`,
});

const communityGoalGuidanceFlow = ai.defineFlow(
  {
    name: 'communityGoalGuidanceFlow',
    inputSchema: ContributionGuidanceInputSchema,
    outputSchema: ContributionGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
