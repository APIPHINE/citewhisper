import React from 'react';
import BlogFeed, { Article } from '../../components/BlogFeed'; // Adjusted import path
import articlesData from '../../../data/articles.json';

const articles: Article[] = articlesData as Article[];

const ResearchIndexPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Research Articles</h1>
      <BlogFeed articles={articles} />
    </div>
  );
};

export default ResearchIndexPage;
