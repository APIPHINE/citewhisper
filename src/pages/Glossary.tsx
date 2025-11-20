import { motion } from 'framer-motion';
import { Book, Database, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Glossary = () => {
  const coreFields = [
    { name: 'text', description: 'The actual quote text (required)', required: true },
    { name: 'author', description: 'Name of the person who said/wrote the quote (required)', required: true },
    { name: 'date', description: 'Date when the quote was originally made (flexible format: year, month/year, or full date)', required: false },
    { name: 'context', description: 'Contextual information about when, where, or why the quote was made', required: false },
  ];

  const topicFields = [
    { name: 'topics', description: 'Main topics or themes of the quote (comma-separated)', required: false },
    { name: 'keywords', description: 'Searchable keywords related to the quote (comma-separated)', required: false },
    { name: 'theme', description: 'Overarching theme or category', required: false },
  ];

  const sourceFields = [
    { name: 'source_type', description: 'Type of source (book, journal_article, newspaper, magazine, website, speech, interview, letter, diary, manuscript, documentary, podcast, social_media, government_document, legal_document, academic_thesis, conference_paper, other)', required: false },
    { name: 'title', description: 'Title of the source document or publication', required: false },
    { name: 'author (source)', description: 'Author of the source material (may differ from quote author)', required: false },
    { name: 'publisher', description: 'Publishing organization or company', required: false },
    { name: 'publication_date', description: 'Date when the source was published', required: false },
    { name: 'primary_url', description: 'Main URL link to the source', required: false },
    { name: 'backup_url', description: 'Alternative URL (archive link, backup location)', required: false },
    { name: 'page_number', description: 'Specific page number(s) where quote appears', required: false },
    { name: 'language', description: 'Language of the source material', required: false },
    { name: 'doi', description: 'Digital Object Identifier for academic sources', required: false },
    { name: 'isbn', description: 'International Standard Book Number', required: false },
    { name: 'chapter_number', description: 'Chapter number in a book', required: false },
    { name: 'chapter_title', description: 'Title of the chapter', required: false },
    { name: 'volume_number', description: 'Volume number for journals or series', required: false },
    { name: 'issue_number', description: 'Issue number for periodicals', required: false },
    { name: 'edition', description: 'Edition of the publication', required: false },
  ];

  const translationFields = [
    { name: 'translation_language', description: 'Language code for the translation (e.g., fr, es, de)', required: false },
    { name: 'translation_text', description: 'Translated version of the quote', required: false },
    { name: 'translation_source', description: 'Source of the translation', required: false },
    { name: 'translator', description: 'Name of the person who translated the quote', required: false },
    { name: 'translation_publication', description: 'Publication where translation appeared', required: false },
    { name: 'translation_publication_date', description: 'Date of the translated publication', required: false },
    { name: 'translation_source_url', description: 'URL to the translation source', required: false },
  ];

  const advancedFields = [
    { name: 'original_language', description: 'Original language in which the quote was made', required: false },
    { name: 'original_text', description: 'Original text if the quote is a translation', required: false },
    { name: 'historical_context', description: 'Historical background or significance', required: false },
    { name: 'emotional_tone', description: 'Emotional quality of the quote (e.g., inspirational, somber, humorous)', required: false },
    { name: 'verification_status', description: 'Status of quote verification (verified, disputed, unverified)', required: false },
    { name: 'attribution_status', description: 'Confidence level in attribution to the author', required: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="page-padding pt-24 pb-16">
        <div className="page-max-width">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              CSV Column Glossary
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Complete reference guide for all metadata fields used in quote data capture, CSV import, and presentation
            </p>
          </motion.div>

          {/* Core Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-primary" />
                  <CardTitle>Core Required & Essential Fields</CardTitle>
                </div>
                <CardDescription>
                  Fundamental data points needed for every quote entry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coreFields.map((field, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-primary">
                          {field.name}
                        </code>
                        {field.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{field.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Topic Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle>Topic & Classification Fields</CardTitle>
                </div>
                <CardDescription>
                  Fields for organizing and categorizing quotes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topicFields.map((field, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-primary">
                        {field.name}
                      </code>
                      <p className="text-sm text-muted-foreground mt-2">{field.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Source Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Book className="h-6 w-6 text-primary" />
                  <CardTitle>Source Information Fields</CardTitle>
                </div>
                <CardDescription>
                  Detailed bibliographic and source reference data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sourceFields.map((field, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-primary">
                        {field.name}
                      </code>
                      <p className="text-sm text-muted-foreground mt-2">{field.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Translation Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Translation Fields</CardTitle>
                <CardDescription>
                  Fields for multilingual quote translations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {translationFields.map((field, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-primary">
                        {field.name}
                      </code>
                      <p className="text-sm text-muted-foreground mt-2">{field.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Advanced Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Advanced Scholarly Fields</CardTitle>
                <CardDescription>
                  Additional metadata for comprehensive scholarly documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {advancedFields.map((field, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-primary">
                        {field.name}
                      </code>
                      <p className="text-sm text-muted-foreground mt-2">{field.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-muted/50 rounded-lg p-6 border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-3">CSV Import Notes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Column names are case-insensitive</li>
              <li>• Only <code className="text-xs bg-background px-1 py-0.5 rounded">text</code> and <code className="text-xs bg-background px-1 py-0.5 rounded">author</code> are required</li>
              <li>• Use comma-separated values for array fields (topics, keywords)</li>
              <li>• Dates can be flexible: year only (2020), month/year (01/2020), or full date (2020-01-15)</li>
              <li>• All other fields are optional but improve quote quality and searchability</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Glossary;
