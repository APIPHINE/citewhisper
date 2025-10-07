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
    sourceInfo: {
      source_type: 'other',
      title: '',
      publisher: '',
      publication_date: ''
    },
    translations: []
  };

  headers.forEach((header, index) => {
    if (index < row.length && row[index]) {
      const value = row[index];
      
      switch (header) {
        case 'text':
          quoteData.text = value;
          break;
        case 'author':
          quoteData.author = value;
          break;
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
        case 'sourceTitle':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.title = value;
          break;
        case 'sourceUrl':
        case 'primaryUrl':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.primary_url = value;
          break;
        case 'sourcePublicationDate':
        case 'publicationDate':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.publication_date = value;
          break;
        case 'originalLanguage':
          quoteData.originalLanguage = value;
          if (quoteData.sourceInfo) {
            quoteData.sourceInfo.language = value;
          }
          break;
        case 'originalText':
          quoteData.originalText = value;
          break;
        case 'originalSourceTitle':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.title = value;
          break;
        case 'originalSourcePublisher':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.publisher = value;
          break;
        case 'originalSourcePublicationDate':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.publication_date = value;
          break;
        case 'originalSourceLocation':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.archive_location = value;
          break;
        case 'originalSourceIsbn':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.isbn = value;
          break;
        case 'originalSourceUrl':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.backup_url = value;
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
        case 'publisher':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.publisher = value;
          break;
        case 'isbn':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.isbn = value;
          break;
        case 'doi':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.doi = value;
          break;
        case 'pageNumber':
        case 'page':
          if (!quoteData.sourceInfo) quoteData.sourceInfo = { source_type: 'other' };
          quoteData.sourceInfo.page_number = value;
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
  // Clean up empty sourceInfo
  if (quoteData.sourceInfo) {
    const hasValues = Object.entries(quoteData.sourceInfo)
      .filter(([key]) => key !== 'source_type')
      .some(([, value]) => value);
    if (!hasValues) {
      quoteData.sourceInfo = undefined;
    }
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