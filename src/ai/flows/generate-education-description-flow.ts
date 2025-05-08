'use server';
/**
 * @fileOverview A Genkit flow for generating education descriptions for a resume.
 *
 * - generateEducationDescription - A function that calls the AI flow.
 * - GenerateEducationDescriptionInput - The input type for the function.
 * - GenerateEducationDescriptionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateEducationDescriptionInputSchema,
  GenerateEducationDescriptionOutputSchema,
  type GenerateEducationDescriptionInput,
  type GenerateEducationDescriptionOutput,
} from '@/ai/schemas/educationSchemas';

export type { GenerateEducationDescriptionInput, GenerateEducationDescriptionOutput };

const educationDescriptionPrompt = ai.definePrompt({
  name: 'educationDescriptionPrompt',
  input: {schema: GenerateEducationDescriptionInputSchema},
  output: {schema: GenerateEducationDescriptionOutputSchema},
  prompt: `You are an expert resume writer. Your task is to craft a compelling description for an education entry on a resume.

Institution: {{{institution}}}
Degree: {{{degree}}}
{{#if fieldOfStudy}}Field of Study: {{{fieldOfStudy}}}{{/if}}

{{#if currentDescription}}
The user has provided an existing description to improve or use as context: "{{currentDescription}}"
{{/if}}

{{#if focusPoints}}
Please emphasize the following points if relevant:
{{#each focusPoints}}
- {{{this}}}
{{/each}}
{{/if}}

Desired tone: {{{tone}}}
Desired length: {{{length}}} (short: 1 sentence, medium: 1-2 sentences, long: 2-3 sentences)

Instructions:
1. Create a description that highlights key achievements, relevant coursework, honors, or GPA (if noteworthy and positive).
2. If 'currentDescription' is provided, refine it or generate a new one based on other inputs, aiming for significant improvement.
3. Adhere to the specified tone and length.
4. The description should be well-written, grammatically correct, and professional.
5. Start directly with the description content. Do not add any preambles.

Generate the education description:
`,
});

const generateEducationDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEducationDescriptionFlow',
    inputSchema: GenerateEducationDescriptionInputSchema,
    outputSchema: GenerateEducationDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await educationDescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate education description. The AI model did not return an output.');
    }
    return output;
  }
);

export async function generateEducationDescription(input: GenerateEducationDescriptionInput): Promise<GenerateEducationDescriptionOutput> {
  return generateEducationDescriptionFlow(input);
}
