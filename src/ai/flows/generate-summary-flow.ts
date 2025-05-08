
'use server';
/**
 * @fileOverview A Genkit flow for generating professional resume summaries.
 *
 * - generateResumeSummary - A function that calls the AI flow to generate a summary.
 * - GenerateSummaryInput - The input type for the generateResumeSummary function.
 * - GenerateSummaryOutput - The return type for the generateResumeSummary function.
 */

import {ai} from '@/ai/genkit';
import { 
  GenerateSummaryInputSchema, 
  GenerateSummaryOutputSchema,
  type GenerateSummaryInput,
  type GenerateSummaryOutput 
} from '@/ai/schemas/summarySchemas';

// Re-export types for the flow's public API
export type { GenerateSummaryInput, GenerateSummaryOutput };

const generateSummaryPrompt = ai.definePrompt({
  name: 'generateSummaryPrompt',
  input: {schema: GenerateSummaryInputSchema},
  output: {schema: GenerateSummaryOutputSchema},
  prompt: `You are an expert resume writer. Your task is to generate a compelling professional summary for a resume.

Consider the following user inputs:
{{#if fullName}}Full Name: {{{fullName}}}{{/if}}
{{#if currentSummary}}Current Summary (for reference or improvement): {{{currentSummary}}}{{/if}}
{{#if topSkills}}Key Skills: {{#each topSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{#if experienceSnippets}}Experience Highlights:
{{#each experienceSnippets}}- {{{this}}}
{{/each}}{{/if}}
{{#if targetRole}}Target Role/Industry: {{{targetRole}}}{{/if}}
Desired Tone: {{{tone}}}
Desired Length: {{{lengthPreference}}} (short: 1-2 sentences, medium: 2-3 sentences, long: 3-4 sentences)

Instructions:
1. Craft a summary that is impactful and tailored to the provided information.
2. If a target role is specified, align the summary to highlight suitability for that role.
3. Incorporate key skills and experience highlights naturally.
4. Adhere to the specified tone and length.
5. If 'currentSummary' is provided, you can choose to refine it or generate a new one based on other inputs, aiming for significant improvement or alignment with other parameters like target role or tone.
6. The summary should be well-written, grammatically correct, and professional. Avoid jargon unless relevant to the target role and explained by context.
7. Start directly with the summary content. Do not add any preambles like "Here's a summary for you:".

Generate the resume summary:
`,
});

const generateResumeSummaryFlow = ai.defineFlow(
  {
    name: 'generateResumeSummaryFlow',
    inputSchema: GenerateSummaryInputSchema,
    outputSchema: GenerateSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await generateSummaryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate summary. The AI model did not return an output.');
    }
    return output;
  }
);

export async function generateResumeSummary(input: GenerateSummaryInput): Promise<GenerateSummaryOutput> {
  return generateResumeSummaryFlow(input);
}
    
