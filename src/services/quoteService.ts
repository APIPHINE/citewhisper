
// Export the refactored services from a unified interface
import { fetchQuotes } from './quotesApi/fetchQuotes';
import { uploadEvidenceImage } from './quotesApi/uploadEvidence';
import { createQuote } from './quotesApi/createQuote';
import { incrementShareCount } from './quotesApi/shareCount';

// Re-export all services
export {
  fetchQuotes,
  uploadEvidenceImage,
  createQuote,
  incrementShareCount
};
