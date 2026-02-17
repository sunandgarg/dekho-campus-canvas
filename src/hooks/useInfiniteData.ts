/**
 * useInfiniteData — Cursor-based infinite scroll hook
 * 
 * Implements cursor pagination using IntersectionObserver.
 * Each page fetches BATCH_SIZE items ordered by a cursor field.
 * The sentinel element triggers the next fetch at 300px margin.
 */
import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BATCH_SIZE = 12;

interface InfiniteConfig {
  table: "colleges" | "courses" | "exams" | "articles";
  queryKey: string[];
  orderBy?: string;
  ascending?: boolean;
  filters?: Record<string, string | string[] | undefined>;
  search?: string;
  searchFields?: string[];
  enabled?: boolean;
}

export function useInfiniteData({
  table,
  queryKey,
  orderBy = "rating",
  ascending = false,
  filters = {},
  search,
  searchFields = ["name"],
  enabled = true,
}: InfiniteConfig) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const query = useInfiniteQuery({
    queryKey: [...queryKey, filters, search],
    queryFn: async ({ pageParam = 0 }) => {
      let q: any = supabase
        .from(table)
        .select("*")
        .eq("is_active", true)
        .order(orderBy, { ascending })
        .range(pageParam, pageParam + BATCH_SIZE - 1);

      // Apply filters
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        if (Array.isArray(value) && value.length > 0) {
          q = q.in(key, value);
        } else if (typeof value === "string" && value) {
          q = q.eq(key, value);
        }
      }

      // Apply search
      if (search && searchFields.length > 0) {
        const orClause = searchFields.map(f => `${f}.ilike.%${search}%`).join(",");
        q = q.or(orClause);
      }

      const { data, error } = await q;
      if (error) throw error;
      return { items: data ?? [], offset: pageParam };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.items.length < BATCH_SIZE) return undefined;
      return lastPage.offset + BATCH_SIZE;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const items = query.data?.pages.flatMap(p => p.items) ?? [];

  return {
    items,
    sentinelRef,
    isLoading: query.isLoading,
    isFetchingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage ?? false,
  };
}
