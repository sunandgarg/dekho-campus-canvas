import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Sparkles, Newspaper } from "lucide-react";
import { useDbArticles } from "@/hooks/useArticlesData";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

interface WhatsNewSectionProps {
  entityName: string;
  entityType: "college" | "course" | "exam";
  category?: string;
}

export function WhatsNewSection({ entityName, entityType, category }: WhatsNewSectionProps) {
  const { data: articles } = useDbArticles();

  const relevantArticles = useMemo(() => {
    if (!articles) return [];
    const nameWords = entityName.toLowerCase().split(/\s+/);
    return articles
      .filter((a) => {
        const titleLower = a.title.toLowerCase();
        const descLower = a.description.toLowerCase();
        return nameWords.some((w) => w.length > 3 && (titleLower.includes(w) || descLower.includes(w))) ||
          (category && a.category.toLowerCase() === category.toLowerCase()) ||
          a.vertical.toLowerCase() === entityType;
      })
      .slice(0, 6);
  }, [articles, entityName, entityType, category]);

  const newsItems = relevantArticles.length > 0
    ? relevantArticles.map((a) => ({
        title: a.title,
        date: new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        slug: `/articles/${a.slug}`,
        isNew: (Date.now() - new Date(a.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000,
      }))
    : [
        { title: `${entityName} Latest Admissions Update 2026`, date: "Feb 2026", slug: "#", isNew: true },
        { title: `${entityName} - New Rankings & Reviews`, date: "Jan 2026", slug: "#", isNew: false },
        { title: `Top Updates About ${entityName}`, date: "Dec 2025", slug: "#", isNew: false },
        { title: `${entityName} - What Students Say`, date: "Nov 2025", slug: "#", isNew: false },
      ];

  return (
    <section className="relative rounded-2xl border-2 border-primary/30 overflow-hidden scroll-mt-32">
      {/* Highlighted header bar */}
      <div className="bg-gradient-to-r from-primary to-primary/80 px-5 py-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary-foreground" />
        <h2 className="text-base font-bold text-primary-foreground">What's New?</h2>
        <span className="ml-auto text-xs text-primary-foreground/80">{entityName}</span>
      </div>

      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 p-5">
        <div className="grid sm:grid-cols-2 gap-3">
          {newsItems.map((item, i) => (
            <Link
              key={i}
              to={item.slug}
              className="bg-card rounded-xl border border-border p-4 hover:shadow-lg hover:border-primary/30 transition-all group relative"
            >
              {item.isNew && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] px-2 py-0.5 z-10">NEW</Badge>
              )}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Newspaper className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    <span className="text-xs text-primary font-semibold group-hover:underline">Read more →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
