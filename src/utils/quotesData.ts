
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
  citationAPA?: string,
  citationMLA?: string,
  citationChicago?: string,
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
  }> | {
    fr?: {
      text: string;
      source?: string;
    }
  };
}

// This array is kept for fallback purposes
export const quotes: Quote[] = [];
