
-- SEO management table for per-page meta tags, canonical URLs, etc.
CREATE TABLE public.page_seo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL DEFAULT '',
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  meta_keywords TEXT NOT NULL DEFAULT '',
  canonical_url TEXT NOT NULL DEFAULT '',
  og_title TEXT NOT NULL DEFAULT '',
  og_description TEXT NOT NULL DEFAULT '',
  og_image TEXT NOT NULL DEFAULT '',
  twitter_title TEXT NOT NULL DEFAULT '',
  twitter_description TEXT NOT NULL DEFAULT '',
  twitter_image TEXT NOT NULL DEFAULT '',
  structured_data TEXT NOT NULL DEFAULT '',
  robots TEXT NOT NULL DEFAULT 'index, follow',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read page_seo" ON public.page_seo FOR SELECT USING (true);

-- Admin manage
CREATE POLICY "Admins can manage page_seo" ON public.page_seo FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed default pages
INSERT INTO public.page_seo (page_path, page_name, meta_title, meta_description, canonical_url, robots) VALUES
  ('/', 'Homepage', 'DekhoCampus - India''s #1 AI-Powered College & Career Guide', 'Find your perfect college from 5000+ institutions. Get AI-powered career guidance, compare courses, explore entrance exams.', 'https://dekhocampus.com/', 'index, follow'),
  ('/colleges', 'All Colleges', 'Top Colleges in India 2026 - Rankings, Fees, Admissions | DekhoCampus', 'Explore 13000+ colleges in India. Compare fees, placements, rankings & admissions for engineering, medical, MBA & more.', 'https://dekhocampus.com/colleges', 'index, follow'),
  ('/courses', 'All Courses', 'Top Courses in India 2026 - Fees, Eligibility, Career Scope | DekhoCampus', 'Browse 840+ courses. Compare eligibility, fees, specializations, career prospects & top colleges offering each course.', 'https://dekhocampus.com/courses', 'index, follow'),
  ('/exams', 'All Exams', 'Entrance Exams 2026 - Dates, Eligibility, Syllabus | DekhoCampus', 'Complete guide to 219+ entrance exams. Dates, eligibility, syllabus, preparation tips & counselling details.', 'https://dekhocampus.com/exams', 'index, follow'),
  ('/articles', 'News & Articles', 'Education News & Articles 2026 | DekhoCampus', 'Latest education news, college updates, exam notifications, career guidance articles and student resources.', 'https://dekhocampus.com/articles', 'index, follow'),
  ('/tools', 'Tools', 'Free Education Tools - CGPA Converter, Rank Predictor & More | DekhoCampus', 'Free tools for students - CGPA converter, rank predictor, college comparison, EMI calculator and more.', 'https://dekhocampus.com/tools', 'index, follow'),
  ('/auth', 'Sign In / Sign Up', 'Sign In to DekhoCampus', 'Sign in or create your DekhoCampus account to get personalized college recommendations.', 'https://dekhocampus.com/auth', 'noindex, nofollow');
