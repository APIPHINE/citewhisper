import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { createArticle } from '@/services/cmsService';
import { useAuth } from '@/context/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import type { CMSArticle, ContentStatus } from '@/types/cms';

const NewArticle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRole } = useUserRoles();
  const { toast } = useToast();

  const [article, setArticle] = useState<Partial<CMSArticle>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    seo_title: '',
    seo_description: '',
    seo_keywords: [],
    featured_image_url: ''
  });

  const [loading, setLoading] = useState(false);

  const isSuperAdmin = userRole === 'super_admin';

  // Redirect if not super admin
  if (!isSuperAdmin) {
    navigate('/admin');
    return null;
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setArticle(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSave = async (status: ContentStatus = 'draft') => {
    if (!article.title || !article.content) {
      toast({
        title: "Error",
        description: "Please fill in the title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const articleData = {
        ...article,
        status,
        author_id: user?.id || '',
        published_at: status === 'published' ? new Date().toISOString() : undefined
      };

      const newArticle = await createArticle(articleData);
      
      toast({
        title: "Success",
        description: `Article ${status === 'published' ? 'published' : 'saved as draft'}`,
      });
      
      navigate(`/admin/cms/articles`);
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/admin/cms/articles')}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Articles
              </Button>
                <h1 className="text-2xl font-bold">Create New Article</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave('draft')}
                disabled={loading}
              >
                <Save size={16} className="mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave('published')}
                disabled={loading}
              >
                <Eye size={16} className="mr-2" />
                Publish
              </Button>
            </div>
          </div>

          {/* Article Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Article Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={article.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter article title..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={article.slug}
                      onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="article-url-slug"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={article.excerpt}
                      onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the article..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Content</Label>
                    <div className="mt-1">
                      <RichTextEditor
                        value={article.content || ''}
                        onChange={(content) => setArticle(prev => ({ ...prev, content }))}
                        placeholder="Start writing your article..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={article.status}
                      onValueChange={(value: ContentStatus) => setArticle(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="featured_image">Featured Image URL</Label>
                    <Input
                      id="featured_image"
                      value={article.featured_image_url}
                      onChange={(e) => setArticle(prev => ({ ...prev, featured_image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={article.seo_title}
                      onChange={(e) => setArticle(prev => ({ ...prev, seo_title: e.target.value }))}
                      placeholder="SEO optimized title..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                      id="seo_description"
                      value={article.seo_description}
                      onChange={(e) => setArticle(prev => ({ ...prev, seo_description: e.target.value }))}
                      placeholder="SEO description..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="seo_keywords">SEO Keywords (comma-separated)</Label>
                    <Input
                      id="seo_keywords"
                      value={article.seo_keywords?.join(', ') || ''}
                      onChange={(e) => setArticle(prev => ({ 
                        ...prev, 
                        seo_keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                      }))}
                      placeholder="keyword1, keyword2, keyword3"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArticle;