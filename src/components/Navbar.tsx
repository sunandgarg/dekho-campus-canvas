import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, Sparkles, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Colleges", href: "/colleges" },
  { label: "Courses", href: "/courses" },
  { label: "Exams", href: "/exams" },
  { label: "Articles", href: "/articles" },
  { label: "AI Guide", href: "#", isNew: true },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="glass border-b border-border">
        <div className="container flex items-center justify-between h-14 md:h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="DekhoCampus Home">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gradient">Dekho</span>
              <span className="text-foreground">Campus</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="relative flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-xl hover:bg-secondary focus-ring"
              >
                {item.label}
                {item.isNew && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold badge-gradient rounded-full">
                    AI
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="hidden md:flex gap-2 rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50">
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            </Link>

            {user ? (
              <>
                <Button
                  variant="outline"
                  className="hidden md:flex gap-2 rounded-xl focus-ring"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="hidden md:flex gap-2 rounded-xl focus-ring">
                    <User className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="hidden md:flex gradient-primary btn-glow rounded-xl text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden focus-ring"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border"
            >
              <div className="container py-4 space-y-2 bg-card">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-xl transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold badge-gradient rounded-full">AI</span>
                      )}
                    </span>
                  </Link>
                ))}

                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>

                <div className="pt-4 flex flex-col gap-2 border-t border-border">
                  {user ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl">
                          <User className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full gradient-primary text-primary-foreground rounded-xl">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
