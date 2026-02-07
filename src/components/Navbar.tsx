import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Explore", hasDropdown: true },
  { label: "Colleges", hasDropdown: true },
  { label: "Courses", hasDropdown: true },
  { label: "Exams", hasDropdown: true },
  { label: "AI Guide", hasDropdown: false, isNew: true },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphism navbar */}
      <nav className="glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1.5" aria-label="DekhoCampus Home">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-foreground">Dekho</span>
              <span className="text-gradient">Campus</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.label}
                className="relative flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-xl hover:bg-muted focus-ring"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                {item.isNew && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold badge-gradient rounded-full">
                    AI
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex focus-ring" aria-label="Search">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="hidden md:flex gap-2 rounded-xl focus-ring">
              <User className="w-4 h-4" />
              Sign In
            </Button>
            <Button className="hidden md:flex gradient-primary btn-glow rounded-xl focus-ring">
              Get Started
            </Button>
            
            {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border/50"
            >
              <div className="container py-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold badge-gradient rounded-full">AI</span>
                      )}
                    </span>
                    {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </button>
                ))}
                <div className="pt-4 flex flex-col gap-2 border-t border-border/50">
                  <Button variant="outline" className="w-full rounded-xl">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button className="w-full gradient-primary btn-glow rounded-xl">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
