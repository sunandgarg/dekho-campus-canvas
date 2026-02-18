import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!content) return;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  if (!url) return;
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.href = url;
}

export function useSEO({ title, description, keywords }: SEOProps) {
  const location = useLocation();
  
  // Fetch DB SEO settings for this path
  const basePath = "/" + location.pathname.split("/").filter(Boolean).slice(0, 1).join("/") || "/";
  const { data: dbSeo } = useQuery({
    queryKey: ["page-seo", basePath],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_seo")
        .select("*")
        .eq("page_path", basePath === "/" ? "/" : `/${basePath.replace(/^\//, "")}`)
        .eq("is_active", true)
        .maybeSingle();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const seoTitle = title || dbSeo?.meta_title;
    const seoDesc = description || dbSeo?.meta_description;
    const seoKeywords = keywords || dbSeo?.meta_keywords;

    if (seoTitle) document.title = `${seoTitle} | DekhoCampus`;
    if (seoDesc) setMeta("description", seoDesc);
    if (seoKeywords) setMeta("keywords", seoKeywords);

    // DB-driven meta tags
    if (dbSeo) {
      if (dbSeo.canonical_url) setCanonical(dbSeo.canonical_url);
      if (dbSeo.robots) setMeta("robots", dbSeo.robots);
      setMeta("og:title", dbSeo.og_title || seoTitle || "", true);
      setMeta("og:description", dbSeo.og_description || seoDesc || "", true);
      if (dbSeo.og_image) setMeta("og:image", dbSeo.og_image, true);
      setMeta("twitter:title", dbSeo.twitter_title || seoTitle || "");
      setMeta("twitter:description", dbSeo.twitter_description || seoDesc || "");
      if (dbSeo.twitter_image) setMeta("twitter:image", dbSeo.twitter_image);
    }

    return () => {
      document.title = "DekhoCampus - Find Your Dream College";
    };
  }, [title, description, keywords, dbSeo]);
}
