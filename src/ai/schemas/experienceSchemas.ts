/**
 * @fileOverview Zod schemas and TypeScript types for AI experience responsibility generation.
 *
 * - GenerateResponsibilityInputSchema - Zod schema for the input.
 * - GenerateResponsibilityInput - TypeScript type inferred from the input schema.
 * - GenerateResponsibilityOutputSchema - Zod schema for the output.
 * - GenerateResponsibilityOutput - TypeScript type inferred from the output schema.
 */

import { z } from 'zod';

export const GenerateResponsibilityInputSchema = z.object({
  jobTitle: z.string().describe("The job title for the experience entry."),
  company: z.string().describe("The company name for the experience entry."),
  existingResponsibilities: z.array(z.string()).optional().describe("List of existing responsibilities to build upon or get inspiration from."),
  skillsToHighlight: z.array(z.string()).optional().describe("Specific skills or keywords to incorporate into the responsibilities."),
  tone: z.enum(['action-oriented', 'results-focused', 'technical', 'collaborative', 'leadership']).default('action-oriented').optional().describe("The desired tone for the responsibilities."),
  quantity: z.number().min(1).max(5).default(1).optional().describe("Number of responsibility bullet points to generate (1-5)."),
});

export type GenerateResponsibilityInput = z.infer<typeof GenerateResponsibilityInputSchema>;

export const GenerateResponsibilityOutputSchema = z.object({
  generatedResponsibilities: z.array(z.string()).describe('A list of compelling and professionally written responsibilities.'),
});

export type GenerateResponsibilityOutput = z.infer<typeof GenerateResponsibilityOutputSchema>;
