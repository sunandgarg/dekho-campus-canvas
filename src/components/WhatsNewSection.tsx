import { Link } from "react-router-dom";
import { Calendar, ChevronRight } from "lucide-react";
import { useDbArticles } from "@/hooks/useArticlesData";
import { useMemo } from "react";

interface WhatsNewSectionProps {
  entityName: string;
  entityType: "college" | "course" | "exam";
  category?: string;
}

export function WhatsNewSection({ entityName, entityType, category }: WhatsNewSectionProps) {
  const { data: articles } = useDbArticles();

  const relevantArticles = useMemo(() => {
    if (!articles) return [];
    // Find articles matching this entity or category
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

  // Generate dynamic news items if no articles found
  const newsItems = relevantArticles.length > 0
    ? relevantArticles.map((a) => ({
        title: a.title,
        date: new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        slug: `/articles/${a.slug}`,
      }))
    : [
        { title: `${entityName} Latest Admissions Update 2026`, date: "Feb 2026", slug: "#" },
        { title: `${entityName} - New Rankings & Reviews`, date: "Jan 2026", slug: "#" },
        { title: `Top Updates About ${entityName}`, date: "Dec 2025", slug: "#" },
        { title: `${entityName} - What Students Say`, date: "Nov 2025", slug: "#" },
      ];

  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-2xl border border-border p-5 scroll-mt-32">
      <h2 className="text-lg font-bold text-foreground mb-1">What's new?</h2>
      <p className="text-xs text-muted-foreground mb-4">{entityName} Latest news and articles</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {newsItems.map((item, i) => (
          <Link
            key={i}
            to={item.slug}
            className="bg-card rounded-xl border border-border p-3 hover:shadow-md transition-shadow group"
          >
            <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {item.date}
              </span>
              <span className="text-xs text-primary font-medium">Read more..</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
