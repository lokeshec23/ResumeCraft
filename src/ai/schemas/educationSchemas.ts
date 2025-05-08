/**
 * @fileOverview Zod schemas and TypeScript types for AI education description generation.
 *
 * - GenerateEducationDescriptionInputSchema - Zod schema for the input.
 * - GenerateEducationDescriptionInput - TypeScript type inferred from the input schema.
 * - GenerateEducationDescriptionOutputSchema - Zod schema for the output.
 * - GenerateEducationDescriptionOutput - TypeScript type inferred from the output schema.
 */

import { z } from 'zod';

export const GenerateEducationDescriptionInputSchema = z.object({
  institution: z.string().describe("The name of the educational institution."),
  degree: z.string().describe("The degree obtained or being pursued."),
  fieldOfStudy: z.string().optional().describe("The field of study, if applicable."),
  currentDescription: z.string().optional().describe("The current description, if any, to be improved or used as context."),
  tone: z.enum(['professional', 'academic', 'concise', 'detailed']).default('professional').optional().describe("The desired tone for the description."),
  length: z.enum(['short', 'medium', 'long']).default('medium').optional().describe("Preferred length of the description: short (1 sentence), medium (1-2 sentences), long (2-3 sentences)."),
  focusPoints: z.array(z.string()).optional().describe("Specific achievements, coursework, or honors to highlight."),
});

export type GenerateEducationDescriptionInput = z.infer<typeof GenerateEducationDescriptionInputSchema>;

export const GenerateEducationDescriptionOutputSchema = z.object({
  generatedDescription: z.string().describe('A compelling and professionally written education description.'),
});

export type GenerateEducationDescriptionOutput = z.infer<typeof GenerateEducationDescriptionOutputSchema>;
