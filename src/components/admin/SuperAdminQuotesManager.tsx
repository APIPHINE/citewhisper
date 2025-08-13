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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useToast } from '@/hooks/use-toast';
import { superAdminService } from '@/services/superAdminService';
import { 
  Plus,
  Edit3, 
  Save, 
  X, 
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
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
  Crown,
  Eye,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import type { Quote } from '@/utils/quotesData';

// Database quote type based on actual Supabase schema
interface DatabaseQuote {
  id: string;
  quote_text: string;
  author_name: string | null;
  date_original: string | null;
  quote_context: string | null;
  quote_image_url: string | null;
  seo_keywords: string[] | null;
  seo_slug: string | null;
  source_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  inserted_at: string | null;
  updated_at: string | null;
  profiles?: any;
}

interface QuoteRow extends DatabaseQuote {
  selected?: boolean;
}

export const SuperAdminQuotesManager: React.FC = () => {
  const { userRole } = useUserRoles();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [editingQuote, setEditingQuote] = useState<DatabaseQuote | null>(null);
  const [showAddQuote, setShowAddQuote] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  // Only allow super admins
  if (userRole !== 'super_admin') {
    return null;
  }

  useEffect(() => {
    loadQuotes();
  }, [currentPage, statusFilter]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const filters = statusFilter !== 'all' ? { status: statusFilter } : {};
      const result = await superAdminService.fetchQuotesWithMetadata(currentPage, 50, filters);
      
      if (result.success) {
        setQuotes((result.data || []) as QuoteRow[]);
        setTotalCount(result.count || 0);
      } else {
        toast({
          title: "Error",
          description: "Failed to load quotes",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
      toast({
        title: "Error",
        description: "Failed to load quotes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteSelect = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const handleSelectAll = () => {
    setSelectedQuotes(
      selectedQuotes.length === quotes.length 
        ? [] 
        : quotes.map(q => q.id)
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedQuotes.length === 0) {
      toast({
        title: "No quotes selected",
        description: "Please select quotes to perform bulk actions",
        variant: "destructive"
      });
      return;
    }

    try {
      let updates = {};
      
      switch (action) {
        case 'feature':
          updates = { featured: true };
          break;
        case 'unfeature':
          updates = { featured: false };
          break;
        case 'verify':
          updates = { verified: true };
          break;
        case 'unverify':
          updates = { verified: false };
          break;
        case 'publish':
          updates = { public: true };
          break;
        case 'unpublish':
          updates = { public: false };
          break;
        case 'delete':
          const result = await superAdminService.deleteQuotes(selectedQuotes);
          if (result.success) {
            toast({
              title: "Success",
              description: `Deleted ${selectedQuotes.length} quotes`,
            });
            setSelectedQuotes([]);
            loadQuotes();
          }
          return;
      }

      const result = await superAdminService.bulkUpdateQuotes(selectedQuotes, updates);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Updated ${selectedQuotes.length} quotes`,
        });
        setSelectedQuotes([]);
        loadQuotes();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive"
      });
    }
  };

  const filteredQuotes = quotes.filter(quote => 
    quote.quote_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Quotes Manager</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowBulkEdit(true)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Bulk Edit
          </Button>
          <Button onClick={() => setShowAddQuote(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Quote
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search quotes by text or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quotes</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadQuotes}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedQuotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-primary/10 border border-primary/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedQuotes.length} quote{selectedQuotes.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('feature')}>
                <Star className="w-4 h-4 mr-1" />
                Feature
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('verify')}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Verify
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('publish')}>
                <Globe className="w-4 h-4 mr-1" />
                Publish
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quotes Database</CardTitle>
              <CardDescription>
                Manage all quotes in the system ({totalCount} total)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label className="text-sm">Select All</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredQuotes.map((quote) => (
                <div key={quote.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedQuotes.includes(quote.id)}
                      onCheckedChange={() => handleQuoteSelect(quote.id)}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium line-clamp-2">{quote.quote_text}</p>
                          <p className="text-sm text-muted-foreground">— {quote.author_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Quote</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingQuote(quote)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>ID: {quote.id.slice(0, 8)}...</span>
                        <span>Created: {new Date(quote.inserted_at || '').toLocaleDateString()}</span>
                        <span>Source: {quote.source_id || 'No source'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Quote Dialog */}
      <QuoteEditorDialog
        quote={editingQuote}
        isOpen={!!editingQuote || showAddQuote}
        onClose={() => {
          setEditingQuote(null);
          setShowAddQuote(false);
        }}
        onSave={async (updatedQuote) => {
          // Handle save logic here
          await loadQuotes();
          setEditingQuote(null);
          setShowAddQuote(false);
        }}
      />
    </div>
  );
};

// Enhanced Quote Editor Dialog Component
interface QuoteEditorDialogProps {
  quote: DatabaseQuote | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (quote: DatabaseQuote) => Promise<void>;
}

const QuoteEditorDialog: React.FC<QuoteEditorDialogProps> = ({
  quote,
  isOpen,
  onClose,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<DatabaseQuote>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (quote) {
      setFormData(quote);
    } else {
      setFormData({
        quote_text: '',
        author_name: '',
        source_id: '',
        date_original: '',
        quote_context: '',
        seo_keywords: [],
        quote_image_url: ''
      });
    }
  }, [quote]);

  const handleSave = async () => {
    if (!formData.quote_text || !formData.author_name) {
      toast({
        title: "Validation Error",
        description: "Quote text and author are required",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      if (quote?.id) {
        // Update existing quote
        const result = await superAdminService.updateQuote(quote.id, formData);
        if (result.success) {
          toast({
            title: "Success",
            description: "Quote updated successfully",
          });
          await onSave(result.data);
        } else {
          throw new Error(result.error);
        }
      } else {
        // Create new quote
        const result = await superAdminService.createQuote(formData as any);
        if (result.success) {
          toast({
            title: "Success",
            description: "Quote created successfully",
          });
          await onSave(result.data);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save quote",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quote ? 'Edit Quote' : 'Add New Quote'}
          </DialogTitle>
          <DialogDescription>
            {quote ? 'Modify quote details and metadata' : 'Create a new quote entry'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quote-text">Quote Text *</Label>
                <Textarea
                  id="quote-text"
                  value={formData.quote_text || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, quote_text: e.target.value }))}
                  placeholder="Enter the quote text..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Quote author"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source ID</Label>
                <Input
                  id="source"
                  value={formData.source_id || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_id: e.target.value }))}
                  placeholder="Source ID reference"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={formData.date_original || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_original: e.target.value }))}
                  placeholder="Quote date"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="context">Context</Label>
              <Textarea
                id="context"
                value={formData.quote_context || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, quote_context: e.target.value }))}
                placeholder="Additional context for the quote..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-url">Quote Image URL</Label>
              <Input
                id="image-url"
                value={formData.quote_image_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, quote_image_url: e.target.value }))}
                placeholder="URL to quote image"
              />
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <div className="space-y-2">
              <Label>SEO Keywords</Label>
              <Input
                value={formData.seo_keywords?.join(', ') || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  seo_keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                }))}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-slug">SEO Slug</Label>
              <Input
                id="seo-slug"
                value={formData.seo_slug || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_slug: e.target.value }))}
                placeholder="seo-friendly-slug"
              />
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Administrative fields and metadata
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="created-by">Created By (User ID)</Label>
                  <Input
                    id="created-by"
                    value={formData.created_by || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, created_by: e.target.value }))}
                    placeholder="User ID who created this quote"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updated-by">Updated By (User ID)</Label>
                  <Input
                    id="updated-by"
                    value={formData.updated_by || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, updated_by: e.target.value }))}
                    placeholder="User ID who last updated"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Quote
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};