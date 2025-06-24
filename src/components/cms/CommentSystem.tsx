
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Reply, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { CMSComment } from '@/types/cms';

interface CommentSystemProps {
  contentType: string;
  contentId: string;
}

export const CommentSystem: React.FC<CommentSystemProps> = ({ contentType, contentId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<CMSComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState({
    content: '',
    author_name: '',
    author_email: ''
  });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadComments();
  }, [contentType, contentId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_comments')
        .select(`
          *,
          author:profiles!cms_comments_author_id_fkey(full_name)
        `)
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;

    try {
      setSubmitting(true);
      
      const commentData = {
        content_type: contentType,
        content_id: contentId,
        content: newComment.content,
        author_id: user?.id,
        author_name: user ? undefined : newComment.author_name,
        author_email: user ? undefined : newComment.author_email,
        status: 'pending'
      };

      const { error } = await supabase
        .from('cms_comments')
        .insert(commentData);

      if (error) throw error;

      toast({
        title: "Comment Submitted",
        description: "Your comment has been submitted for review.",
      });

      setNewComment({ content: '', author_name: '', author_email: '' });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to submit comment",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      
      const replyData = {
        content_type: contentType,
        content_id: contentId,
        content: replyContent,
        author_id: user?.id,
        parent_id: parentId,
        status: 'pending'
      };

      const { error } = await supabase
        .from('cms_comments')
        .insert(replyData);

      if (error) throw error;

      toast({
        title: "Reply Submitted",
        description: "Your reply has been submitted for review.",
      });

      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Error",
        description: "Failed to submit reply",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const organizeComments = (comments: CMSComment[]) => {
    const topLevel = comments.filter(c => !c.parent_id);
    const replies = comments.filter(c => c.parent_id);
    
    return topLevel.map(comment => ({
      ...comment,
      replies: replies.filter(r => r.parent_id === comment.id)
    }));
  };

  const organizedComments = organizeComments(comments);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle size={20} />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle size={20} />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <Label htmlFor="comment-content">Leave a Comment</Label>
            <Textarea
              id="comment-content"
              value={newComment.content}
              onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your thoughts..."
              required
            />
          </div>
          
          {!user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author-name">Name</Label>
                <Input
                  id="author-name"
                  value={newComment.author_name}
                  onChange={(e) => setNewComment(prev => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="author-email">Email</Label>
                <Input
                  id="author-email"
                  type="email"
                  value={newComment.author_email}
                  onChange={(e) => setNewComment(prev => ({ ...prev, author_email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          )}
          
          <Button type="submit" disabled={submitting}>
            <Send size={16} className="mr-2" />
            {submitting ? 'Submitting...' : 'Submit Comment'}
          </Button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {organizedComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {(comment.author?.full_name || comment.author_name || 'A')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {comment.author?.full_name || comment.author_name || 'Anonymous'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(comment.id)}
                    >
                      <Reply size={14} className="mr-1" />
                      Reply
                    </Button>
                  )}
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="ml-11 space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleReply(comment.id)}
                      disabled={submitting || !replyContent.trim()}
                    >
                      Submit Reply
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 p-3 bg-gray-100 rounded">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {(reply.author?.full_name || reply.author_name || 'A')[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {reply.author?.full_name || reply.author_name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </CardContent>
    </Card>
  );
};
