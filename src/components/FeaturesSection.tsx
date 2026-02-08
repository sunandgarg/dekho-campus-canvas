import { motion } from "framer-motion";
import { Target, Check, ArrowRight, Heart, BookOpen, MessageCircle, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const features = [
  {
    icon: MessageCircle,
    title: "Friendly AI Counselor",
    description: "Chat with our AI just like talking to a friend who knows everything about colleges and careers",
    color: "from-amber-400 to-orange-500",
    items: ["24/7 instant help", "No judgment, just guidance", "Remembers your goals"],
  },
  {
    icon: Target,
    title: "Find Your Perfect Fit",
    description: "Tell us what you like, and we'll show you colleges that match YOUR personality and dreams",
    color: "from-teal-400 to-emerald-500",
    items: ["Smart matching", "Compare side-by-side", "Virtual campus tours"],
  },
  {
    icon: BookOpen,
    title: "Exam Prep Made Easy",
    description: "From study plans to mock tests - everything organized so you can focus on what matters",
    color: "from-violet-400 to-purple-500",
    items: ["Personalized schedules", "Practice questions", "Progress tracking"],
  },
  {
    icon: Users,
    title: "Real Student Stories",
    description: "Hear from students who've been in your shoes - their tips, experiences, and honest reviews",
    color: "from-rose-400 to-pink-500",
    items: ["Senior advice", "Campus life insights", "Placement stories"],
  },
];

const testimonials = [
  { name: "Priya S.", college: "Got into IIT Delhi", text: "The AI counselor helped me understand my options when I was super confused!" },
  { name: "Rahul M.", college: "NIT Trichy", text: "Loved the compare feature - made my decision so much easier" },
  { name: "Ananya K.", college: "BITS Pilani", text: "The exam prep tips were exactly what I needed during JEE prep" },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-amber-50/30" aria-labelledby="features-heading">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 mb-4">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Made with love for students</span>
          </div>
          <h2 id="features-heading" className="text-headline font-bold text-foreground">
            Why Students <span className="text-gradient-accent">Love</span> Us
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We get it - choosing your future is stressful. That's why we built tools that actually help.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl border border-amber-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
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
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-600" />
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

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-8">
            <Award className="w-10 h-10 mx-auto mb-3 opacity-90" />
            <h3 className="text-2xl font-bold mb-2">Students Love Us! 💛</h3>
            <p className="opacity-90">Here's what they're saying</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-5"
              >
                <p className="text-white/95 text-sm mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm opacity-80">{t.college}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lead Capture Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <LeadCaptureForm
            variant="banner"
            title="🎓 Get Personalized College Recommendations"
            subtitle="Talk to our expert counselors — completely free!"
            source="features_banner"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Ready to start your journey?</p>
          <Button size="lg" className="gradient-accent btn-accent-glow rounded-xl text-base">
            Try DC Educational AI Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
