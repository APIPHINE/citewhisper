
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, ArrowLeft, Image } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { MediaLibrary } from './MediaLibrary';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  createArticle, 
  updateArticle, 
  fetchArticleBySlug,
  createPage,
  updatePage,
  fetchPageBySlug,
  fetchCategories,
  fetchTags 
} from '@/services/cmsService';
import { useAuth } from '@/context/AuthContext';
import type { CMSArticle, CMSPage, ContentStatus } from '@/types/cms';

interface ContentEditorProps {
  contentType: 'article' | 'page';
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ contentType }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<Partial<CMSArticle | CMSPage>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    seo_title: '',
    seo_description: '',
    seo_keywords: []
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const isEditing = Boolean(slug);

  useEffect(() => {
    if (isEditing && slug) {
      loadContent();
    }
    loadMetadata();
  }, [slug, contentType]);

  const loadContent = async () => {
    try {
      setLoading(true);
      let data;
      
      if (contentType === 'article') {
        data = await fetchArticleBySlug(slug!);
      } else {
        data = await fetchPageBySlug(slug!);
      }
      
      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMetadata = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        fetchCategories(),
        fetchTags()
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setContent(prev => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug
    }));
  };

  const handleSave = async (status: ContentStatus = 'draft') => {
    if (!user) return;

    try {
      setSaving(true);
      
      const contentData = {
        ...content,
        status,
        author_id: user.id,
        published_at: status === 'published' ? new Date().toISOString() : undefined
      };

      let result;
      if (isEditing) {
        if (contentType === 'article') {
          result = await updateArticle(content.id!, contentData);
        } else {
          result = await updatePage(content.id!, contentData);
        }
      } else {
        if (contentType === 'article') {
          result = await createArticle(contentData);
        } else {
          result = await createPage(contentData);
        }
      }

      toast({
        title: "Success",
        description: `${contentType} ${isEditing ? 'updated' : 'created'} successfully`,
      });

      if (!isEditing) {
        navigate(`/admin/cms/${contentType}s/${result.slug}/edit`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (media: any) => {
    if (contentType === 'article') {
      setContent(prev => ({
        ...prev,
        featured_image_url: media.file_path
      }));
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/cms')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to CMS
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit' : 'Create'} {contentType === 'article' ? 'Article' : 'Page'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
            {content.status}
          </Badge>
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            <Save size={16} className="mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave('published')}
            disabled={saving}
          >
            <Eye size={16} className="mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={content.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter title..."
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={content.slug || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                />
              </div>

              {contentType === 'article' && (
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={(content as CMSArticle).excerpt || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description..."
                  />
                </div>
              )}

              <div>
                <Label>Content</Label>
                <RichTextEditor
                  value={content.content || ''}
                  onChange={(value) => setContent(prev => ({ ...prev, content: value }))}
                  placeholder="Start writing your content..."
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo-title">SEO Title</Label>
                <Input
                  id="seo-title"
                  value={content.seo_title || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, seo_title: e.target.value }))}
                  placeholder="SEO optimized title..."
                />
              </div>

              <div>
                <Label htmlFor="seo-description">SEO Description</Label>
                <Textarea
                  id="seo-description"
                  value={content.seo_description || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, seo_description: e.target.value }))}
                  placeholder="SEO meta description..."
                />
              </div>

              <div>
                <Label htmlFor="seo-keywords">SEO Keywords</Label>
                <Input
                  id="seo-keywords"
                  value={content.seo_keywords?.join(', ') || ''}
                  onChange={(e) => setContent(prev => ({ 
                    ...prev, 
                    seo_keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                  }))}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={content.status}
                  onValueChange={(value: ContentStatus) => setContent(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
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
            </CardContent>
          </Card>

          {/* Featured Image */}
          {contentType === 'article' && (
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(content as CMSArticle).featured_image_url && (
                    <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                      <Image size={32} className="text-gray-400" />
                    </div>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Image size={16} className="mr-2" />
                        Select Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Select Featured Image</DialogTitle>
                      </DialogHeader>
                      <MediaLibrary onSelectMedia={handleMediaSelect} allowUpload={true} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
