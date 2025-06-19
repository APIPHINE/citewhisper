import React from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Article } from '../../components/BlogFeed';
import articlesData from '../../../data/articles.json';
import { Badge } from '../../components/ui/badge'; // Corrected path

const allArticles: Article[] = articlesData as Article[];

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = allArticles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 text-center">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <p className="text-muted-foreground">Sorry, we couldn't find the article you were looking for.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <article>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{article.title}</h1>

        {article.previewImage && (
          <img
            src={article.previewImage}
            alt={article.title}
            className="w-full h-auto object-cover rounded-lg my-6 shadow-md"
            style={{ maxHeight: '400px' }}
          />
        )}

        <div className="prose dark:prose-invert max-w-none mt-6 text-foreground">
          {/* Render HTML if fullContent contains it, otherwise wrap in <p> or handle as plain text */}
          {/* For now, assuming plain text that benefits from prose styling */}
          <p>{article.fullContent}</p>
        </div>

        <div className="mt-8 pt-4 border-t border-border">
          <h4 className="text-lg font-semibold mb-3 text-foreground">Categories:</h4>
          {article.categoryTags.map(tag => (
            <Badge key={tag} variant="secondary" className="mr-2 mb-2">{tag}</Badge>
          ))}
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;
