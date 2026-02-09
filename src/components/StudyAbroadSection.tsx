import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section className="py-10 md:py-14" aria-labelledby="abroad-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl border border-border p-6 md:p-10 text-center"
        >
          <span className="text-primary text-sm font-semibold">Want to study abroad?</span>
          <h2 id="abroad-heading" className="text-headline font-bold text-foreground mt-1 mb-6">
            We have that too
          </h2>

          {/* Single-line horizontal scroll of country flags */}
          <div className="flex gap-6 md:gap-10 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {countries.map((country, i) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
              >
                <div className="text-5xl md:text-6xl group-hover:scale-110 transition-transform">
                  {country.flag}
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground whitespace-nowrap">{country.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6">
            <Button size="lg" className="gradient-primary btn-glow rounded-xl">
              Explore Study Abroad <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
