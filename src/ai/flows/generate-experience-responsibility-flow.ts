'use server';
/**
 * @fileOverview A Genkit flow for generating experience responsibilities for a resume.
 *
 * - generateExperienceResponsibility - A function that calls the AI flow.
 * - GenerateResponsibilityInput - The input type for the function.
 * - GenerateResponsibilityOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateResponsibilityInputSchema,
  GenerateResponsibilityOutputSchema,
  type GenerateResponsibilityInput,
  type GenerateResponsibilityOutput,
} from '@/ai/schemas/experienceSchemas';

export type { GenerateResponsibilityInput, GenerateResponsibilityOutput };

const responsibilityPrompt = ai.definePrompt({
  name: 'responsibilityPrompt',
  input: {schema: GenerateResponsibilityInputSchema},
  output: {schema: GenerateResponsibilityOutputSchema},
  prompt: `You are an expert resume writer. Your task is to generate compelling responsibility bullet points for a work experience entry.

Job Title: {{{jobTitle}}}
Company: {{{company}}}

{{#if existingResponsibilities.length}}
Consider these existing responsibilities for context or inspiration:
{{#each existingResponsibilities}}
- {{{this}}}
{{/each}}
{{/if}}

{{#if skillsToHighlight.length}}
Try to incorporate or highlight these skills/keywords:
{{#each skillsToHighlight}}
- {{{this}}}
{{/each}}
{{/if}}

Desired tone: {{{tone}}}
Number of bullet points to generate: {{{quantity}}}

Instructions:
1. Generate {{{quantity}}} distinct responsibility bullet points.
2. Start each bullet point with a strong action verb.
3. Quantify achievements whenever possible (e.g., "Increased sales by 15%," "Managed a team of 5").
4. Tailor the responsibilities to the job title and company context if inferable.
5. Ensure each bullet point is concise, impactful, and professionally written.
6. Avoid generic phrases. Be specific.
7. Adhere to the specified tone.
8. Output a list of strings, where each string is one bullet point.

Generate the responsibility bullet points:
`,
});

const generateExperienceResponsibilityFlow = ai.defineFlow(
  {
    name: 'generateExperienceResponsibilityFlow',
    inputSchema: GenerateResponsibilityInputSchema,
    outputSchema: GenerateResponsibilityOutputSchema,
  },
  async (input) => {
    const {output} = await responsibilityPrompt(input);
    if (!output || !output.generatedResponsibilities || output.generatedResponsibilities.length === 0) {
      throw new Error('Failed to generate responsibilities. The AI model did not return valid output.');
    }
    return output;
  }
);

export async function generateExperienceResponsibility(input: GenerateResponsibilityInput): Promise<GenerateResponsibilityOutput> {
  return generateExperienceResponsibilityFlow(input);
}
