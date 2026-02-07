import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Explore Colleges", hasDropdown: true },
  { label: "Courses", hasDropdown: true },
  { label: "Exams", hasDropdown: true },
  { label: "Resources", hasDropdown: true },
  { label: "More", hasDropdown: true },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-2.5 px-4">
        <div className="container flex items-center justify-center gap-4 text-sm">
          <span>Find the perfect course for your career growth!</span>
          <Button 
            size="sm" 
            variant="accent"
            className="h-7 text-xs"
          >
            Connect Now
          </Button>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-foreground">Dekho</span>
            <span className="text-2xl font-bold text-accent">Campus</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="hidden md:flex">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
              className="lg:hidden border-t border-border bg-background"
            >
              <div className="container py-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </button>
                ))}
                <div className="pt-4 border-t border-border">
                  <Button className="w-full" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
