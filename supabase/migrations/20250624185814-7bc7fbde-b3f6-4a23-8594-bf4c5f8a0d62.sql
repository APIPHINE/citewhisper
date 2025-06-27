
-- Create CMS tables that the code is expecting

-- Create content status enum
CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived');

-- Create media type enum  
CREATE TYPE media_type AS ENUM ('image', 'video', 'audio', 'document', 'other');

-- Create suggestion status enum
CREATE TYPE suggestion_status AS ENUM ('pending', 'approved', 'rejected', 'implemented');

-- Create CMS articles table
CREATE TABLE public.cms_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  status content_status DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CMS pages table  
CREATE TABLE public.cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  template TEXT DEFAULT 'default',
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  status content_status DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title TEXT,
  seo_description TEXT,
  is_homepage BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CMS media table
CREATE TABLE public.cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  media_type media_type NOT NULL,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  approval_status TEXT DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CMS categories table
CREATE TABLE public.cms_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.cms_categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CMS tags table
CREATE TABLE public.cms_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create edit suggestions table
CREATE TABLE public.edit_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID,
  suggested_changes JSONB NOT NULL,
  reason TEXT,
  suggested_by UUID REFERENCES auth.users(id),
  reviewer_id UUID REFERENCES auth.users(id),
  status suggestion_status DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CMS comments table
CREATE TABLE public.cms_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  author_email TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  parent_id UUID REFERENCES public.cms_comments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CMS settings table
CREATE TABLE public.cms_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction tables
CREATE TABLE public.cms_article_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.cms_articles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.cms_categories(id) ON DELETE CASCADE,
  UNIQUE(article_id, category_id)
);

CREATE TABLE public.cms_article_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.cms_articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.cms_tags(id) ON DELETE CASCADE,
  UNIQUE(article_id, tag_id)
);

-- Enable RLS on all tables
ALTER TABLE public.cms_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edit_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_article_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for articles
CREATE POLICY "Everyone can view published articles" ON public.cms_articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all articles" ON public.cms_articles
  FOR ALL USING (public.has_privilege_level(auth.uid(), 'admin'));

-- Create RLS policies for pages  
CREATE POLICY "Everyone can view published pages" ON public.cms_pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all pages" ON public.cms_pages
  FOR ALL USING (public.has_privilege_level(auth.uid(), 'admin'));

-- Create RLS policies for media
CREATE POLICY "Public can view approved media" ON public.cms_media
  FOR SELECT USING (approval_status = 'approved');

CREATE POLICY "Authenticated users can upload media" ON public.cms_media
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can manage their own media" ON public.cms_media
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all media" ON public.cms_media
  FOR ALL USING (public.has_privilege_level(auth.uid(), 'admin'));

-- Create RLS policies for categories and tags
CREATE POLICY "Everyone can view categories" ON public.cms_categories FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage categories" ON public.cms_categories FOR ALL USING (public.has_privilege_level(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view tags" ON public.cms_tags FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage tags" ON public.cms_tags FOR ALL USING (public.has_privilege_level(auth.uid(), 'admin'));

-- Create RLS policies for edit suggestions
CREATE POLICY "Users can view their own suggestions" ON public.edit_suggestions
  FOR SELECT USING (auth.uid() = suggested_by);

CREATE POLICY "Users can create suggestions" ON public.edit_suggestions
  FOR INSERT WITH CHECK (auth.uid() = suggested_by);

CREATE POLICY "Admins can manage all suggestions" ON public.edit_suggestions
  FOR ALL USING (public.has_privilege_level(auth.uid(), 'admin'));

-- Create RLS policies for comments
CREATE POLICY "Everyone can view approved comments" ON public.cms_comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Authenticated users can create comments" ON public.cms_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can manage their own comments" ON public.cms_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all comments" ON public.cms_comments
  FOR ALL USING (public.has_privilege_level(auth.uid(), 'admin'));

-- Create RLS policies for settings
CREATE POLICY "Admins can manage settings" ON public.cms_settings
  FOR ALL USING (public.has_privilege_level(auth.uid(), 'admin'));

-- Create RLS policies for junction tables
CREATE POLICY "Everyone can view article categories" ON public.cms_article_categories FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage article categories" ON public.cms_article_categories FOR ALL USING (public.has_privilege_level(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view article tags" ON public.cms_article_tags FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage article tags" ON public.cms_article_tags FOR ALL USING (public.has_privilege_level(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_cms_articles_status ON public.cms_articles(status);
CREATE INDEX idx_cms_articles_slug ON public.cms_articles(slug);
CREATE INDEX idx_cms_articles_author ON public.cms_articles(author_id);
CREATE INDEX idx_cms_pages_status ON public.cms_pages(status);
CREATE INDEX idx_cms_pages_slug ON public.cms_pages(slug);
CREATE INDEX idx_cms_media_approval ON public.cms_media(approval_status);
CREATE INDEX idx_edit_suggestions_status ON public.edit_suggestions(status);
