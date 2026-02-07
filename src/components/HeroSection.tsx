import { motion } from "framer-motion";
import { Search, Star, CheckCircle, ArrowRight, GraduationCap, BookOpen, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroBg from "@/assets/hero-bg.jpg";

const trustPoints = [
  { icon: CheckCircle, text: "Compare 5000+ colleges" },
  { icon: CheckCircle, text: "Expert admission guidance" },
  { icon: CheckCircle, text: "Verified reviews & ratings" },
  { icon: CheckCircle, text: "Latest exam updates" },
];

const quickActions = [
  { icon: GraduationCap, label: "Colleges", count: "5000+ options", color: "bg-accent" },
  { icon: BookOpen, label: "Courses", count: "10000+ options", color: "bg-primary" },
  { icon: FileText, label: "Exams", count: "500+ options", color: "bg-accent" },
  { icon: TrendingUp, label: "Latest Updates", count: "Real-time alerts", color: "bg-primary" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <div className="container relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10"
            >
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-medium text-foreground">Trusted by 1 Million+ Students</span>
            </motion.div>

            {/* Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Discover Your
                <br />
                <span className="text-gradient-accent">Perfect College</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                Search from thousands of colleges, compare courses, and make the right choice for your future with expert guidance.
              </p>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-3">
              {trustPoints.map((point, index) => (
                <motion.div
                  key={point.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <point.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">{point.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-2 p-2 bg-card rounded-xl shadow-card max-w-lg border border-border"
            >
              <div className="flex-1 flex items-center gap-2 pl-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search colleges, courses, exams..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                />
              </div>
              <Button variant="accent" className="btn-accent-glow">
                Search
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" variant="accent" className="btn-accent-glow">
                Explore All Colleges
              </Button>
              <Button size="lg" variant="outline">
                View Entrance Exams
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="group flex items-center gap-4 p-5 bg-card rounded-xl shadow-card border border-border card-hover cursor-pointer"
              >
                <div className={`p-3 rounded-xl ${action.color}`}>
                  <action.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.count}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
