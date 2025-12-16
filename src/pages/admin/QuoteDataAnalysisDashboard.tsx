import React, { useState, useEffect } from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Database, Eye, Code, FileText, Search, Layers } from 'lucide-react';
import { QuoteCardMain } from '@/components/quote/QuoteCardMain';
import { ExpandedQuoteCard } from '@/components/quote/ExpandedQuoteCard';
import { Quote } from '@/utils/quotesData';
import { LayeredQuote, QuoteDataLayer, getQuoteDataLayer } from '@/types/quoteLayered';

interface ExampleQuote extends Quote {
  layer: QuoteDataLayer;
  completeness: number;
  verificationStatus?: 'verified' | 'disputed' | 'unverified';
}

export function QuoteDataAnalysisDashboard() {
  const { userRole } = useUserRoles();
  const [quotes, setQuotes] = useState<ExampleQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);

  // Sample data for demonstration
  useEffect(() => {
    const exampleQuotes: ExampleQuote[] = [
      {
        id: 'example-core',
        text: 'Γνῶθι σεαυτόν (Know thyself)',
        author: 'Inscribed at Delphi',
        date: '6th century BCE',
        layer: 'core',
        completeness: 30,
        // Only core fields populated
      } as ExampleQuote,
      {
        id: 'example-enhanced',
        text: 'The essence of strategy is choosing what not to do.',
        author: 'Michael E. Porter',
        date: '1996-11-01',
        source: 'Harvard Business Review',
        context: 'Porter argues that operational effectiveness is not strategy. True strategy involves making trade-offs.',
        historicalContext: 'Written during the dot-com boom when many companies pursued growth at all costs.',
        topics: ['Strategy', 'Business', 'Decision Making'],
        theme: 'Strategic Focus',
        keywords: ['strategy', 'choice', 'trade-offs', 'focus'],
        emotionalTone: 'Analytical',
        originalLanguage: 'en',
        sourceUrl: 'https://hbr.org/1996/11/what-is-strategy',
        sourcePublicationDate: '1996-11-01',
        layer: 'enhanced',
        completeness: 65,
        translations: [
          {
            language: 'fr',
            text: 'L\'essence de la stratégie consiste à choisir ce qu\'il ne faut pas faire.',
            translator: 'Professional Translation',
            translationType: 'human',
            translatorType: 'human',
            verified: true
          },
          {
            language: 'es',
            text: 'La esencia de la estrategia es elegir lo que no hacer.',
            translator: 'AI Translation',
            translationType: 'ai',
            translatorType: 'ai',
            verified: false,
            aiModel: 'GPT-4'
          }
        ]
      } as ExampleQuote,
      {
        id: 'example-advanced',
        text: 'It\'s not just what it looks like and feels like. Design is how it works.',
        author: 'Steve Jobs',
        date: '2003-11-30',
        source: 'New York Times Magazine',
        context: 'Jobs emphasized that design is not mere aesthetics but about functionality.',
        historicalContext: 'Said during the iPod era when Apple was redefining consumer electronics.',
        topics: ['Design', 'Technology', 'Innovation'],
        theme: 'Design Philosophy',
        keywords: ['design', 'functionality', 'aesthetics', 'usability'],
        emotionalTone: 'Passionate',
        originalLanguage: 'en',
        sourceUrl: 'https://nytimes.com/2003/11/30/magazine/the-guts-of-a-new-machine.html',
        sourcePublicationDate: '2003-11-30',
        evidenceImage: '/placeholder-evidence.jpg',
        citationAPA: 'Jobs, S. (2003, November 30). The guts of a new machine. New York Times Magazine.',
        citationMLA: 'Jobs, Steve. "The Guts of a New Machine." New York Times Magazine, 30 Nov. 2003.',
        citationChicago: 'Jobs, Steve. "The Guts of a New Machine." New York Times Magazine, November 30, 2003.',
        verificationStatus: 'verified',
        sourceInfo: {
          source_type: 'article',
          title: 'The Guts of a New Machine',
          author: 'Steve Jobs',
          publisher: 'New York Times Magazine',
          publication_date: '2003-11-30',
          primary_url: 'https://nytimes.com/2003/11/30/magazine/the-guts-of-a-new-machine.html',
          language: 'en'
        },
        shareCount: 1547,
        layer: 'advanced',
        completeness: 95,
        translations: [
          {
            language: 'fr',
            text: 'Ce n\'est pas seulement l\'apparence et la sensation. Le design, c\'est comment ça fonctionne.',
            translator: 'Jean Dupont',
            translationType: 'human',
            translatorType: 'human',
            verified: true,
            qualityRating: 5
          },
          {
            language: 'de',
            text: 'Es geht nicht nur darum, wie es aussieht und sich anfühlt. Design ist, wie es funktioniert.',
            translator: 'AI Translation Pro',
            translationType: 'ai',
            translatorType: 'ai',
            verified: true,
            aiModel: 'GPT-4',
            confidenceScore: 0.92
          }
        ],
        citedBy: [
          {
            siteName: 'Design Blog',
            siteUrl: 'https://designblog.com/apple-philosophy',
            embedDate: '2024-01-15'
          },
          {
            siteName: 'Tech News',
            siteUrl: 'https://technews.com/steve-jobs-quotes',
            embedDate: '2024-02-20'
          }
        ]
      } as ExampleQuote
    ];

    setQuotes(exampleQuotes);
    setLoading(false);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const dataStructures = {
    core: {
      name: 'Core Quote Data (Layer 1)',
      description: 'Essential information required for every quote',
      fields: ['id', 'text', 'author', 'date', 'primarySource'],
      example: quotes.find(q => q.layer === 'core'),
      color: 'bg-blue-500'
    },
    enhanced: {
      name: 'Enhanced Context Data (Layer 2)', 
      description: 'Additional context, translations, and categorization',
      fields: ['context', 'historicalContext', 'originalLanguage', 'originalText', 'topics', 'theme', 'keywords', 'translations'],
      example: quotes.find(q => q.layer === 'enhanced'),
      color: 'bg-green-500'
    },
    advanced: {
      name: 'Advanced Scholarly Data (Layer 3)',
      description: 'Citations, verification, and detailed academic information',
      fields: ['citationAPA', 'citationMLA', 'citationChicago', 'verificationStatus', 'sourceInfo', 'citedBy', 'crossReferencedQuotes'],
      example: quotes.find(q => q.layer === 'advanced'),
      color: 'bg-purple-500'
    }
  };

  const captureProcesses = [
    {
      name: 'Manual Entry Form',
      component: 'LayeredQuoteForm',
      description: 'Multi-layer form allowing progressive data entry',
      inputCode: `<LayeredQuoteForm form={form} />`,
      dataFlow: 'User Input → Form Validation → Database Storage',
      fields: 'All layers supported with collapsible sections'
    },
    {
      name: 'CSV Import',
      component: 'CsvImportSection',
      description: 'Bulk import from structured CSV files',
      inputCode: `<CsvImportSection onImport={handleCsvImport} />`,
      dataFlow: 'CSV File → Field Mapping → Validation → Batch Insert',
      fields: 'Core fields required, enhanced/advanced optional'
    },
    {
      name: 'External API Submissions',
      component: 'Edge Function: external-quote-submissions',
      description: 'Programmatic submissions from external sources',
      inputCode: `POST /functions/v1/external-quote-submissions`,
      dataFlow: 'API Request → Authentication → Validation → Queue for Approval',
      fields: 'Flexible schema with source app identification'
    },
    {
      name: 'Quote Submissions Queue',
      component: 'QuoteSubmissionsManager',
      description: 'Admin approval workflow for submitted quotes',
      inputCode: `<QuoteSubmissionsManager />`,
      dataFlow: 'Pending Submission → Admin Review → Approve/Reject → Quote Creation',
      fields: 'All submission data with admin processing notes'
    }
  ];

  const displayModes = [
    {
      name: 'Quote Card (Collapsed)',
      component: 'QuoteCardMain',
      description: 'Compact card view showing essential information',
      usage: 'Grid view, search results, browse mode',
      fields: ['text', 'author', 'date', 'source', 'topics', 'theme'],
      codeExample: `<QuoteCardMain 
  quote={quote} 
  expanded={false}
  favorite={favorite}
  toggleFavorite={toggleFavorite}
  handleShare={handleShare}
  toggleExpanded={toggleExpanded}
/>`
    },
    {
      name: 'Expanded Quote Card',
      component: 'ExpandedQuoteCard',
      description: 'Full modal view with all available data layers',
      usage: 'Detailed view, citations, embed options',
      fields: ['All available fields', 'translations', 'citations', 'sources'],
      codeExample: `<ExpandedQuoteCard
  quote={quote}
  expanded={true}
  toggleExpanded={toggleExpanded}
  showEmbedCode={showEmbedCode}
  editMode={false}
/>`
    },
    {
      name: 'Layered Quote Display',
      component: 'LayeredQuoteDisplay',
      description: 'Progressive disclosure of data layers',
      usage: 'Academic research, detailed analysis',
      fields: ['Organized by data layers', 'collapsible sections'],
      codeExample: `<LayeredQuoteDisplay 
  quote={quote}
  showLayer="enhanced"
/>`
    },
    {
      name: 'Embed Views',
      component: 'EmbedPreview',
      description: 'Various embedded quote formats for external sites',
      usage: 'Website embedding, social sharing',
      fields: ['Configurable fields based on embed size/style'],
      codeExample: `<iframe src="/embed/quote/{id}?style=card&color=light&size=medium" />`
    }
  ];

  if (userRole !== 'super_admin') {
    return (
      <div className="min-h-screen pt-36 pb-20 page-padding">
        <div className="page-max-width">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground">This dashboard is only accessible to super administrators.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Quote Data Analysis Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive analysis of quote capture system and data structures</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="structures" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="structures" className="text-xs md:text-sm">Data</TabsTrigger>
            <TabsTrigger value="examples" className="text-xs md:text-sm">Examples</TabsTrigger>
            <TabsTrigger value="capture" className="text-xs md:text-sm">Capture</TabsTrigger>
            <TabsTrigger value="display" className="text-xs md:text-sm">Display</TabsTrigger>
            <TabsTrigger value="database" className="text-xs md:text-sm">Schema</TabsTrigger>
            <TabsTrigger value="api" className="text-xs md:text-sm">API</TabsTrigger>
          </TabsList>

          {/* Data Structures Tab */}
          <TabsContent value="structures" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(dataStructures).map(([key, layer]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${layer.color}`} />
                      {layer.name}
                    </CardTitle>
                    <CardDescription>{layer.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Fields Included:</h4>
                        <div className="flex flex-wrap gap-2">
                          {layer.fields.map(field => (
                            <Badge key={field} variant="outline">{field}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      {layer.example && (
                        <div>
                          <h4 className="font-medium mb-2">Example Data Structure:</h4>
                          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify({
  id: layer.example.id,
  text: layer.example.text,
  author: layer.example.author,
  date: layer.example.date,
  ...(key !== 'core' && {
    context: layer.example.context,
    topics: layer.example.topics,
    translations: layer.example.translations
  }),
  ...(key === 'advanced' && {
    citationAPA: layer.example.citationAPA,
    verificationStatus: layer.example.verificationStatus,
    sourceInfo: layer.example.sourceInfo
  })
}, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Example Quotes Tab */}
          <TabsContent value="examples" className="space-y-6">
            <div className="grid gap-6">
              {quotes.map((quote) => (
                <Card key={quote.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Badge className={dataStructures[quote.layer].color}>
                        Layer {quote.layer === 'core' ? '1' : quote.layer === 'enhanced' ? '2' : '3'}
                      </Badge>
                      {dataStructures[quote.layer].name}
                      <Badge variant="outline">{quote.completeness}% Complete</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Quote Display */}
                      <div>
                        <h4 className="font-medium mb-4">Visual Display:</h4>
                        <div className="border rounded-lg p-4 bg-muted/30">
                          <QuoteCardMain
                            quote={quote}
                            delay={0}
                            isAnyExpanded={false}
                            expanded={false}
                            favorite={false}
                            toggleFavorite={() => {}}
                            handleShare={() => {}}
                            toggleExpanded={() => setExpandedQuote(quote.id)}
                            shareCount={quote.shareCount || 0}
                            favoriteCount={42}
                          />
                        </div>
                      </div>

                      {/* Data Analysis */}
                      <div>
                        <h4 className="font-medium mb-4">Data Analysis:</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium">Original Language:</span> {quote.originalLanguage || 'en'}
                          </div>
                          {quote.translations && (
                            <div>
                              <span className="font-medium">Translations:</span> 
                              <div className="ml-4 mt-1">
                                {Array.isArray(quote.translations) ? 
                                  quote.translations.map((t, i) => (
                                    <div key={i} className="text-xs text-muted-foreground">
                                      • {t.language}: {t.translationType} ({t.verified ? 'verified' : 'unverified'})
                                    </div>
                                  )) : 
                                  <div className="text-xs text-muted-foreground">• Legacy format</div>
                                }
                              </div>
                            </div>
                          )}
                          {quote.topics && (
                            <div>
                              <span className="font-medium">Topics:</span> {quote.topics.join(', ')}
                            </div>
                          )}
                          {quote.citationAPA && (
                            <div>
                              <span className="font-medium">Citations:</span> APA, MLA, Chicago available
                            </div>
                          )}
                          {quote.verificationStatus && (
                            <div>
                              <span className="font-medium">Verification:</span> {quote.verificationStatus}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="mt-4" 
                      variant="outline" 
                      onClick={() => setExpandedQuote(quote.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View in Expanded Mode
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Expanded Quote Modal */}
            {expandedQuote && (
              <ExpandedQuoteCard
                quote={quotes.find(q => q.id === expandedQuote)!}
                expanded={true}
                toggleExpanded={() => setExpandedQuote(null)}
                favorite={false}
                toggleFavorite={() => {}}
                showEmbedCode={false}
                shareCount={42}
                favoriteCount={128}
                copyEmbedCode={() => {}}
              />
            )}
          </TabsContent>

          {/* Capture Flow Tab */}
          <TabsContent value="capture" className="space-y-6">
            <div className="grid gap-6">
              {captureProcesses.map((process, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      {process.name}
                    </CardTitle>
                    <CardDescription>{process.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Component:</h4>
                        <Badge variant="secondary">{process.component}</Badge>
                        
                        <h4 className="font-medium mb-2 mt-4">Data Flow:</h4>
                        <p className="text-sm text-muted-foreground">{process.dataFlow}</p>
                        
                        <h4 className="font-medium mb-2 mt-4">Field Support:</h4>
                        <p className="text-sm text-muted-foreground">{process.fields}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Implementation Code:</h4>
                        <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{process.inputCode}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Display Modes Tab */}
          <TabsContent value="display" className="space-y-6">
            <div className="grid gap-6">
              {displayModes.map((mode, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{mode.name}</CardTitle>
                    <CardDescription>{mode.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Primary Usage:</h4>
                        <p className="text-sm text-muted-foreground">{mode.usage}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Component:</h4>
                        <Badge variant="secondary">{mode.component}</Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Fields Displayed:</h4>
                        <div className="flex flex-wrap gap-2">
                          {mode.fields.map((field, i) => (
                            <Badge key={i} variant="outline">{field}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Collapsible 
                        open={expandedSections[`display-${index}`]} 
                        onOpenChange={() => toggleSection(`display-${index}`)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="flex items-center gap-2">
                            {expandedSections[`display-${index}`] ? 
                              <ChevronDown className="w-4 h-4" /> : 
                              <ChevronRight className="w-4 h-4" />
                            }
                            <Code className="w-4 h-4" />
                            View Implementation Code
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mt-3">
{mode.codeExample}
                          </pre>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Database Schema Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="w-5 h-5" />
                  Database Schema Overview
                </CardTitle>
                <CardDescription>
                  Core tables and relationships in the quote management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Primary Tables:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span className="font-medium">quotes</span>
                        <Badge variant="outline">Core quote data</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span className="font-medium">translations</span>
                        <Badge variant="outline">Multi-language support</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span className="font-medium">original_sources</span>
                        <Badge variant="outline">Source documentation</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span className="font-medium">quote_submissions</span>
                        <Badge variant="outline">Approval workflow</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span className="font-medium">topics</span>
                        <Badge variant="outline">Categorization</Badge>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span className="font-medium">cited_by</span>
                        <Badge variant="outline">Usage tracking</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Key Relationships:</h4>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>• quotes.source_id → original_sources.id</div>
                      <div>• translations.quote_id → quotes.id</div>
                      <div>• quote_topics.quote_id → quotes.id</div>
                      <div>• quote_topics.topic_id → topics.id</div>
                      <div>• cited_by.quote_id → quotes.id</div>
                      <div>• quote_submissions.final_quote_id → quotes.id</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Reference Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  API Reference & Integration Points
                </CardTitle>
                <CardDescription>
                  Key API endpoints and integration patterns for quote management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Core APIs:</h4>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">GET</Badge>
                          <code className="text-sm">/functions/v1/quotes-api/quotes</code>
                        </div>
                        <p className="text-xs text-muted-foreground">Fetch quotes with filtering, pagination, and search</p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="destructive">POST</Badge>
                          <code className="text-sm">/functions/v1/quotes-api/quotes</code>
                        </div>
                        <p className="text-xs text-muted-foreground">Create new quote with validation and RLS</p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="destructive">POST</Badge>
                          <code className="text-sm">/functions/v1/external-quote-submissions</code>
                        </div>
                        <p className="text-xs text-muted-foreground">External submission API with rate limiting</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Integration Patterns:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-2">Frontend Integration</h5>
                        <code className="text-xs bg-muted p-2 rounded block">
{`import { fetchQuotes } from '@/services/quoteService';

const quotes = await fetchQuotes({
  page: 1,
  limit: 20,
  search: 'strategy',
  topics: ['Business']
});`}
                        </code>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-2">External API Usage</h5>
                        <code className="text-xs bg-muted p-2 rounded block">
{`curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"quote_text":"...","author_name":"..."}' \\
  /functions/v1/external-quote-submissions`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}