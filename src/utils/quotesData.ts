
export interface Quote {
  id: string,
  text: string,
  author: string,
  date: string,
  topics: string[],
  theme: string,
  source?: string,
  evidenceImage?: string,
  sourceUrl?: string,
  sourcePublicationDate?: string,
  originalLanguage?: string,
  originalText?: string,
  context?: string,
  historicalContext?: string,
  keywords?: string[],
  emotionalTone?: string,
  exportFormats?: {
    json?: boolean,
    csv?: boolean,
    cff?: boolean
  },
  shareCount?: number,
  variations?: any[],
  crossReferencedQuotes?: any[],
  ocrExtractedText?: string,
  ocrConfidenceScore?: number,
  originalManuscriptReference?: string,
  attributionStatus?: string,
  translator?: string,
  impact?: string,
  citationAPA?: string,
  citationMLA?: string,
  citationChicago?: string,
  citedBy?: {
    siteName: string,
    siteUrl: string,
    embedDate: string
  }[],
  originalSource?: {
    title: string;
    publisher: string;
    publicationDate: string;
    location: string;
    isbn: string;
    sourceUrl: string;
  };
  translations?: Array<{
    language: string;
    text: string;
    source?: string;
    translator?: string;
    publication?: string;
    publicationDate?: string;
    sourceUrl?: string;
    translationType?: 'human' | 'ai' | 'machine';
    translatorType?: 'human' | 'ai' | 'community';
    confidenceScore?: number;
    verified?: boolean;
    qualityRating?: number;
    aiModel?: string;
  }> | {
    fr?: {
      text: string;
      source?: string;
      translationType?: 'human' | 'ai' | 'machine';
      translatorType?: 'human' | 'ai' | 'community';
      verified?: boolean;
    }
  };
}

// This array is kept for fallback purposes
export const quotes: Quote[] = [];
