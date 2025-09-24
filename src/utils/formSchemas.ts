
import { z } from "zod";
import type { SourceType } from "./sourceTypeFields";

// Source information schema
const sourceInfoSchema = z.object({
  source_type: z.enum([
    'book', 'journal_article', 'newspaper', 'magazine', 'website', 'speech',
    'interview', 'letter', 'diary', 'manuscript', 'documentary', 'podcast',
    'social_media', 'government_document', 'legal_document', 'academic_thesis',
    'conference_paper', 'other'
  ] as const),
  title: z.string().optional(),
  author: z.string().optional(),
  publication_date: z.string().optional(),
  publisher: z.string().optional(),
  
  // Location fields (dynamic based on source_type)
  page_number: z.string().optional(),
  page_range: z.string().optional(),
  chapter_number: z.string().optional(),
  chapter_title: z.string().optional(),
  section_title: z.string().optional(),
  verse_reference: z.string().optional(),
  line_number: z.string().optional(),
  paragraph_number: z.string().optional(),
  timestamp_start: z.string().optional(),
  timestamp_end: z.string().optional(),
  minute_mark: z.string().optional(),
  act_scene: z.string().optional(),
  stanza_number: z.string().optional(),
  
  // Publication details
  volume_number: z.string().optional(),
  issue_number: z.string().optional(),
  edition: z.string().optional(),
  series_title: z.string().optional(),
  journal_name: z.string().optional(),
  newspaper_name: z.string().optional(),
  magazine_name: z.string().optional(),
  
  // Identifiers
  isbn: z.string().optional(),
  issn: z.string().optional(),
  doi: z.string().optional(),
  pmid: z.string().optional(),
  arxiv_id: z.string().optional(),
  
  // URLs
  primary_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  publisher_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  doi_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  isbn_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  amazon_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  google_books_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  jstor_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  pubmed_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  arxiv_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  youtube_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  spotify_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  
  // Additional metadata
  language: z.string().optional(),
  translation_info: z.string().optional(),
  archive_location: z.string().optional(),
  call_number: z.string().optional(),
  collection_name: z.string().optional(),
  confidence_score: z.number().min(0).max(1).optional(),
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
  context: z.string().optional(),
  historicalContext: z.string().optional(),
  topics: z.array(z.string()).optional(),
  theme: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  originalLanguage: z.string().optional(),
  originalText: z.string().optional(),
  emotionalTone: z.string().optional(),
  translations: z.array(translationSchema).optional(),
  sourceInfo: sourceInfoSchema.optional(),
});

// Batch quote submission schema
export const batchQuoteSchema = z.object({
  quotes: z.array(quoteSchema).min(1, "At least one quote is required").max(50, "Maximum 50 quotes per batch"),
  shared_source_info: sourceInfoSchema.optional(), // Shared source info for all quotes in batch
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
export type SourceInfoFormValues = z.infer<typeof sourceInfoSchema>;
export type BatchQuoteFormValues = z.infer<typeof batchQuoteSchema>;
