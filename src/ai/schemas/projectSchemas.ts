/**
 * @fileOverview Zod schemas and TypeScript types for AI project description generation.
 *
 * - GenerateProjectDescriptionInputSchema - Zod schema for the input.
 * - GenerateProjectDescriptionInput - TypeScript type inferred from the input schema.
 * - GenerateProjectDescriptionOutputSchema - Zod schema for the output.
 * - GenerateProjectDescriptionOutput - TypeScript type inferred from the output schema.
 */

import { z } from 'zod';

export const GenerateProjectDescriptionInputSchema = z.object({
  projectName: z.string().describe("The name of the project."),
  currentDescription: z.string().optional().describe("The current description, if any, to be improved or used as context."),
  technologiesUsed: z.array(z.string()).optional().describe("A list of technologies, tools, or languages used in the project."),
  projectGoal: z.string().optional().describe("The main goal or purpose of the project."),
  myRole: z.string().optional().describe("Your role or key contributions to the project."),
  tone: z.enum(['technical', 'impact-focused', 'concise', 'creative']).default('impact-focused').optional().describe("The desired tone for the description."),
  length: z.enum(['short', 'medium', 'long']).default('medium').optional().describe("Preferred length: short (1-2 sentences), medium (2-3 sentences), long (3-4 sentences)."),
});

export type GenerateProjectDescriptionInput = z.infer<typeof GenerateProjectDescriptionInputSchema>;

export const GenerateProjectDescriptionOutputSchema = z.object({
  generatedDescription: z.string().describe('A compelling and professionally written project description.'),
});

export type GenerateProjectDescriptionOutput = z.infer<typeof GenerateProjectDescriptionOutputSchema>;
