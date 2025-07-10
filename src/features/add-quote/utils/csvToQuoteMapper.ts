import type { QuoteFormValues } from '@/utils/formSchemas';

/**
 * Map CSV row data to QuoteFormValues structure
 */
export function mapCsvRowToQuote(headers: string[], row: string[]): Partial<QuoteFormValues> {
  const quoteData: Partial<QuoteFormValues> = {
    text: '',
    author: '',
    topics: [],
    keywords: [],
    originalSource: {
      title: '',
      publisher: '',
      publicationDate: '',
      location: '',
      isbn: '',
      sourceUrl: ''
    },
    translations: []
  };

  headers.forEach((header, index) => {
    if (index < row.length && row[index]) {
      const value = row[index];
      
      switch (header) {
        case 'topics':
        case 'keywords':
          quoteData[header] = value.split(';').map(item => item.trim()).filter(Boolean);
          break;
        case 'date':
          quoteData.date = value;
          break;
        case 'theme':
          quoteData.theme = value;
          break;
        case 'source':
          quoteData.source = value;
          break;
        case 'sourceUrl':
          quoteData.sourceUrl = value;
          break;
        case 'sourcePublicationDate':
          quoteData.sourcePublicationDate = value;
          break;
        case 'originalLanguage':
          quoteData.originalLanguage = value;
          break;
        case 'originalText':
          quoteData.originalText = value;
          break;
        case 'context':
          quoteData.context = value;
          break;
        case 'historicalContext':
          quoteData.historicalContext = value;
          break;
        case 'emotionalTone':
          quoteData.emotionalTone = value;
          break;
        case 'originalSourceTitle':
          if (!quoteData.originalSource) quoteData.originalSource = {};
          quoteData.originalSource.title = value;
          break;
        case 'originalSourcePublisher':
          if (!quoteData.originalSource) quoteData.originalSource = {};
          quoteData.originalSource.publisher = value;
          break;
        case 'originalSourcePublicationDate':
          if (!quoteData.originalSource) quoteData.originalSource = {};
          quoteData.originalSource.publicationDate = value;
          break;
        case 'originalSourceLocation':
          if (!quoteData.originalSource) quoteData.originalSource = {};
          quoteData.originalSource.location = value;
          break;
        case 'originalSourceIsbn':
          if (!quoteData.originalSource) quoteData.originalSource = {};
          quoteData.originalSource.isbn = value;
          break;
        case 'originalSourceUrl':
          if (!quoteData.originalSource) quoteData.originalSource = {};
          quoteData.originalSource.sourceUrl = value;
          break;
        case 'translationLanguage':
        case 'translationText':
        case 'translationSource':
        case 'translator':
        case 'translationPublication':
        case 'translationPublicationDate':
        case 'translationSourceUrl':
          // Handle translations
          if (!quoteData.translations) quoteData.translations = [];
          if (quoteData.translations.length === 0) {
            quoteData.translations.push({
              language: '',
              text: '',
              source: '',
              translator: '',
              publication: '',
              publicationDate: '',
              sourceUrl: ''
            });
          }
          
          const translationField = header.replace('translation', '').toLowerCase();
          const mappedField = translationField === 'publicationdate' ? 'publicationDate' : 
                             translationField === 'sourceurl' ? 'sourceUrl' : translationField;
          
          if (quoteData.translations[0] && mappedField in quoteData.translations[0]) {
            (quoteData.translations[0] as any)[mappedField] = value;
          }
          break;
        default:
          if (header in quoteData && typeof quoteData[header as keyof QuoteFormValues] === 'string') {
            (quoteData as any)[header] = value;
          }
          break;
      }
    }
  });

  return cleanupQuoteData(quoteData);
}

/**
 * Clean up empty nested objects in quote data
 */
function cleanupQuoteData(quoteData: Partial<QuoteFormValues>): Partial<QuoteFormValues> {
  // Clean up empty originalSource
  if (quoteData.originalSource && !Object.values(quoteData.originalSource).some(v => v)) {
    quoteData.originalSource = undefined;
  }
  
  // Clean up empty translations
  if (quoteData.translations && (!quoteData.translations[0] || !Object.values(quoteData.translations[0]).some(v => v))) {
    quoteData.translations = [];
  }
  
  return quoteData;
}

/**
 * Convert multiple CSV rows to valid quotes
 */
export function convertCsvToQuotes(headers: string[], rows: string[][]): QuoteFormValues[] {
  const quotes: QuoteFormValues[] = [];
  
  for (const row of rows) {
    if (row.length < 2) continue; // Skip empty rows
    
    const quoteData = mapCsvRowToQuote(headers, row);
    
    // Validate required fields
    if (quoteData.text && quoteData.author) {
      quotes.push(quoteData as QuoteFormValues);
    }
  }

  return quotes;
}