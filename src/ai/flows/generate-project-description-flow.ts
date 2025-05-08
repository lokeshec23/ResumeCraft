'use server';
/**
 * @fileOverview A Genkit flow for generating project descriptions for a resume.
 *
 * - generateProjectDescription - A function that calls the AI flow.
 * - GenerateProjectDescriptionInput - The input type for the function.
 * - GenerateProjectDescriptionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateProjectDescriptionInputSchema,
  GenerateProjectDescriptionOutputSchema,
  type GenerateProjectDescriptionInput,
  type GenerateProjectDescriptionOutput,
} from '@/ai/schemas/projectSchemas';

export type { GenerateProjectDescriptionInput, GenerateProjectDescriptionOutput };

const projectDescriptionPrompt = ai.definePrompt({
  name: 'projectDescriptionPrompt',
  input: {schema: GenerateProjectDescriptionInputSchema},
  output: {schema: GenerateProjectDescriptionOutputSchema},
  prompt: `You are an expert resume writer. Your task is to craft a compelling description for a project entry on a resume.

Project Name: {{{projectName}}}

{{#if currentDescription}}
The user has provided an existing description to improve or use as context: "{{currentDescription}}"
{{/if}}

{{#if technologiesUsed.length}}
Technologies Used: {{#each technologiesUsed}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

{{#if projectGoal}}Project Goal: {{{projectGoal}}}{{/if}}
{{#if myRole}}My Role/Contributions: {{{myRole}}}{{/if}}

Desired tone: {{{tone}}}
Desired length: {{{length}}} (short: 1-2 sentences, medium: 2-3 sentences, long: 3-4 sentences)

Instructions:
1. Create a description that highlights the project's purpose, your key contributions, and the impact or outcome if known.
2. Incorporate the technologies used naturally within the description or as a key highlight.
3. If 'currentDescription' is provided, refine it or generate a new one based on other inputs, aiming for significant improvement.
4. Adhere to the specified tone and length.
5. The description should be well-written, grammatically correct, and professional.
6. Start directly with the description content. Do not add any preambles.

Generate the project description:
`,
});

const generateProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionFlow',
    inputSchema: GenerateProjectDescriptionInputSchema,
    outputSchema: GenerateProjectDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await projectDescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate project description. The AI model did not return an output.');
    }
    return output;
  }
);

export async function generateProjectDescription(input: GenerateProjectDescriptionInput): Promise<GenerateProjectDescriptionOutput> {
  return generateProjectDescriptionFlow(input);
}
