import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Megaphone, Star, Users, ChevronLeft, GraduationCap, BookOpen, FileText, HelpCircle, Newspaper, Lightbulb, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Colleges", href: "/admin/colleges", icon: GraduationCap },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Exams", href: "/admin/exams", icon: FileText },
  { label: "Articles", href: "/admin/articles", icon: Newspaper },
  { label: "Ads Manager", href: "/admin/ads", icon: Megaphone },
  { label: "Featured", href: "/admin/featured", icon: Star },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Content", href: "/admin/content", icon: HelpCircle },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Project Docs", href: "/admin/docs", icon: Lightbulb },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0 hidden lg:flex">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" />
            Back to site
          </Link>
          <h2 className="text-lg font-bold text-foreground mt-2">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">DekhoCampus Management</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 bg-card border-b border-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground"><ChevronLeft className="w-5 h-5" /></Link>
            <h2 className="font-bold text-foreground">Admin</h2>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <Button variant={isActive ? "default" : "ghost"} size="icon" className="w-9 h-9">
                    <item.icon className="w-4 h-4" />
                  </Button>
                </Link>
              );
            })}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <h1 className="text-title font-bold text-foreground mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
