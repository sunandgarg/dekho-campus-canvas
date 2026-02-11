import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface ScrollSection {
  id: string;
  label: string;
}

interface ScrollSpyProps {
  sections: ScrollSection[];
  className?: string;
}

export function ScrollSpy({ sections, className }: ScrollSpyProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const initialHash = location.hash.replace("#", "");
  const [activeId, setActiveId] = useState(
    sections.find((s) => s.id === initialHash)?.id ?? sections[0]?.id ?? ""
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const isUserClick = useRef(false);

  // Scroll to hash on mount
  useEffect(() => {
    if (initialHash) {
      setTimeout(() => {
        const el = document.getElementById(initialHash);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 300);
    }
  }, []);

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
          window.history.replaceState(null, "", `#${newId}`);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const scrollTo = useCallback((id: string) => {
    isUserClick.current = true;
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setTimeout(() => {
      isUserClick.current = false;
    }, 1000);
  }, []);

  // Auto-scroll active tab into view
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
        "flex overflow-x-auto scrollbar-hide gap-0.5 px-1 py-1.5",
        className
      )}
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          data-id={id}
          onClick={() => scrollTo(id)}
          className={cn(
            "whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-all shrink-0",
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
