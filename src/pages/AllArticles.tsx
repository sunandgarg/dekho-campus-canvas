import { useState, useMemo } from "react";
import { optimizeImageUrl } from "@/lib/imageUtils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock, User, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ListingPageLayout } from "@/components/ListingPageLayout";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { articles, articleCategories } from "@/data/articles";

export default function AllArticles() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || a.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category]);

  return (
    <ListingPageLayout title="Articles & Guides" description="Expert advice, exam strategies, and career guidance for students" page="articles">
      <PageBreadcrumb items={[{ label: "Articles" }]} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." className="pl-10 rounded-xl h-11" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {articleCategories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{c}</button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Showing <span className="font-semibold text-foreground">{filtered.length}</span> articles</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((article, i) => (
            <motion.div key={article.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={`/articles/${article.slug}`} className="block">
                <article className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col sm:flex-row">
                  <div className="sm:w-48 md:w-56 flex-shrink-0">
                    <img src={optimizeImageUrl(article.image, 400, 300)} alt={article.title} className="w-full h-40 sm:h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{article.readTime}</span>
                    </div>
                    <h2 className="text-base md:text-lg font-bold text-foreground mb-1 line-clamp-2">{article.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">{article.authorAvatar}</div>
                      <span className="text-xs text-muted-foreground">{article.author}</span>
                      <span className="text-xs text-muted-foreground">· {article.publishedAt}</span>
                    </div>
                  </div>
                </article>
              </Link>
              {(i + 1) % 3 === 0 && i < filtered.length - 1 && <div className="mt-4"><DynamicAdBanner variant="horizontal" position="mid-page" page="articles" /></div>}
            </motion.div>
          ))}
        </div>

        <aside className="space-y-6">
          <LeadCaptureForm variant="sidebar" title="Get Expert Guidance" subtitle="Talk to our counselors for free" source="articles_listing" />
          <DynamicAdBanner variant="vertical" position="sidebar" page="articles" />
          <LeadCaptureForm variant="card" title="Weekly Newsletter" subtitle="Get the latest education news in your inbox" source="articles_newsletter" />
        </aside>
      </div>

      <div className="mt-10">
        <LeadCaptureForm variant="banner" title="📰 Want personalized guidance? Talk to an expert for free!" subtitle="Our counselors help you make the right education decisions" source="articles_bottom_banner" />
      </div>
    </ListingPageLayout>
  );
}
