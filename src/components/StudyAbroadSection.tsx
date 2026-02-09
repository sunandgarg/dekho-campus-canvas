import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const countries = [
  { name: "Germany", flag: "🇩🇪", colleges: "400+" },
  { name: "United States", flag: "🇺🇸", colleges: "2000+" },
  { name: "United Kingdom", flag: "🇬🇧", colleges: "150+" },
  { name: "Australia", flag: "🇦🇺", colleges: "200+" },
  { name: "Canada", flag: "🇨🇦", colleges: "300+" },
  { name: "New Zealand", flag: "🇳🇿", colleges: "80+" },
];

export function StudyAbroadSection() {
  return (
    <section className="py-12 md:py-16" aria-labelledby="abroad-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl border border-border p-8 md:p-12 text-center shadow-sm"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <Globe className="w-4 h-4" />
            Study Abroad
          </div>
          <h2 id="abroad-heading" className="text-headline font-bold text-foreground mb-2">
            Want to study abroad? <span className="text-gradient">We have that too</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-8">
            Explore top universities across the globe with expert guidance on admissions, visas, and scholarships.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 md:gap-6 max-w-3xl mx-auto mb-8">
            {countries.map((country, i) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="text-5xl md:text-6xl group-hover:scale-110 transition-transform">
                  {country.flag}
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground">{country.name}</span>
                <span className="text-[10px] text-muted-foreground">{country.colleges} colleges</span>
              </motion.div>
            ))}
          </div>

          <Button size="lg" className="gradient-primary btn-glow rounded-xl">
            Explore Study Abroad <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
