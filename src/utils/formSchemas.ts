
import { z } from "zod";

const originalSourceSchema = z.object({
  title: z.string().optional(),
  publisher: z.string().optional(),
  publicationDate: z.string().optional(),
  location: z.string().optional(),
  isbn: z.string().optional(),
  sourceUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

const translationSchema = z.object({
  language: z.string(),
  text: z.string(),
  source: z.string().optional(),
  translator: z.string().optional(),
  publication: z.string().optional(),
  publicationDate: z.string().optional(),
  sourceUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  translationType: z.enum(['human', 'ai', 'machine']).default('human'),
  translatorType: z.enum(['human', 'ai', 'community']).default('human'),
  confidenceScore: z.number().min(0).max(1).optional(),
  verified: z.boolean().default(false),
  qualityRating: z.number().min(1).max(5).optional(),
  aiModel: z.string().optional(),
});

export const quoteSchema = z.object({
  text: z.string().min(1, "Quote text is required"),
  author: z.string().min(1, "Author name is required"),
  date: z.string().optional(),
  topics: z.array(z.string()).optional(),
  theme: z.string().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  sourcePublicationDate: z.string().optional(),
  originalLanguage: z.string().optional(),
  originalText: z.string().optional(),
  originalSource: originalSourceSchema.optional(),
  context: z.string().optional(),
  historicalContext: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  translations: z.array(translationSchema).optional(),
  emotionalTone: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
