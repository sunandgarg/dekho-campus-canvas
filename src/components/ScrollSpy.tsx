import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface ScrollSection {
  id: string;
  label: string;
}

interface ScrollSpyProps {
  sections: ScrollSection[];
  className?: string;
  baseUrl?: string;
}

export function ScrollSpy({ sections, className, baseUrl }: ScrollSpyProps) {
  const { tab } = useParams<{ tab?: string }>();
  const initialTab = tab || sections[0]?.id || "";
  const [activeId, setActiveId] = useState(initialTab);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const isUserClick = useRef(false);

  // Scroll to tab section on mount if tab param exists
  useEffect(() => {
    if (tab) {
      const timer = setTimeout(() => {
        const el = document.getElementById(tab);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tab]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isUserClick.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const newId = visible[0].target.id;
          setActiveId(newId);
          // Update URL hash without causing navigation
          if (baseUrl) {
            window.history.replaceState(null, "", `${baseUrl}/${newId}`);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.05 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections, baseUrl]);

  const scrollTo = useCallback((id: string) => {
    isUserClick.current = true;
    setActiveId(id);
    
    // Update URL
    if (baseUrl) {
      window.history.replaceState(null, "", `${baseUrl}/${id}`);
    }
    
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setTimeout(() => {
      isUserClick.current = false;
    }, 1200);
  }, [baseUrl]);

  // Auto-scroll active tab into view in nav bar
  useEffect(() => {
    if (!navRef.current) return;
    const activeBtn = navRef.current.querySelector(`[data-id="${activeId}"]`);
    if (activeBtn) {
      (activeBtn as HTMLElement).scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeId]);

  return (
    <div
      ref={navRef}
      className={cn(
        "sticky top-14 md:top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border",
        "flex overflow-x-auto scrollbar-hide gap-0.5 px-1 py-2",
        className
      )}
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          data-id={id}
          onClick={() => scrollTo(id)}
          className={cn(
            "whitespace-nowrap px-3.5 py-2 rounded-lg text-sm font-medium transition-all shrink-0",
            activeId === id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
