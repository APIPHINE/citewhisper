import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SmartImageUpload } from '@/components/quote/SmartImageUpload';
import { QuoteQualityIndicator, QualityScore, QualitySuggestion } from '@/components/quote/QuoteQualityIndicator';
import { CoreQuoteFields } from './CoreQuoteFields';
import { EnhancedQuoteFields } from './EnhancedQuoteFields';
import { ProcessedEvidence } from '@/utils/evidenceProcessor';
import { QuoteFormValues } from '@/utils/formSchemas';
import { CheckCircle, ArrowRight, PenTool, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidenceFirstQuoteFormProps {
  form: UseFormReturn<QuoteFormValues>;
  onFilesSelected: (files: File[]) => void;
  selectedFiles?: File[];
}

type FormStep = 'evidence' | 'core' | 'enhanced' | 'review';

export function EvidenceFirstQuoteForm({ 
  form, 
  onFilesSelected, 
  selectedFiles = [] 
}: EvidenceFirstQuoteFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('evidence');
  const [processedEvidence, setProcessedEvidence] = useState<ProcessedEvidence | null>(null);
  const [qualityScore, setQualityScore] = useState<QualityScore>({
    overall: 0,
    completeness: 0,
    accuracy: 0,
    sourcing: 0
  });
  const [suggestions, setSuggestions] = useState<QualitySuggestion[]>([]);

  const watchedValues = form.watch();

  // Auto-populate form from processed evidence
  const handleEvidenceProcessed = (evidence: ProcessedEvidence, originalFile: File) => {
    setProcessedEvidence(evidence);
    
    // Auto-populate form fields from extracted data
    const updates: Partial<QuoteFormValues> = {};
    
    if (evidence.extractedText && !watchedValues.text) {
      updates.text = evidence.extractedText;
    }
    if (evidence.author && !watchedValues.author) {
      updates.author = evidence.author;
    }
    if (evidence.title && !watchedValues.source) {
      updates.source = evidence.title;
    }
    if (evidence.context && !watchedValues.context) {
      updates.context = evidence.context;
    }

    // Apply updates to form
    Object.entries(updates).forEach(([field, value]) => {
      form.setValue(field as keyof QuoteFormValues, value);
    });

    // Advance to core fields step if evidence was processed successfully
    if (evidence.confidence > 0.3) {
      setCurrentStep('core');
    }
  };

  // Calculate quality score and suggestions
  useEffect(() => {
    const calculateQuality = () => {
      const values = watchedValues;
      let completeness = 0;
      let accuracy = 0;
      let sourcing = 0;

      // Completeness scoring
      if (values.text) completeness += 40;
      if (values.author) completeness += 30;
      if (values.source) completeness += 20;
      if (values.context) completeness += 10;

      // Accuracy scoring (based on evidence confidence and field quality)
      if (processedEvidence) {
        accuracy += processedEvidence.confidence * 50;
      }
      if (values.text && values.text.length > 20) accuracy += 25;
      if (values.author && values.author.length > 2) accuracy += 25;

      // Sourcing scoring
      if (selectedFiles.length > 0) sourcing += 50;
      if (values.sourceUrl) sourcing += 30;
      if (values.sourcePublicationDate) sourcing += 20;

      const overall = (completeness + accuracy + sourcing) / 3;

      setQualityScore({ overall, completeness, accuracy, sourcing });

      // Generate suggestions
      const newSuggestions: QualitySuggestion[] = [];

      if (!values.text) {
        newSuggestions.push({
          type: 'missing',
          field: 'Quote Text',
          message: 'Add the main quote text',
          priority: 'high'
        });
      }
      if (!values.author) {
        newSuggestions.push({
          type: 'missing',
          field: 'Author',
          message: 'Specify who said or wrote this quote',
          priority: 'high'
        });
      }
      if (!values.source) {
        newSuggestions.push({
          type: 'missing',
          field: 'Source',
          message: 'Add the source publication or work',
          priority: 'medium'
        });
      }
      if (selectedFiles.length === 0) {
        newSuggestions.push({
          type: 'enhance',
          field: 'Evidence',
          message: 'Upload an image of the original source for verification',
          priority: 'medium'
        });
      }
      if (!values.context && values.text && values.text.length > 50) {
        newSuggestions.push({
          type: 'enhance',
          field: 'Context',
          message: 'Add context to help readers understand the quote',
          priority: 'low'
        });
      }

      setSuggestions(newSuggestions);
    };

    calculateQuality();
  }, [watchedValues, processedEvidence, selectedFiles]);

  const steps = [
    { id: 'evidence', label: 'Evidence', icon: Sparkles, completed: selectedFiles.length > 0 },
    { id: 'core', label: 'Quote Details', icon: PenTool, completed: watchedValues.text && watchedValues.author },
    { id: 'enhanced', label: 'Context', icon: ArrowRight, completed: watchedValues.context || watchedValues.theme },
    { id: 'review', label: 'Review', icon: CheckCircle, completed: qualityScore.overall >= 70 }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressValue = ((currentStepIndex + 1) / steps.length) * 100;

  const canAdvanceStep = () => {
    switch (currentStep) {
      case 'evidence': return selectedFiles.length > 0;
      case 'core': return watchedValues.text && watchedValues.author;
      case 'enhanced': return true; // Optional step
      case 'review': return qualityScore.overall >= 50;
      default: return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create New Quote</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Follow the guided process to add a high-quality quote
                </p>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                Step {currentStepIndex + 1} of {steps.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Progress value={progressValue} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div 
                      key={step.id}
                      className={cn(
                        "flex items-center gap-1",
                        index <= currentStepIndex ? "text-primary" : "text-muted-foreground",
                        step.completed && "text-green-600"
                      )}
                    >
                      <StepIcon className="h-3 w-3" />
                      <span>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Content */}
          {currentStep === 'evidence' && (
            <SmartImageUpload
              onEvidenceProcessed={handleEvidenceProcessed}
              onFilesSelected={onFilesSelected}
              selectedFiles={selectedFiles}
            />
          )}

          {currentStep === 'core' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Quote Details
                  <Badge variant="secondary" className="ml-auto">Step 2</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review and refine the extracted information
                </p>
              </CardHeader>
              <CardContent>
                <CoreQuoteFields form={form} />
              </CardContent>
            </Card>
          )}

          {currentStep === 'enhanced' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Additional Context
                  <Badge variant="outline" className="ml-auto">Optional</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add context, themes, and categorization to enhance your quote
                </p>
              </CardHeader>
              <CardContent>
                <EnhancedQuoteFields form={form} />
              </CardContent>
            </Card>
          )}

          {currentStep === 'review' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Review & Submit
                  <Badge variant="secondary" className="ml-auto">Final Step</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review your quote before submission
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Quote Preview:</h4>
                  <blockquote className="border-l-4 border-primary pl-4 italic">
                    {watchedValues.text || 'No quote text provided'}
                  </blockquote>
                  <p className="text-sm text-muted-foreground">
                    — {watchedValues.author || 'Unknown Author'}
                    {watchedValues.source && `, ${watchedValues.source}`}
                  </p>
                </div>

                {watchedValues.context && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Context:</h4>
                    <p className="text-sm">{watchedValues.context}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                const prevIndex = Math.max(0, currentStepIndex - 1);
                setCurrentStep(steps[prevIndex].id as FormStep);
              }}
              disabled={currentStepIndex === 0}
            >
              Previous
            </Button>
            
            {currentStep !== 'review' ? (
              <Button
                onClick={() => {
                  const nextIndex = Math.min(steps.length - 1, currentStepIndex + 1);
                  setCurrentStep(steps[nextIndex].id as FormStep);
                }}
                disabled={!canAdvanceStep()}
              >
                {currentStep === 'enhanced' ? 'Skip to Review' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={qualityScore.overall < 50}
                className="bg-primary hover:bg-primary/90"
              >
                Submit Quote
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Quality Sidebar */}
        <div className="space-y-6">
          <QuoteQualityIndicator
            score={qualityScore}
            suggestions={suggestions}
          />
          
          {/* Progress Summary */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">Progress Summary</h4>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    step.completed ? "text-green-600" : 
                    index === currentStepIndex ? "text-primary" : 
                    "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    step.completed ? "bg-green-600" : 
                    index === currentStepIndex ? "bg-primary" : 
                    "bg-muted-foreground"
                  )} />
                  <span>{step.label}</span>
                  {step.completed && <CheckCircle className="h-3 w-3 ml-auto" />}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}