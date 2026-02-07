import { motion } from "framer-motion";
import { Search, ArrowRight, Star, Play, Sparkles, GraduationCap, BookOpen, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-abstract.jpg";

const quickStats = [
  { icon: GraduationCap, value: "5000+", label: "Colleges" },
  { icon: BookOpen, value: "10K+", label: "Courses" },
  { icon: Brain, value: "AI", label: "Powered" },
  { icon: Zap, value: "24/7", label: "Support" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden gradient-mesh" aria-label="Hero">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-electric-purple/10 blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                India's #1 AI-Powered Education Platform
              </span>
              <span className="px-2 py-0.5 text-xs font-bold badge-gradient rounded-full">NEW</span>
            </motion.div>

            {/* Headline */}
            <div>
              <h1 className="text-display font-extrabold text-foreground leading-tight">
                Your Future
                <br />
                <span className="text-gradient">Starts Here</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-lg text-balance">
                Discover 5000+ colleges, compare courses, and get personalized AI guidance to find your perfect career path. 
                <span className="text-foreground font-medium"> Made for students like you.</span>
              </p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="flex gap-2 p-2 card-elevated max-w-xl">
                <div className="flex-1 flex items-center gap-3 pl-4">
                  <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <Input
                    type="search"
                    placeholder="Search colleges, courses, or exams..."
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground"
                    aria-label="Search colleges, courses, or exams"
                  />
                </div>
                <Button size="lg" className="gradient-primary btn-glow rounded-xl px-6">
                  <span className="hidden sm:inline">Search</span>
                  <ArrowRight className="w-5 h-5 sm:ml-2" />
                </Button>
              </div>
              {/* Popular searches */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Popular:</span>
                {["IIT Delhi", "MBA", "JEE Main 2026", "B.Tech CSE"].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="gradient-primary btn-glow rounded-xl text-base">
                <Sparkles className="w-5 h-5 mr-2" />
                Talk to AI Counselor
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl text-base gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 pt-4"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-electric-purple border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-golden fill-golden" />
                  ))}
                  <span className="font-bold text-foreground ml-1">4.9</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Trusted by <span className="font-semibold text-foreground">1M+</span> students
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-elevated">
                <img
                  src={heroImage}
                  alt="AI-powered education platform"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>

              {/* Floating stat cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 card-elevated p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">5000+</div>
                  <div className="text-sm text-muted-foreground">Partner Colleges</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-4 -right-4 card-elevated p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                  <Brain className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">AI</div>
                  <div className="text-sm text-muted-foreground">Career Guide</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:hidden grid grid-cols-4 gap-4 mt-12"
        >
          {quickStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
