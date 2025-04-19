
import { z } from "zod";

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
  context: z.string().optional(),
  historicalContext: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  citationAPA: z.string().optional(),
  citationMLA: z.string().optional(),
  citationChicago: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
