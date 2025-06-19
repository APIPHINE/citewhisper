
import { motion } from 'framer-motion';
import { Search, FileText, AlertTriangle, Users, BookOpen, PenTool } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Research = () => {
  const categories = [
    { name: 'All', icon: FileText, count: 12 },
    { name: 'Fake Quotes', icon: AlertTriangle, count: 4 },
    { name: 'Repeat Offenders', icon: Users, count: 3 },
    { name: 'Transcription Logs', icon: PenTool, count: 2 },
    { name: 'Investigations', icon: Search, count: 2 },
    { name: 'Essays', icon: BookOpen, count: 1 }
  ];

  const sampleArticles = [
    {
      id: 1,
      title: "The Gandhi Quote That Never Was",
      category: "Fake Quotes",
      excerpt: "An investigation into the misattributed quote 'Be the change you wish to see in the world' and its actual origins.",
      author: "CiteQuotes Research Team",
      date: "2024-01-15",
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "Mark Twain: The Internet's Favorite Misattribution Target",
      category: "Repeat Offenders",
      excerpt: "Why Mark Twain gets credited with quotes he never said, and how to spot the fakes.",
      author: "CiteQuotes Research Team",
      date: "2024-01-10",
      readTime: "12 min read"
    },
    {
      id: 3,
      title: "Transcription: Churchill's 1940 Parliamentary Speech",
      category: "Transcription Logs",
      excerpt: "Complete verified transcription of Churchill's 'We Shall Fight' speech with original source documentation.",
      author: "CiteQuotes Research Team",
      date: "2024-01-05",
      readTime: "15 min read"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            CiteQuotes Research & Investigations
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the evidence behind famous words — from verified sources to misattribution breakdowns.
          </p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sampleArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <span className="text-sm text-muted-foreground">{article.readTime}</span>
                    </div>
                    <CardTitle className="text-xl leading-tight">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{article.author}</span>
                      <span>{article.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
              <h3 className="text-2xl font-bold mb-4">More Research Coming Soon</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our research team is actively investigating famous quotes, debunking myths, and providing 
                verified transcriptions. New investigations are published regularly.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Research;
