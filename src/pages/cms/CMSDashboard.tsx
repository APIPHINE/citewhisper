
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Image, 
  Settings, 
  Users, 
  Plus, 
  Edit,
  Eye,
  Trash2,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  fetchArticles, 
  fetchPages, 
  fetchMedia, 
  fetchEditSuggestions,
  updateSuggestionStatus
} from '@/services/cmsService';
import type { CMSArticle, CMSPage, CMSMedia, EditSuggestion } from '@/types/cms';

export const CMSDashboard = () => {
  const { user } = useAuth();
  const { userRole, canManageRoles } = useUserRoles();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [media, setMedia] = useState<CMSMedia[]>([]);
  const [suggestions, setSuggestions] = useState<EditSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [articlesData, pagesData, mediaData, suggestionsData] = await Promise.all([
        fetchArticles(),
        fetchPages(),
        fetchMedia(),
        fetchEditSuggestions()
      ]);
      
      setArticles(articlesData);
      setPages(pagesData);
      setMedia(mediaData);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionAction = async (
    suggestionId: string, 
    action: 'approved' | 'rejected',
    notes?: string
  ) => {
    if (!user) return;

    try {
      await updateSuggestionStatus(suggestionId, action, user.id, notes);
      await loadDashboardData();
      toast({
        title: "Success",
        description: `Suggestion ${action} successfully`,
      });
    } catch (error) {
      console.error('Error updating suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to update suggestion",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalArticles: articles.length,
    publishedArticles: articles.filter(a => a.status === 'published').length,
    totalPages: pages.length,
    pendingMedia: media.filter(m => m.approval_status === 'pending').length,
    pendingSuggestions: suggestions.filter(s => s.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 page-padding">
        <div className="page-max-width">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">CMS Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your content, media, and site settings
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/admin/cms/articles/new">
                  <Plus size={16} className="mr-2" />
                  New Article
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/cms/pages/new">
                  <Plus size={16} className="mr-2" />
                  New Page
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm font-medium">Articles</p>
                    <p className="text-2xl font-bold">{stats.totalArticles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm font-medium">Published</p>
                    <p className="text-2xl font-bold">{stats.publishedArticles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Image className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm font-medium">Pages</p>
                    <p className="text-2xl font-bold">{stats.totalPages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="text-orange-600" size={20} />
                  <div>
                    <p className="text-sm font-medium">Pending Media</p>
                    <p className="text-2xl font-bold">{stats.pendingMedia}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-red-600" size={20} />
                  <div>
                    <p className="text-sm font-medium">Suggestions</p>
                    <p className="text-2xl font-bold">{stats.pendingSuggestions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Articles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Articles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {articles.slice(0, 5).map((article) => (
                        <div key={article.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex-1">
                            <h4 className="font-medium truncate">{article.title}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(article.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {suggestions.filter(s => s.status === 'pending').slice(0, 5).map((suggestion) => (
                        <div key={suggestion.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex-1">
                            <h4 className="font-medium">{suggestion.content_type} Edit</h4>
                            <p className="text-sm text-gray-500">
                              {suggestion.suggester?.full_name || 'Anonymous'}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSuggestionAction(suggestion.id, 'approved')}
                              className="text-green-600"
                            >
                              <CheckCircle size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSuggestionAction(suggestion.id, 'rejected')}
                              className="text-red-600"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="articles" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Articles</h2>
                <Button asChild>
                  <Link to="/admin/cms/articles/new">
                    <Plus size={16} className="mr-2" />
                    New Article
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-2">
                {articles.map((article) => (
                  <Card key={article.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{article.title}</h3>
                          <p className="text-sm text-gray-500">
                            By {article.author?.full_name} • {new Date(article.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/admin/cms/articles/${article.slug}/edit`}>
                              <Edit size={14} />
                            </Link>
                          </Button>
                          {article.status === 'published' && (
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/articles/${article.slug}`}>
                                <Eye size={14} />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pages" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Pages</h2>
                <Button asChild>
                  <Link to="/admin/cms/pages/new">
                    <Plus size={16} className="mr-2" />
                    New Page
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-2">
                {pages.map((page) => (
                  <Card key={page.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{page.title}</h3>
                          <p className="text-sm text-gray-500">
                            By {page.author?.full_name} • {new Date(page.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(page.status)}>
                            {page.status}
                          </Badge>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/admin/cms/pages/${page.slug}/edit`}>
                              <Edit size={14} />
                            </Link>
                          </Button>
                          {page.status === 'published' && (
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/pages/${page.slug}`}>
                                <Eye size={14} />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <h2 className="text-xl font-semibold">Edit Suggestions</h2>
              
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{suggestion.content_type} Edit Suggestion</h3>
                          <p className="text-sm text-gray-500">
                            By {suggestion.suggester?.full_name || 'Anonymous'} • {new Date(suggestion.created_at).toLocaleDateString()}
                          </p>
                          {suggestion.reason && (
                            <p className="text-sm text-gray-600 mt-1">{suggestion.reason}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(suggestion.status)}>
                            {suggestion.status}
                          </Badge>
                          {suggestion.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSuggestionAction(suggestion.id, 'approved')}
                                className="text-green-600"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSuggestionAction(suggestion.id, 'rejected')}
                                className="text-red-600"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};
