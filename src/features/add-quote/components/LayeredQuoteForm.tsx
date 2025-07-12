import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CoreQuoteFields } from './CoreQuoteFields';
import { EnhancedQuoteFields } from './EnhancedQuoteFields';
import { AdvancedQuoteFields } from './AdvancedQuoteFields';
import type { QuoteFormValues } from '@/utils/formSchemas';

interface LayeredQuoteFormProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function LayeredQuoteForm({ form }: LayeredQuoteFormProps) {
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-6">
      {/* Layer 1 - Core Essential Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
            Essential Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            The basic information required for every quote
          </p>
        </CardHeader>
        <CardContent>
          <CoreQuoteFields form={form} />
        </CardContent>
      </Card>

      {/* Layer 2 - Enhanced Context Data */}
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
              <p className="text-sm text-muted-foreground text-left">
                Additional context, translations, and categorization (optional)
              </p>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <EnhancedQuoteFields form={form} />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Layer 3 - Advanced Scholarly Data */}
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
              <p className="text-sm text-muted-foreground text-left">
                Citations, verification, and detailed academic information (optional)
              </p>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <AdvancedQuoteFields form={form} />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}