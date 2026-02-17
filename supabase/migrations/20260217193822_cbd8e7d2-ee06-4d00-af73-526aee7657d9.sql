
-- Drop overly permissive ALL policies on content tables
DROP POLICY IF EXISTS "Public manage ads" ON public.ads;
DROP POLICY IF EXISTS "Public manage articles" ON public.articles;
DROP POLICY IF EXISTS "Public manage colleges" ON public.colleges;
DROP POLICY IF EXISTS "Public manage courses" ON public.courses;
DROP POLICY IF EXISTS "Public manage exams" ON public.exams;
DROP POLICY IF EXISTS "Public manage faqs" ON public.faqs;
DROP POLICY IF EXISTS "Public manage featured colleges" ON public.featured_colleges;
DROP POLICY IF EXISTS "Public manage hero_banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Public manage popular_places" ON public.popular_places;
DROP POLICY IF EXISTS "Public manage trusted_partners" ON public.trusted_partners;
DROP POLICY IF EXISTS "Public manage leads" ON public.leads;

-- Ads: admin write
CREATE POLICY "Admins can manage ads" ON public.ads FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Articles: admin write
CREATE POLICY "Admins can manage articles" ON public.articles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Colleges: admin write
CREATE POLICY "Admins can manage colleges" ON public.colleges FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Courses: admin write
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Exams: admin write
CREATE POLICY "Admins can manage exams" ON public.exams FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- FAQs: admin write
CREATE POLICY "Admins can manage faqs" ON public.faqs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Featured colleges: admin write
CREATE POLICY "Admins can manage featured_colleges" ON public.featured_colleges FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Hero banners: admin write
CREATE POLICY "Admins can manage hero_banners" ON public.hero_banners FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Popular places: admin write
CREATE POLICY "Admins can manage popular_places" ON public.popular_places FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trusted partners: admin write
CREATE POLICY "Admins can manage trusted_partners" ON public.trusted_partners FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Leads: anyone can insert (for lead capture), but only admins can update/delete/view all
CREATE POLICY "Anyone can submit leads" ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage leads" ON public.leads FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
