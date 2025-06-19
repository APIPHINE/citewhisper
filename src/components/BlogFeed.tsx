import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';

export interface Article {
  slug: string;
  title: string;
  previewImage: string;
  excerpt: string;
  categoryTags: string[];
  fullContent: string;
}

interface BlogFeedProps {
  articles: Article[];
}

const BlogFeed: React.FC<BlogFeedProps> = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <Card key={article.slug} className="flex flex-col">
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            {article.previewImage && (
              <img
                src={article.previewImage}
                alt={article.title}
                className="w-full h-auto object-cover rounded-md mb-4"
                style={{ maxHeight: '200px' }}
              />
            )}
            <CardDescription>{article.excerpt}</CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <div className="mb-4">
              {article.categoryTags.map(tag => (
                <Badge key={tag} variant="outline" className="mr-2 mb-2">{tag}</Badge>
              ))}
            </div>
            <Link to={`/research/${article.slug}`} className="text-sm font-medium text-primary hover:underline">
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BlogFeed;
