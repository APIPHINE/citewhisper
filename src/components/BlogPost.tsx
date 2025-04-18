
import React from 'react';

interface BlogPostProps {
  title: string;
  date: string;
  content: React.ReactNode;
}

const BlogPost = ({ title, date, content }: BlogPostProps) => {
  return (
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <time className="text-muted-foreground block mb-8">{date}</time>
        <div className="prose dark:prose-invert max-w-none">
          {content}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
