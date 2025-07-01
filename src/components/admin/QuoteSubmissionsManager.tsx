
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuoteSubmissions } from '@/hooks/useQuoteSubmissions';
import { format } from 'date-fns';
import type { QuoteSubmission } from '@/services/quoteSubmissionService';

const QuoteSubmissionsManager = () => {
  const { submissions, loading, loadSubmissions, processSubmission, checkDuplicates } = useQuoteSubmissions();
  const [selectedSubmission, setSelectedSubmission] = useState<QuoteSubmission | null>(null);
  const [processingNotes, setProcessingNotes] = useState('');
  const [duplicateQuotes, setDuplicateQuotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleViewSubmission = async (submission: QuoteSubmission) => {
    setSelectedSubmission(submission);
    setProcessingNotes(submission.processing_notes || '');
    
    // Check for duplicates if not already done
    if (!submission.duplicate_check_performed) {
      const duplicates = await checkDuplicates(submission.id);
      setDuplicateQuotes(duplicates);
    }
  };

  const handleProcessSubmission = async (approve: boolean) => {
    if (!selectedSubmission) return;
    
    await processSubmission(selectedSubmission.id, approve, processingNotes);
    setSelectedSubmission(null);
    setProcessingNotes('');
    setDuplicateQuotes([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubmissions = (status: string) => {
    return submissions.filter(submission => submission.status === status);
  };

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    total: submissions.length
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2" />
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quote Submissions</h2>
        <p className="text-muted-foreground">
          Manage quote submissions from external applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="text-yellow-600" size={20} />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="text-red-600" size={20} />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="text-blue-600" size={20} />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <SubmissionsList 
            submissions={filteredSubmissions('pending')} 
            onViewSubmission={handleViewSubmission}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <SubmissionsList 
            submissions={filteredSubmissions('approved')} 
            onViewSubmission={handleViewSubmission}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <SubmissionsList 
            submissions={filteredSubmissions('rejected')} 
            onViewSubmission={handleViewSubmission}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <SubmissionsList 
            submissions={submissions} 
            onViewSubmission={handleViewSubmission}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
      </Tabs>

      {/* Submission Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Quote Submission</DialogTitle>
            <DialogDescription>
              Review and process this quote submission from {selectedSubmission?.source_app}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Quote Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quote Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Quote Text</label>
                    <p className="mt-1 p-3 bg-gray-50 rounded border italic">
                      "{selectedSubmission.quote_text}"
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Author</label>
                      <p className="mt-1">{selectedSubmission.author_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Source</label>
                      <p className="mt-1">{selectedSubmission.source_title}</p>
                    </div>
                  </div>

                  {selectedSubmission.source_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <p className="mt-1">{selectedSubmission.source_date}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Duplicate Check */}
              {selectedSubmission.potential_duplicate_ids && selectedSubmission.potential_duplicate_ids.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="text-yellow-600" size={20} />
                      Potential Duplicates Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Found {selectedSubmission.potential_duplicate_ids.length} potential duplicate(s) in the database.
                    </p>
                    {duplicateQuotes.map((quote, index) => (
                      <div key={quote.id} className="p-3 border rounded mb-2">
                        <p className="text-sm italic">"{quote.quote_text}"</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          by {quote.author_name} • Added {format(new Date(quote.inserted_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Processing Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700">Processing Notes</label>
                <Textarea
                  value={processingNotes}
                  onChange={(e) => setProcessingNotes(e.target.value)}
                  placeholder="Add notes about this submission..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Actions */}
              {selectedSubmission.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleProcessSubmission(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Approve & Add to Database
                  </Button>
                  <Button 
                    onClick={() => handleProcessSubmission(false)}
                    variant="destructive"
                  >
                    <XCircle size={16} className="mr-2" />
                    Reject Submission
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface SubmissionsListProps {
  submissions: QuoteSubmission[];
  onViewSubmission: (submission: QuoteSubmission) => void;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({
  submissions,
  onViewSubmission,
  getStatusIcon,
  getStatusColor
}) => {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No submissions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission, index) => (
        <motion.div
          key={submission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(submission.status)}
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                    <Badge variant="outline">
                      {submission.source_app.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <h3 className="font-medium text-sm mb-1 truncate">
                    "{submission.quote_text}"
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    by {submission.author_name} • {submission.source_title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted {format(new Date(submission.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                  
                  {submission.potential_duplicate_ids && submission.potential_duplicate_ids.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle size={14} className="text-yellow-600" />
                      <span className="text-xs text-yellow-600">
                        {submission.potential_duplicate_ids.length} potential duplicate(s)
                      </span>
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewSubmission(submission)}
                >
                  <Eye size={14} className="mr-1" />
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuoteSubmissionsManager;
