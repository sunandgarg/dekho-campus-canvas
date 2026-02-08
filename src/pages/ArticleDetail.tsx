import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingBot } from "@/components/FloatingBot";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { DynamicAdBanner } from "@/components/DynamicAdBanner";
import { articles } from "@/data/articles";
import ReactMarkdown from "react-markdown";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/articles"><Button className="gradient-primary text-primary-foreground rounded-xl">Browse Articles</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DynamicAdBanner variant="leaderboard" position="leaderboard" page="articles" itemSlug={slug} />
      <main className="container py-4 md:py-6">
        <PageBreadcrumb items={[{ label: "Articles", href: "/articles" }, { label: article.title }]} />

        <div className="grid lg:grid-cols-3 gap-6">
          <article className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <img src={article.image} alt={article.title} className="w-full h-48 md:h-72 object-cover rounded-2xl mb-6" />
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant="secondary">{article.category}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="w-3.5 h-3.5" />{article.publishedAt}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{article.title}</h1>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">{article.authorAvatar}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{article.author}</p>
                  <p className="text-xs text-muted-foreground">DekhoCampus Expert</p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
                <ReactMarkdown>{article.content}</ReactMarkdown>
              </div>

              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs"><Tag className="w-3 h-3 mr-1" />{tag}</Badge>
                ))}
              </div>
            </motion.div>

            <div className="mt-8">
              <DynamicAdBanner variant="horizontal" position="mid-page" page="articles" itemSlug={slug} />
            </div>
            <div className="mt-6">
              <LeadCaptureForm variant="inline" title="Found this helpful? Get personalized guidance!" source={`article_${article.slug}`} />
            </div>
          </article>

          <aside className="space-y-6">
            <LeadCaptureForm variant="card" title="Get Free Counseling" subtitle="Talk to our experts about your education goals" source={`article_sidebar_${article.slug}`} />
            <DynamicAdBanner variant="vertical" position="sidebar" page="articles" itemSlug={slug} />
            <LeadCaptureForm variant="sidebar" title="Weekly Updates" subtitle="Get the latest education news" source="article_newsletter_sidebar" />
          </aside>
        </div>
      </main>
      <Footer />
      <FloatingBot />
    </div>
  );
}
