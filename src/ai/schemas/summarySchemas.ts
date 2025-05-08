/**
 * @fileOverview Zod schemas and TypeScript types for AI summary generation.
 *
 * - GenerateSummaryInputSchema - Zod schema for the input of the summary generation.
 * - GenerateSummaryInput - TypeScript type inferred from GenerateSummaryInputSchema.
 * - GenerateSummaryOutputSchema - Zod schema for the output of the summary generation.
 * - GenerateSummaryOutput - TypeScript type inferred from GenerateSummaryOutputSchema.
 */

import { z } from 'zod';

export const GenerateSummaryInputSchema = z.object({
  fullName: z.string().optional().describe("The user's full name."),
  currentSummary: z.string().optional().describe("The user's current resume summary, if any, to be improved or used as context."),
  topSkills: z.array(z.string()).optional().describe("A list of the user's most relevant skills (e.g., ['JavaScript', 'Project Management', 'Data Analysis'])."),
  experienceSnippets: z.array(z.string()).optional().describe("Brief highlights, achievements, or key responsibilities from the user's work experience (e.g., ['Led a team of 5 engineers', 'Increased sales by 15%'])."),
  targetRole: z.string().optional().describe("The specific job role or industry the user is targeting (e.g., 'Senior Software Engineer', 'Marketing Manager')."),
  tone: z.enum(['professional', 'creative', 'concise', 'results-oriented', 'dynamic']).default('professional').optional().describe("The desired tone for the summary."),
  lengthPreference: z.enum(['short', 'medium', 'long']).default('medium').optional().describe("Preferred length of the summary: short (1-2 sentences), medium (2-3 sentences), long (3-4 sentences)."),
});
export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

export const GenerateSummaryOutputSchema = z.object({
  generatedSummary: z.string().describe('A compelling and professionally written resume summary.'),
});
export type GenerateSummaryOutput = z.infer<typeof GenerateSummaryOutputSchema>;
