import React, { useState, useEffect, useCallback } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SmartImageUpload } from '@/components/quote/SmartImageUpload';
import { OcrTextSelector } from './OcrTextSelector';
import { QuoteQualityIndicator, QualityScore, QualitySuggestion } from '@/components/quote/QuoteQualityIndicator';
import { CoreQuoteFields } from './CoreQuoteFields';
import { EnhancedQuoteFields } from './EnhancedQuoteFields';
import { ProcessedEvidence } from '@/utils/aiOcrProcessor';
import { QuoteFormValues } from '@/utils/formSchemas';
import { CheckCircle, ArrowRight, PenTool, Sparkles, FileText, Save, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuoteDraft } from '../hooks/useQuoteDraft';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EvidenceFirstQuoteFormProps {
  form: UseFormReturn<QuoteFormValues>;
  onFilesSelected: (files: File[]) => void;
  selectedFiles?: File[];
  onDraftLoaded?: () => void;
}

type FormStep = 'upload' | 'ocr' | 'core' | 'enhanced' | 'review';

export function EvidenceFirstQuoteForm({ 
  form, 
  onFilesSelected, 
  selectedFiles = [],
  onDraftLoaded
}: EvidenceFirstQuoteFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('upload');
  const [processedEvidence, setProcessedEvidence] = useState<ProcessedEvidence | null>(null);
  const [qualityScore, setQualityScore] = useState<QualityScore>({
    overall: 0,
    completeness: 0,
    accuracy: 0,
    sourcing: 0
  });
  const [suggestions, setSuggestions] = useState<QualitySuggestion[]>([]);
  const { saveDraft, isSaving } = useQuoteDraft();
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const { toast } = useToast();

  // Watch only the fields we need to avoid infinite re-renders
  const text = useWatch({ control: form.control, name: 'text' });
  const author = useWatch({ control: form.control, name: 'author' });
  const context = useWatch({ control: form.control, name: 'context' });
  const theme = useWatch({ control: form.control, name: 'theme' });
  const sourceTitle = useWatch({ control: form.control, name: 'sourceInfo.title' as any });
  const primaryUrl = useWatch({ control: form.control, name: 'sourceInfo.primary_url' as any });
  const publicationDate = useWatch({ control: form.control, name: 'sourceInfo.publication_date' as any });

  // Skip to manual entry
  const handleSkipToManual = useCallback(() => {
    setCurrentStep('core');
    onFilesSelected([]);
  }, [onFilesSelected]);

  // Handle evidence processed from image
  const handleEvidenceProcessed = useCallback((evidence: ProcessedEvidence, originalFile: File) => {
    setProcessedEvidence(evidence);
    
    // If we have good OCR text, show the selector
    if (evidence.text && evidence.text.length > 20) {
      setCurrentStep('ocr');
    } else {
      // Auto-populate and skip to core if OCR is weak
      if (evidence.text) form.setValue('text', evidence.text);
      if (evidence.author) form.setValue('author', evidence.author);
      if (evidence.title) {
        form.setValue('sourceInfo', { 
          ...form.getValues('sourceInfo'),
          title: evidence.title, 
          source_type: 'other' as const 
        });
      }
      if (evidence.context) form.setValue('context', evidence.context);
      setCurrentStep('core');
    }
  }, [form]);

  // Handle OCR selections
  const handleOcrQuoteSelected = useCallback((quote: string) => {
    form.setValue('text', quote);
  }, [form]);

  const handleOcrAuthorSelected = useCallback((author: string) => {
    form.setValue('author', author);
  }, [form]);

  const handleOcrConfirm = useCallback(() => {
    setCurrentStep('core');
  }, []);

  // Memoized quality calculation to prevent infinite loops
  const calculateQuality = useCallback(() => {
    let completeness = 0;
    let accuracy = 0;
    let sourcing = 0;

    if (text) completeness += 40;
    if (author) completeness += 30;
    if (sourceTitle) completeness += 20;
    if (context) completeness += 10;

    if (processedEvidence) {
      accuracy += processedEvidence.confidence * 50;
    }
    if (text && text.length > 20) accuracy += 25;
    if (author && author.length > 2) accuracy += 25;

    if (selectedFiles.length > 0) sourcing += 50;
    if (primaryUrl) sourcing += 30;
    if (publicationDate) sourcing += 20;

    const overall = (completeness + accuracy + sourcing) / 3;

    return { overall, completeness, accuracy, sourcing };
  }, [text, author, context, sourceTitle, primaryUrl, publicationDate, processedEvidence, selectedFiles]);

  const generateSuggestions = useCallback(() => {
    const newSuggestions: QualitySuggestion[] = [];

    if (!text) {
      newSuggestions.push({
        type: 'missing',
        field: 'Quote Text',
        message: 'Add the main quote text',
        priority: 'high'
      });
    }
    if (!author) {
      newSuggestions.push({
        type: 'missing',
        field: 'Author',
        message: 'Specify who said or wrote this quote',
        priority: 'high'
      });
    }
    if (!sourceTitle) {
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
    if (!context && text && text.length > 50) {
      newSuggestions.push({
        type: 'enhance',
        field: 'Context',
        message: 'Add context to help readers understand the quote',
        priority: 'low'
      });
    }

    return newSuggestions;
  }, [text, author, context, sourceTitle, selectedFiles]);

  // Update quality score and suggestions
  useEffect(() => {
    const newScore = calculateQuality();
    setQualityScore(newScore);
    
    const newSuggestions = generateSuggestions();
    setSuggestions(newSuggestions);
  }, [calculateQuality, generateSuggestions]);

  // Handle draft loaded - advance to core step
  useEffect(() => {
    if (onDraftLoaded && text && author) {
      setCurrentStep('core');
    }
  }, [onDraftLoaded]);

  const steps = [
    { id: 'upload', label: 'Upload', icon: Sparkles, completed: selectedFiles.length > 0 || currentStep !== 'upload' },
    { id: 'ocr', label: 'Select Text', icon: FileText, completed: currentStep !== 'upload' && currentStep !== 'ocr' },
    { id: 'core', label: 'Details', icon: PenTool, completed: !!(text && author) },
    { id: 'enhanced', label: 'Context', icon: ArrowRight, completed: !!(context || theme) },
    { id: 'review', label: 'Review', icon: CheckCircle, completed: qualityScore.overall >= 70 }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressValue = ((currentStepIndex + 1) / steps.length) * 100;

  const canAdvanceStep = () => {
    switch (currentStep) {
      case 'upload': return selectedFiles.length > 0;
      case 'ocr': return !!(text || author);
      case 'core': return !!(text && author);
      case 'enhanced': return true; // Optional step
      case 'review': return qualityScore.overall >= 50;
      default: return false;
    }
  };

  // Auto-save draft when advancing steps
  const handleStepAdvance = useCallback(async (nextStep: FormStep) => {
    const formValues = form.getValues();
    const imageUrl = selectedFiles[0] ? URL.createObjectURL(selectedFiles[0]) : undefined;
    const evidenceImageName = selectedFiles[0]?.name;
    
    // Auto-save without toast notification
    await saveDraft(
      formValues,
      imageUrl,
      processedEvidence?.text,
      evidenceImageName,
      false
    );
    
    setCurrentStep(nextStep);
  }, [form, selectedFiles, processedEvidence, saveDraft]);

  // Manual save draft
  const handleManualSave = useCallback(async () => {
    const formValues = form.getValues();
    const imageUrl = selectedFiles[0] ? URL.createObjectURL(selectedFiles[0]) : undefined;
    const evidenceImageName = selectedFiles[0]?.name;
    
    // Manual save with toast notification
    await saveDraft(
      formValues,
      imageUrl,
      processedEvidence?.text,
      evidenceImageName,
      true
    );
  }, [form, selectedFiles, processedEvidence, saveDraft]);

  // Auto-fill with AI
  const handleAutoFill = useCallback(async () => {
    const quoteText = form.getValues('text');
    if (!quoteText) {
      toast({
        title: "No Quote Text",
        description: "Please enter or select a quote first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAutoFilling(true);
    try {
      const { data, error } = await supabase.functions.invoke('autofill-quote-metadata', {
        body: {
          quoteText,
          ocrContext: processedEvidence?.text || ''
        }
      });

      if (error) throw error;

      // Populate form with AI suggestions
      if (data.author) form.setValue('author', data.author);
      if (data.date) form.setValue('date', data.date);
      if (data.context) form.setValue('context', data.context);
      if (data.sourceTitle) {
        const currentSourceInfo = form.getValues('sourceInfo') || { source_type: 'other' as const };
        form.setValue('sourceInfo', {
          ...currentSourceInfo,
          title: data.sourceTitle
        });
      }
      if (data.topics && Array.isArray(data.topics)) {
        form.setValue('topics', data.topics);
      }

      toast({
        title: "Auto-fill Complete",
        description: "Form fields populated with AI suggestions.",
      });
      
      // Auto-save after filling
      await handleManualSave();
    } catch (error) {
      console.error('Auto-fill error:', error);
      toast({
        title: "Auto-fill Failed",
        description: "Could not extract metadata. Please fill manually.",
        variant: "destructive"
      });
    } finally {
      setIsAutoFilling(false);
    }
  }, [form, processedEvidence, toast, handleManualSave]);

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
                      <span className="hidden sm:inline">{step.label}</span>
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
          {/* Step: Upload Evidence */}
          {currentStep === 'upload' && (
            <div className="space-y-4">
              <SmartImageUpload
                onEvidenceProcessed={handleEvidenceProcessed}
                onFilesSelected={onFilesSelected}
                selectedFiles={selectedFiles}
              />
              
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkipToManual}
                  size="lg"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Skip Image Upload & Enter Manually
                </Button>
              </div>
            </div>
          )}

          {/* Step: OCR Text Selection */}
          {currentStep === 'ocr' && processedEvidence?.text && (
            <OcrTextSelector
              extractedText={processedEvidence.text}
              onQuoteSelected={handleOcrQuoteSelected}
              onAuthorSelected={handleOcrAuthorSelected}
              onConfirm={handleOcrConfirm}
              confidence={processedEvidence.confidence}
            />
          )}

          {/* Step: Core Fields */}
          {currentStep === 'core' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Quote Details
                  <Badge variant="secondary" className="ml-auto">Required</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review and refine the quote information
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {text && (
                  <Button
                    type="button"
                    onClick={handleAutoFill}
                    disabled={isAutoFilling}
                    variant="secondary"
                    className="w-full"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    {isAutoFilling ? "Auto-filling..." : "Auto Fill with AI"}
                  </Button>
                )}
                <CoreQuoteFields form={form} />
              </CardContent>
            </Card>
          )}

          {/* Step: Enhanced Fields */}
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

          {/* Step: Review */}
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
                    {text || 'No quote text provided'}
                  </blockquote>
                  <p className="text-sm text-muted-foreground">
                    — {author || 'Unknown Author'}
                    {sourceTitle && `, ${sourceTitle}`}
                  </p>
                </div>

                {context && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Context:</h4>
                    <p className="text-sm">{context}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const prevIndex = Math.max(0, currentStepIndex - 1);
                setCurrentStep(steps[prevIndex].id as FormStep);
              }}
              disabled={currentStepIndex === 0}
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleManualSave}
              disabled={isSaving || !text}
              className="ml-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            
            {currentStep !== 'review' ? (
              <Button
                type="button"
                onClick={() => {
                  const nextIndex = Math.min(steps.length - 1, currentStepIndex + 1);
                  handleStepAdvance(steps[nextIndex].id as FormStep);
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
