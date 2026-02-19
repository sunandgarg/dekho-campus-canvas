
-- Enable trigram extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a unified fuzzy search function across colleges, courses, exams
CREATE OR REPLACE FUNCTION public.fuzzy_search(search_query text, result_limit integer DEFAULT 9)
RETURNS TABLE(
  type text,
  name text,
  slug text,
  location text,
  logo text,
  similarity_score real
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  q text := lower(trim(search_query));
BEGIN
  RETURN QUERY
  (
    SELECT
      'College'::text AS type,
      c.name,
      c.slug,
      c.city AS location,
      c.logo,
      GREATEST(
        similarity(lower(c.name), q),
        similarity(lower(c.short_name), q)
      ) AS similarity_score
    FROM colleges c
    WHERE c.is_active = true
      AND (
        lower(c.name) ILIKE '%' || q || '%'
        OR lower(c.short_name) ILIKE '%' || q || '%'
        OR similarity(lower(c.name), q) > 0.15
        OR similarity(lower(c.short_name), q) > 0.15
      )
    ORDER BY similarity_score DESC
    LIMIT result_limit
  )
  UNION ALL
  (
    SELECT
      'Course'::text AS type,
      co.name,
      co.slug,
      ''::text AS location,
      ''::text AS logo,
      GREATEST(
        similarity(lower(co.name), q),
        similarity(lower(co.full_name), q),
        similarity(lower(co.short_description), q)
      ) AS similarity_score
    FROM courses co
    WHERE co.is_active = true
      AND (
        lower(co.name) ILIKE '%' || q || '%'
        OR lower(co.full_name) ILIKE '%' || q || '%'
        OR similarity(lower(co.name), q) > 0.15
        OR similarity(lower(co.full_name), q) > 0.15
      )
    ORDER BY similarity_score DESC
    LIMIT result_limit
  )
  UNION ALL
  (
    SELECT
      'Exam'::text AS type,
      e.name,
      e.slug,
      ''::text AS location,
      e.logo,
      GREATEST(
        similarity(lower(e.name), q),
        similarity(lower(e.full_name), q),
        similarity(lower(e.short_name), q)
      ) AS similarity_score
    FROM exams e
    WHERE e.is_active = true
      AND (
        lower(e.name) ILIKE '%' || q || '%'
        OR lower(e.full_name) ILIKE '%' || q || '%'
        OR lower(e.short_name) ILIKE '%' || q || '%'
        OR similarity(lower(e.name), q) > 0.15
        OR similarity(lower(e.full_name), q) > 0.15
        OR similarity(lower(e.short_name), q) > 0.15
      )
    ORDER BY similarity_score DESC
    LIMIT result_limit
  )
  ORDER BY similarity_score DESC
  LIMIT result_limit;
END;
$$;
