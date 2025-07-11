
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, FileText, AlertTriangle, Users, BookOpen, PenTool, Edit, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/context/AuthContext';
import { fetchPageBySlug, updatePage, createPage, fetchArticles } from '@/services/cmsService';
import type { CMSPage, CMSArticle } from '@/types/cms';

const Research = () => {
  const { user } = useAuth();
  const { userRole, loadRole } = useUserRoles();
  const [pageData, setPageData] = useState<CMSPage | null>(null);
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    content: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = userRole === 'super_admin';

  const categories = [
    { name: 'All', icon: FileText, count: articles.length || 12 },
    { name: 'Fake Quotes', icon: AlertTriangle, count: 4 },
    { name: 'Repeat Offenders', icon: Users, count: 3 },
    { name: 'Transcription Logs', icon: PenTool, count: 2 },
    { name: 'Investigations', icon: Search, count: 2 },
    { name: 'Essays', icon: BookOpen, count: 1 }
  ];

  const defaultContent = {
    title: "CiteQuotes Research & Investigations",
    description: "Explore the evidence behind famous words — from verified sources to misattribution breakdowns.",
    comingSoonTitle: "More Research Coming Soon",
    comingSoonDescription: "Our research team is actively investigating famous quotes, debunking myths, and providing verified transcriptions. New investigations are published regularly."
  };

  useEffect(() => {
    loadPageData();
    loadArticles();
    if (user?.id) {
      loadRole(user.id);
    }
  }, [user?.id, loadRole]);

  const loadPageData = async () => {
    try {
      const page = await fetchPageBySlug('research');
      setPageData(page);
      if (page) {
        setEditData({
          title: page.title,
          content: page.content,
          description: page.seo_description || defaultContent.description
        });
      } else {
        setEditData({
          title: defaultContent.title,
          content: JSON.stringify(defaultContent),
          description: defaultContent.description
        });
      }
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadArticles = async () => {
    try {
      const data = await fetchArticles('published');
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      const pageDataToSave = {
        title: editData.title,
        slug: 'research',
        content: editData.content,
        author_id: user.id,
        status: 'published' as const,
        seo_description: editData.description,
        seo_title: editData.title,
        template: 'research'
      };

      if (pageData) {
        await updatePage(pageData.id, pageDataToSave);
      } else {
        await createPage(pageDataToSave);
      }
      
      await loadPageData();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const getCurrentContent = () => {
    try {
      if (pageData?.content) {
        const parsed = JSON.parse(pageData.content);
        return { ...defaultContent, ...parsed };
      }
    } catch (error) {
      console.error('Error parsing page content:', error);
    }
    return defaultContent;
  };

  const content = getCurrentContent();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 page-padding">
        <div className="page-max-width">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width">
        {/* Admin Controls */}
        {isSuperAdmin && (
          <div className="fixed top-24 right-4 z-50 space-y-2">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? 'destructive' : 'default'}
              size="sm"
              className="shadow-lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Page'}
            </Button>
            {isEditing && (
              <Button
                onClick={handleSave}
                size="sm"
                className="shadow-lg block w-full"
              >
                Save Changes
              </Button>
            )}
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="text-4xl md:text-5xl font-bold text-center border-dashed"
                placeholder="Page Title"
              />
              <Textarea
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                className="text-xl text-center border-dashed resize-none"
                placeholder="Page Description"
                rows={2}
              />
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {content.title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {content.description}
              </p>
            </>
          )}
        </motion.div>

        {/* Categories Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={category.name === 'All' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <category.icon size={16} />
                {category.name}
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Latest Research</h2>
            {isSuperAdmin && (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/cms/articles/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Link>
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {articles.length > 0 ? (
              articles.slice(0, 6).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">Research</Badge>
                        <span className="text-sm text-muted-foreground">
                          {Math.ceil((article.excerpt?.length || 300) / 200)} min read
                        </span>
                        {isSuperAdmin && (
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="ml-2"
                          >
                            <Link to={`/admin/cms/articles/${article.id}/edit`}>
                              <Edit className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                      <CardTitle className="text-xl leading-tight">
                        <Link 
                          to={`/articles/${article.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{article.author?.full_name || 'CiteQuotes Team'}</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">No articles published yet.</p>
                {isSuperAdmin && (
                  <Button asChild>
                    <Link to="/admin/cms/articles/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Article
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="pt-6 text-center">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    value={JSON.parse(editData.content || '{}').comingSoonTitle || content.comingSoonTitle}
                    onChange={(e) => {
                      const current = JSON.parse(editData.content || '{}');
                      setEditData(prev => ({ 
                        ...prev, 
                        content: JSON.stringify({ ...current, comingSoonTitle: e.target.value })
                      }));
                    }}
                    className="text-2xl font-bold text-center border-dashed"
                    placeholder="Coming Soon Title"
                  />
                  <Textarea
                    value={JSON.parse(editData.content || '{}').comingSoonDescription || content.comingSoonDescription}
                    onChange={(e) => {
                      const current = JSON.parse(editData.content || '{}');
                      setEditData(prev => ({ 
                        ...prev, 
                        content: JSON.stringify({ ...current, comingSoonDescription: e.target.value })
                      }));
                    }}
                    className="text-center border-dashed resize-none"
                    placeholder="Coming Soon Description"
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-4">{content.comingSoonTitle}</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {content.comingSoonDescription}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Research;
