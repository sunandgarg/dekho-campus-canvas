import { motion } from "framer-motion";
import { Sparkles, Target, Lightbulb, Users, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    title: "AI Career Counselor",
    description: "Get personalized guidance 24/7 from our smart AI that understands your goals",
    color: "from-primary to-electric-purple",
    items: ["Instant answers", "Personalized advice", "Career mapping"],
  },
  {
    icon: Target,
    title: "Smart College Finder",
    description: "Find your perfect match from 5000+ colleges based on your preferences",
    color: "from-accent to-golden",
    items: ["Custom filters", "Compare colleges", "Virtual tours"],
  },
  {
    icon: Lightbulb,
    title: "Exam Prep Toolkit",
    description: "Everything you need to crack entrance exams - strategy, resources, tips",
    color: "from-mint to-primary",
    items: ["Study plans", "Mock tests", "Previous papers"],
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with seniors, alumni, and fellow aspirants for real insights",
    color: "from-pink to-accent",
    items: ["Expert Q&A", "Peer reviews", "Mentorship"],
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 gradient-mesh" aria-labelledby="features-heading">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 id="features-heading" className="text-headline font-bold text-foreground">
            Why Students <span className="text-gradient">Love Us</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We've built the ultimate toolkit to help you make the best decisions for your future
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group card-elevated p-6 md:p-8"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-success" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Button size="lg" className="gradient-primary btn-glow rounded-xl text-base">
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
