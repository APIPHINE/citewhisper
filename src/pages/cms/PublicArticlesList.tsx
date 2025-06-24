
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, User, Eye, FileText, AlertTriangle, Users, BookOpen, PenTool } from 'lucide-react';
import { fetchArticles } from '@/services/cmsService';
import type { CMSArticle } from '@/types/cms';

const PublicArticlesList = () => {
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample categories for now - these will come from the CMS eventually
  const categories = [
    { name: 'All', icon: FileText, count: 12 },
    { name: 'Research', icon: Search, count: 4 },
    { name: 'Investigations', icon: AlertTriangle, count: 3 },
    { name: 'Methodology', icon: BookOpen, count: 2 },
    { name: 'Case Studies', icon: Users, count: 2 },
    { name: 'Transcriptions', icon: PenTool, count: 1 }
  ];

  // Sample articles that represent the type of content from Research page
  const sampleArticles = [
    {
      id: 'sample-1',
      title: "The Gandhi Quote That Never Was",
      slug: "gandhi-quote-never-was",
      excerpt: "An investigation into the misattributed quote 'Be the change you wish to see in the world' and its actual origins.",
      author: { full_name: 'CiteQuotes Research Team' },
      created_at: '2024-01-15T00:00:00Z',
      view_count: 1250,
      featured_image_url: null,
      status: 'published' as const,
      content: '',
      author_id: '',
      updated_at: '2024-01-15T00:00:00Z',
      category: 'Investigations'
    },
    {
      id: 'sample-2',
      title: "Mark Twain: The Internet's Favorite Misattribution Target",
      slug: "mark-twain-misattribution-target",
      excerpt: "Why Mark Twain gets credited with quotes he never said, and how to spot the fakes.",
      author: { full_name: 'CiteQuotes Research Team' },
      created_at: '2024-01-10T00:00:00Z',
      view_count: 987,
      featured_image_url: null,
      status: 'published' as const,
      content: '',
      author_id: '',
      updated_at: '2024-01-10T00:00:00Z',
      category: 'Research'
    },
    {
      id: 'sample-3',
      title: "Why Most Quotes Don't Have Proper Citations",
      slug: "why-quotes-lack-proper-citations",
      excerpt: "A deep dive into the citation crisis in quote sharing and why it matters for truth and accountability.",
      author: { full_name: 'CiteQuotes Research Team' },
      created_at: '2024-01-08T00:00:00Z',
      view_count: 2150,
      featured_image_url: null,
      status: 'published' as const,
      content: '',
      author_id: '',
      updated_at: '2024-01-08T00:00:00Z',
      category: 'Methodology'
    }
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await fetchArticles('published');
      // Combine real articles with sample articles for now
      setArticles([...sampleArticles, ...data]);
    } catch (error) {
      console.error('Error loading articles:', error);
      // Fallback to sample articles if CMS fails
      setArticles(sampleArticles);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           (article as any).category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 page-padding">
        <div className="page-max-width">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
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
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Research & Articles</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover insights about quote verification, citation methodology, investigations into misattributions, and the importance of accurate attribution.
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => setSelectedCategory(category.name)}
              >
                <category.icon size={16} />
                {category.name}
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {article.featured_image_url && (
                      <div className="aspect-video bg-gray-100 rounded mb-4 overflow-hidden">
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{(article as any).category || 'Article'}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {Math.ceil((article.excerpt?.length || 300) / 200)} min read
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link 
                        to={`/articles/${article.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                    </CardTitle>
                    {article.excerpt && (
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                        {article.view_count || 0}
                      </div>
                    </div>
                    
                    <Button asChild className="w-full">
                      <Link to={`/articles/${article.slug}`}>
                        Read Article
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No articles found matching your search.' : 'No articles available yet.'}
              </p>
            </div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <Card className="bg-secondary/30 border-dashed">
              <CardContent className="pt-6 text-center">
                <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our research team is actively investigating famous quotes, debunking myths, and providing 
                  verified transcriptions. New investigations and methodology articles are published regularly.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicArticlesList;
