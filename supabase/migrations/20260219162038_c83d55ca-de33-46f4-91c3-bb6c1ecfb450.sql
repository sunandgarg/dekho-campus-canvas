
-- Add campus_tour_video_url column to colleges table
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS campus_tour_video_url text NOT NULL DEFAULT '';
