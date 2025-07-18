import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Edit3, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  History,
  Database,
  FileText,
  Image,
  Link2,
  Clock,
  User,
  BookOpen,
  Tag,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Star,
  Crown
} from 'lucide-react';
import type { Quote } from '@/utils/quotesData';

interface SuperAdminQuoteEditorProps {
  quote: Quote;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuote: Quote) => Promise<void>;
}

export const SuperAdminQuoteEditor: React.FC<SuperAdminQuoteEditorProps> = ({
  quote,
  isOpen,
  onClose,
  onSave
}) => {
  const { userRole } = useUserRoles();
  const { toast } = useToast();
  const [editedQuote, setEditedQuote] = useState<Quote>(quote);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Only allow super admins
  if (userRole !== 'super_admin') {
    return null;
  }

  useEffect(() => {
    setEditedQuote(quote);
    setIsDirty(false);
    setValidationErrors({});
  }, [quote]);

  const handleFieldChange = (field: keyof Quote, value: any) => {
    setEditedQuote(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateQuote = (): boolean => {
    const errors: Record<string, string> = {};

    if (!editedQuote.text?.trim()) {
      errors.text = 'Quote text is required';
    }

    if (!editedQuote.author?.trim()) {
      errors.author = 'Author is required';
    }

    if (editedQuote.text && editedQuote.text.length > 1000) {
      errors.text = 'Quote text must be less than 1000 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateQuote()) {
      toast({
        title: "Validation Error",
        description: "Please fix the validation errors before saving",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editedQuote);
      setIsDirty(false);
      toast({
        title: "Quote Updated",
        description: "Quote has been successfully updated",
      });
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save quote changes",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const addKeyword = () => {
    const keywords = editedQuote.keywords || [];
    handleFieldChange('keywords', [...keywords, '']);
  };

  const updateKeyword = (index: number, value: string) => {
    const keywords = [...(editedQuote.keywords || [])];
    keywords[index] = value;
    handleFieldChange('keywords', keywords);
  };

  const removeKeyword = (index: number) => {
    const keywords = [...(editedQuote.keywords || [])];
    keywords.splice(index, 1);
    handleFieldChange('keywords', keywords);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <DialogTitle>Super Admin Quote Editor</DialogTitle>
          </div>
          <DialogDescription>
            Advanced editing tools for comprehensive quote management
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <div className="h-[500px] overflow-y-auto">
              <TabsContent value="basic" className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Quote Text *</Label>
                    <Textarea
                      id="text"
                      value={editedQuote.text}
                      onChange={(e) => handleFieldChange('text', e.target.value)}
                      placeholder="Enter the quote text..."
                      rows={4}
                      className={validationErrors.text ? 'border-destructive' : ''}
                    />
                    {validationErrors.text && (
                      <p className="text-xs text-destructive">{validationErrors.text}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        value={editedQuote.author}
                        onChange={(e) => handleFieldChange('author', e.target.value)}
                        placeholder="Author name"
                        className={validationErrors.author ? 'border-destructive' : ''}
                      />
                      {validationErrors.author && (
                        <p className="text-xs text-destructive">{validationErrors.author}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source">Source</Label>
                      <Input
                        id="source"
                        value={editedQuote.source || ''}
                        onChange={(e) => handleFieldChange('source', e.target.value)}
                        placeholder="Source publication or work"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        value={editedQuote.date || ''}
                        onChange={(e) => handleFieldChange('date', e.target.value)}
                        placeholder="Date or year"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="context">Context</Label>
                    <Textarea
                      id="context"
                      value={editedQuote.context || ''}
                      onChange={(e) => handleFieldChange('context', e.target.value)}
                      placeholder="Provide context for this quote..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="historicalContext">Historical Context</Label>
                    <Textarea
                      id="historicalContext"
                      value={editedQuote.historicalContext || ''}
                      onChange={(e) => handleFieldChange('historicalContext', e.target.value)}
                      placeholder="Historical background and significance..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalLanguage">Original Language</Label>
                      <Input
                        id="originalLanguage"
                        value={editedQuote.originalLanguage || ''}
                        onChange={(e) => handleFieldChange('originalLanguage', e.target.value)}
                        placeholder="e.g., Latin, French, German"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="originalText">Original Text</Label>
                      <Input
                        id="originalText"
                        value={editedQuote.originalText || ''}
                        onChange={(e) => handleFieldChange('originalText', e.target.value)}
                        placeholder="Quote in original language"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Input
                      id="theme"
                      value={editedQuote.theme || ''}
                      onChange={(e) => handleFieldChange('theme', e.target.value)}
                      placeholder="Main theme or subject"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4 p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Keywords</Label>
                      <Button size="sm" variant="outline" onClick={addKeyword}>
                        <Tag className="w-3 h-3 mr-1" />
                        Add Keyword
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(editedQuote.keywords || []).map((keyword, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={keyword}
                            onChange={(e) => updateKeyword(index, e.target.value)}
                            placeholder="Enter keyword"
                          />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => removeKeyword(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="citationAPA">APA Citation</Label>
                      <Textarea
                        id="citationAPA"
                        value={editedQuote.citationAPA || ''}
                        onChange={(e) => handleFieldChange('citationAPA', e.target.value)}
                        placeholder="APA format citation"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="citationMLA">MLA Citation</Label>
                      <Textarea
                        id="citationMLA"
                        value={editedQuote.citationMLA || ''}
                        onChange={(e) => handleFieldChange('citationMLA', e.target.value)}
                        placeholder="MLA format citation"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citationChicago">Chicago Citation</Label>
                    <Textarea
                      id="citationChicago"
                      value={editedQuote.citationChicago || ''}
                      onChange={(e) => handleFieldChange('citationChicago', e.target.value)}
                      placeholder="Chicago format citation"
                      rows={2}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="attributionStatus">Attribution Status</Label>
                      <Select 
                        value={editedQuote.attributionStatus || 'unverified'} 
                        onValueChange={(value) => handleFieldChange('attributionStatus', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="unverified">Unverified</SelectItem>
                          <SelectItem value="disputed">Disputed</SelectItem>
                          <SelectItem value="misattributed">Misattributed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ocrConfidenceScore">OCR Confidence Score</Label>
                      <Input
                        id="ocrConfidenceScore"
                        type="number"
                        min="0"
                        max="100"
                        value={editedQuote.ocrConfidenceScore || ''}
                        onChange={(e) => handleFieldChange('ocrConfidenceScore', Number(e.target.value))}
                        placeholder="0-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ocrExtractedText">OCR Extracted Text</Label>
                    <Textarea
                      id="ocrExtractedText"
                      value={editedQuote.ocrExtractedText || ''}
                      onChange={(e) => handleFieldChange('ocrExtractedText', e.target.value)}
                      placeholder="Raw OCR output"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Quote Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={(editedQuote as any).imageUrl || ''}
                      onChange={(e) => handleFieldChange('imageUrl' as any, e.target.value)}
                      placeholder="URL to quote image"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 p-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Administrative Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Featured Quote</Label>
                        <Switch
                          checked={(editedQuote as any).featured || false}
                          onCheckedChange={(checked) => handleFieldChange('featured' as any, checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Verified</Label>
                        <Switch
                          checked={(editedQuote as any).verified || false}
                          onCheckedChange={(checked) => handleFieldChange('verified' as any, checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Public</Label>
                        <Switch
                          checked={(editedQuote as any).isPublic !== false}
                          onCheckedChange={(checked) => handleFieldChange('isPublic' as any, checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-muted-foreground">
                      <div>Quote ID: {quote.id}</div>
                      <div>Created: {(quote as any).createdAt || 'Unknown'}</div>
                      <div>Last Modified: {(quote as any).updatedAt || 'Unknown'}</div>
                      <div>View Count: {(quote as any).views || 0}</div>
                      <div>Share Count: {quote.shareCount || 0}</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {isDirty && (
              <Badge variant="outline" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !isDirty}
              className="min-w-[100px]"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};