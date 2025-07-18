
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, User, ArrowLeft, Share2, Edit, Save, X, Settings, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { fetchArticleBySlug, updateArticle, deleteArticle } from '@/services/cmsService';
import { useAuth } from '@/context/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { CommentSystem } from '@/components/cms/CommentSystem';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import type { CMSArticle } from '@/types/cms';

const PublicArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRole } = useUserRoles();
  const { toast } = useToast();
  const [article, setArticle] = useState<CMSArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<CMSArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = userRole === 'super_admin';

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const data = await fetchArticleBySlug(slug!);
      
      if (!data || data.status !== 'published') {
        setNotFound(true);
      } else {
        setArticle(data);
        // Update view count here in a real implementation
      }
    } catch (error) {
      console.error('Error loading article:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Article link copied to clipboard",
      });
    }
  };

  const handleSave = async () => {
    if (!editingArticle || !article) return;

    try {
      setSaving(true);
      await updateArticle(article.id, editingArticle);
      setArticle(editingArticle);
      setEditMode(false);
      setEditingArticle(null);
      
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!article) return;

    try {
      const newStatus = article.status === 'published' ? 'draft' : 'published';
      await updateArticle(article.id, { 
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : undefined
      });
      
      setArticle({ ...article, status: newStatus });
      
      toast({
        title: "Success",
        description: `Article ${newStatus === 'published' ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteArticle = async () => {
    if (!article) return;

    if (!confirm(`Are you sure you want to delete "${article.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteArticle(article.id);
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
      navigate('/articles');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    }
  };

  const renderContent = (content: string) => {
    // Simple markdown to HTML conversion
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-4 mt-6">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 mt-8">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto my-4 rounded-lg" />')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/^1\. (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, '<br>');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 page-padding">
        <div className="page-max-width">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen pt-36 pb-20 page-padding">
        <div className="page-max-width text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or isn't published yet.
          </p>
          <Button asChild>
            <Link to="/articles">
              <ArrowLeft size={16} className="mr-2" />
              Back to Articles
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Article Header */}
          <div className="mb-8">
            <Button variant="outline" asChild className="mb-6">
              <Link to="/articles">
                <ArrowLeft size={16} className="mr-2" />
                Back to Articles
              </Link>
            </Button>

            {editMode && editingArticle ? (
              <div className="space-y-4 mb-6">
                <Input
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="text-4xl font-bold border-none p-0 text-4xl"
                  placeholder="Article title..."
                />
                <Textarea
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  className="text-xl text-muted-foreground border-dashed"
                  placeholder="Article excerpt..."
                  rows={2}
                />
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
                {article.excerpt && (
                  <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
                )}
              </>
            )}

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  {article.author?.full_name || 'Anonymous'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(article.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
                
                {isSuperAdmin && (
                  <div className="flex gap-2">
                    <Button 
                      variant={editMode ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => {
                        if (editMode) {
                          setEditMode(false);
                          setEditingArticle(null);
                        } else {
                          setEditMode(true);
                          setEditingArticle({ ...article });
                        }
                      }}
                    >
                      {editMode ? <X size={16} className="mr-2" /> : <Edit size={16} className="mr-2" />}
                      {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                    {editMode && (
                      <Button size="sm" onClick={handleSave} disabled={saving}>
                        <Save size={16} className="mr-2" />
                        Save
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {article.categories && article.categories.length > 0 && (
              <div className="flex gap-2 mb-6">
                {article.categories.map((category: any) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}

            {article.featured_image_url && (
              <div className="mb-8">
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Article Content */}
          <Card>
            <CardContent className="p-8">
              {editMode && editingArticle ? (
                <RichTextEditor
                  value={editingArticle.content}
                  onChange={(content) => setEditingArticle({ ...editingArticle, content })}
                  placeholder="Article content..."
                />
              ) : (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: `<p class="mb-4">${renderContent(article.content)}</p>` 
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Super Admin Controls */}
          {isSuperAdmin && !editMode && (
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={handleTogglePublish}>
                    {article.status === 'published' ? (
                      <>
                        <ToggleRight size={16} className="mr-2" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={16} className="mr-2" />
                        Publish
                      </>
                    )}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteArticle}>
                    <Trash2 size={16} className="mr-2" />
                    Delete Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Article Footer */}
          <div className="pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {article.tags && article.tags.length > 0 && (
                  <div className="flex gap-2">
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    {article.tags.map((tag: any) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Views: {article.view_count}
              </div>
            </div>
          </div>

          {/* Comment System */}
          <CommentSystem contentType="article" contentId={article.id} />
        </motion.article>
      </div>
    </div>
  );
};

export default PublicArticle;
