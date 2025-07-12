import { useState } from 'react';
import { ChevronDown, ChevronRight, Shield, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Quote } from '@/utils/quotesData';

interface LayeredQuoteDisplayProps {
  quote: Quote;
}

export function LayeredQuoteDisplay({ quote }: LayeredQuoteDisplayProps) {
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Simple checks for data availability
  const hasEnhanced = !!(quote.context || quote.historicalContext || quote.originalLanguage || quote.topics?.length);
  const hasAdvanced = !!(quote.citationAPA || quote.citationMLA || quote.attributionStatus || quote.ocrExtractedText);
  
  const dataLayer = hasAdvanced ? 'advanced' : hasEnhanced ? 'enhanced' : 'core';

  return (
    <div className="space-y-4">
      {/* Data Layer Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="flex items-center gap-1">
          {dataLayer === 'core' && <BookOpen className="h-3 w-3" />}
          {dataLayer === 'enhanced' && <Shield className="h-3 w-3" />}
          {dataLayer === 'advanced' && <GraduationCap className="h-3 w-3" />}
          {dataLayer.charAt(0).toUpperCase() + dataLayer.slice(1)} Data
        </Badge>
        <span className="text-xs text-muted-foreground">
          {dataLayer === 'core' && 'Essential information available'}
          {dataLayer === 'enhanced' && 'Enhanced context available'}
          {dataLayer === 'advanced' && 'Full scholarly data available'}
        </span>
      </div>

      {/* Core Information - Always Visible */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
            Essential Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-medium text-foreground">Quote</h3>
            <blockquote className="text-lg italic border-l-4 border-primary pl-4 mt-1">
              "{quote.text}"
            </blockquote>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Author</h4>
              <p className="text-foreground">{quote.author}</p>
            </div>
            {quote.date && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Date</h4>
                <p className="text-foreground">{quote.date}</p>
              </div>
            )}
            {quote.source && (
              <div className="md:col-span-2">
                <h4 className="font-medium text-sm text-muted-foreground">Primary Source</h4>
                <p className="text-foreground">{quote.source}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Context - Collapsible */}
      {hasEnhanced && (
        <Collapsible open={showEnhanced} onOpenChange={setShowEnhanced}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="bg-secondary text-secondary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    Enhanced Context
                  </div>
                  <Button variant="ghost" size="sm">
                    {showEnhanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {quote.context && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Context</h4>
                    <p className="text-foreground">{quote.context}</p>
                  </div>
                )}
                
                {quote.historicalContext && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Historical Context</h4>
                    <p className="text-foreground">{quote.historicalContext}</p>
                  </div>
                )}

                {(quote.originalLanguage || quote.originalText) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quote.originalLanguage && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Original Language</h4>
                        <p className="text-foreground">{quote.originalLanguage}</p>
                      </div>
                    )}
                    {quote.originalText && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Original Text</h4>
                        <p className="text-foreground italic">{quote.originalText}</p>
                      </div>
                    )}
                  </div>
                )}

                {(quote.topics?.length || quote.theme || quote.keywords?.length) && (
                  <div className="space-y-3">
                    {quote.topics?.length && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Topics</h4>
                        <div className="flex flex-wrap gap-1">
                          {quote.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {quote.theme && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Theme</h4>
                        <Badge variant="outline">{quote.theme}</Badge>
                      </div>
                    )}

                    {quote.keywords?.length && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-1">
                          {quote.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{keyword}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Advanced Scholarly Data - Collapsible */}
      {hasAdvanced && (
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-accent">
                    <span className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    Advanced Scholarly Data
                  </div>
                  <Button variant="ghost" size="sm">
                    {showAdvanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {(quote.attributionStatus || quote.ocrConfidenceScore) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quote.attributionStatus && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Attribution Status</h4>
                        <Badge variant={quote.attributionStatus === 'verified' ? 'default' : 'secondary'}>
                          {quote.attributionStatus}
                        </Badge>
                      </div>
                    )}
                    {quote.ocrConfidenceScore && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">OCR Confidence</h4>
                        <p className="text-foreground">{quote.ocrConfidenceScore}%</p>
                      </div>
                    )}
                  </div>
                )}

                {(quote.citationAPA || quote.citationMLA || quote.citationChicago) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Citations</h4>
                    {quote.citationAPA && (
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">APA</h5>
                        <p className="text-sm font-mono bg-muted p-2 rounded">{quote.citationAPA}</p>
                      </div>
                    )}
                    {quote.citationMLA && (
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">MLA</h5>
                        <p className="text-sm font-mono bg-muted p-2 rounded">{quote.citationMLA}</p>
                      </div>
                    )}
                    {quote.citationChicago && (
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Chicago</h5>
                        <p className="text-sm font-mono bg-muted p-2 rounded">{quote.citationChicago}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
}