
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Calendar, User, Eye, Plus, Edit, ToggleLeft, ToggleRight, Trash2, Settings } from 'lucide-react';
import { fetchArticles, fetchCategories, updateArticle, deleteArticle } from '@/services/cmsService';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/context/AuthContext';
import type { CMSArticle, CMSCategory } from '@/types/cms';

const ArticlesList = () => {
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { userRole } = useUserRoles();
  const { toast } = useToast();

  const isSuperAdmin = userRole === 'super_admin';

  useEffect(() => {
    loadData();
  }, [isSuperAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load all articles for super admin, only published for others
      const articlesData = await fetchArticles(isSuperAdmin ? undefined : 'published');
      const categoriesData = await fetchCategories();
      setArticles(articlesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (article: CMSArticle) => {
    try {
      const newStatus = article.status === 'published' ? 'draft' : 'published';
      await updateArticle(article.id, { 
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : undefined
      });
      
      toast({
        title: "Success",
        description: `Article ${newStatus === 'published' ? 'published' : 'unpublished'}`,
      });
      
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteArticle = async (article: CMSArticle) => {
    if (!confirm(`Are you sure you want to delete "${article.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteArticle(article.id);
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    if (selectedArticles.size === 0) return;

    const confirmMessage = action === 'delete' 
      ? `Are you sure you want to delete ${selectedArticles.size} articles? This action cannot be undone.`
      : `Are you sure you want to ${action} ${selectedArticles.size} articles?`;
    
    if (!confirm(confirmMessage)) return;

    try {
      const promises = Array.from(selectedArticles).map(articleId => {
        if (action === 'delete') {
          return deleteArticle(articleId);
        } else {
          const status = action === 'publish' ? 'published' : 'draft';
          return updateArticle(articleId, { 
            status,
            published_at: status === 'published' ? new Date().toISOString() : undefined
          });
        }
      });

      await Promise.all(promises);
      
      toast({
        title: "Success",
        description: `${selectedArticles.size} articles ${action}ed successfully`,
      });
      
      setSelectedArticles(new Set());
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} articles`,
        variant: "destructive",
      });
    }
  };

  const toggleArticleSelection = (articleId: string) => {
    const newSelection = new Set(selectedArticles);
    if (newSelection.has(articleId)) {
      newSelection.delete(articleId);
    } else {
      newSelection.add(articleId);
    }
    setSelectedArticles(newSelection);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 page-padding">
        <div className="page-max-width">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 pb-20 page-padding">
      <div className="page-max-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">Articles</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Explore our collection of articles on quote verification, research methods, and historical accuracy.
                </p>
              </div>
              
              {isSuperAdmin && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={editMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    <Settings size={16} className="mr-2" />
                    {editMode ? "Exit Edit" : "Edit Mode"}
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/admin/cms/articles/new">
                      <Plus size={16} className="mr-2" />
                      New Article
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Search and Bulk Actions */}
          <div className="space-y-4">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Bulk Actions */}
            {isSuperAdmin && editMode && selectedArticles.size > 0 && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    {selectedArticles.size} articles selected
                  </span>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('publish')}>
                    Publish
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('unpublish')}>
                    Unpublish
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                    Delete
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedArticles(new Set())}>
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`h-full hover:shadow-lg transition-shadow relative ${
                  isSuperAdmin && editMode && selectedArticles.has(article.id) ? 'ring-2 ring-primary' : ''
                }`}>
                  {/* Super Admin Selection Checkbox */}
                  {isSuperAdmin && editMode && (
                    <div className="absolute top-3 right-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedArticles.has(article.id)}
                        onChange={() => toggleArticleSelection(article.id)}
                        className="w-4 h-4 text-primary bg-white border-2 border-gray-300 rounded focus:ring-primary"
                      />
                    </div>
                  )}

                  {/* Status Badge for Super Admin */}
                  {isSuperAdmin && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                        {article.status}
                      </Badge>
                    </div>
                  )}

                  {article.featured_image_url && (
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">
                        <Link
                          to={`/articles/${article.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </CardTitle>
                      {article.categories && article.categories.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {article.categories[0].name}
                        </Badge>
                      )}
                    </div>
                    
                    {article.excerpt && (
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {article.author?.full_name || 'Anonymous'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(article.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        {article.view_count}
                      </div>
                    </div>

                    {/* Super Admin Action Buttons */}
                    {isSuperAdmin && editMode ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline" className="flex-1">
                            <Link to={`/admin/cms/articles/${article.slug}/edit`}>
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleTogglePublish(article)}
                            className="flex-1"
                          >
                            {article.status === 'published' ? (
                              <>
                                <ToggleRight size={14} className="mr-1" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={14} className="mr-1" />
                                Publish
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline" className="flex-1">
                            <Link to={`/articles/${article.slug}`}>
                              <Eye size={14} className="mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteArticle(article)}
                            className="flex-1"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to={`/articles/${article.slug}`}>
                          Read Article
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredArticles.length === 0 && !loading && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search term.' : 'No articles have been published yet.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ArticlesList;
