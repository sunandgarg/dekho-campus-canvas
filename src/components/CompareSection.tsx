import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CompareSection() {
  return (
    <section className="py-20 bg-cool">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Compare Colleges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 shadow-card border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Compare Colleges</h3>
                <p className="text-muted-foreground">Side-by-side comparison</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Confused between colleges? Compare the colleges that are on your mind, to see what all they provide and choose the best that you like.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search first college..."
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search second college..."
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
            <Button variant="accent" className="btn-accent-glow">
              Compare Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          {/* CGPA Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 shadow-card border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-accent">
                <Calculator className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Academic Converter</h3>
                <p className="text-muted-foreground">CGPA/SGPA to Percentage</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Convert your academic scores instantly. Whether it's SGPA to Percentage, CGPA to Percentage, or SGPA to CGPA - we've got you covered.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <Button variant="secondary" size="sm" className="bg-muted">
                SGPA to Percentage
              </Button>
              <Button variant="secondary" size="sm" className="bg-muted">
                CGPA to Percentage
              </Button>
              <Button variant="secondary" size="sm" className="bg-muted">
                SGPA to CGPA
              </Button>
            </div>
            <div className="flex gap-3">
              <Input placeholder="Enter your SGPA" className="flex-1" />
              <Button className="btn-primary-glow">Convert</Button>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-muted text-center">
              <span className="text-sm text-muted-foreground">Your percentage is</span>
              <div className="text-3xl font-bold text-foreground mt-1">--.-- %</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
