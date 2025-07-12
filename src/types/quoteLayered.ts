export interface CoreQuoteData {
  // Layer 1 - Essential Core Data
  id: string;
  text: string;
  author: string;
  date?: string; // Flexible: year, month/year, or full date
  primarySource?: string;
}

export interface EnhancedQuoteData extends CoreQuoteData {
  // Layer 2 - Enhanced Context Data
  context?: string;
  historicalContext?: string;
  originalLanguage?: string;
  originalText?: string;
  topics?: string[];
  theme?: string;
  keywords?: string[];
  emotionalTone?: string;
  evidenceImage?: string;
  sourceUrl?: string;
  sourcePublicationDate?: string;
  translations?: Array<{
    language: string;
    text: string;
    source?: string;
    translator?: string;
    publication?: string;
    publicationDate?: string;
    sourceUrl?: string;
  }> | {
    fr?: {
      text: string;
      source?: string;
    }
  };
}

export interface AdvancedQuoteData extends EnhancedQuoteData {
  // Layer 3 - Advanced Scholarly Data
  citationAPA?: string;
  citationMLA?: string;
  citationChicago?: string;
  crossReferencedQuotes?: any[];
  verificationStatus?: 'verified' | 'disputed' | 'unverified';
  ocrExtractedText?: string;
  ocrConfidenceScore?: number;
  originalManuscriptReference?: string;
  attributionStatus?: string;
  translator?: string;
  impact?: string;
  variations?: any[];
  citedBy?: {
    siteName: string;
    siteUrl: string;
    embedDate: string;
  }[];
  originalSource?: {
    title: string;
    publisher: string;
    publicationDate: string;
    location: string;
    isbn: string;
    sourceUrl: string;
  };
  exportFormats?: {
    json?: boolean;
    csv?: boolean;
    cff?: boolean;
  };
  shareCount?: number;
}

// Main Quote interface with all layers
export interface LayeredQuote extends AdvancedQuoteData {}

// Type guards to check data completeness
export function hasEnhancedData(quote: CoreQuoteData): quote is EnhancedQuoteData {
  return !!(quote as EnhancedQuoteData).context || 
         !!(quote as EnhancedQuoteData).historicalContext ||
         !!(quote as EnhancedQuoteData).originalLanguage ||
         !!(quote as EnhancedQuoteData).topics?.length;
}

export function hasAdvancedData(quote: EnhancedQuoteData): quote is AdvancedQuoteData {
  return !!(quote as AdvancedQuoteData).citationAPA ||
         !!(quote as AdvancedQuoteData).citationMLA ||
         !!(quote as AdvancedQuoteData).verificationStatus ||
         !!(quote as AdvancedQuoteData).ocrExtractedText;
}

export type QuoteDataLayer = 'core' | 'enhanced' | 'advanced';

export function getQuoteDataLayer(quote: CoreQuoteData): QuoteDataLayer {
  if (hasAdvancedData(quote as EnhancedQuoteData)) return 'advanced';
  if (hasEnhancedData(quote)) return 'enhanced';
  return 'core';
}