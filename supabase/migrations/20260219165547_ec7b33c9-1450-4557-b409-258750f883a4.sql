
-- College-specific dynamic content: news, events, announcements
CREATE TABLE public.college_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_slug TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'news', -- news, event, announcement
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT NULL,
  event_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- for events
  link_url TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.college_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read college_updates"
ON public.college_updates FOR SELECT USING (true);

CREATE POLICY "Admins can manage college_updates"
ON public.college_updates FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_college_updates_updated_at
BEFORE UPDATE ON public.college_updates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
