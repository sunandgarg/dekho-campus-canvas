import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, Phone, MapPin, GraduationCap, Loader2, CheckCircle, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LeadCaptureFormProps {
  variant?: "inline" | "card" | "banner" | "sidebar";
  title?: string;
  subtitle?: string;
  source?: string;
}

const LEAD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-lead`;

const courseOptions = [
  "B.Tech / B.E.",
  "MBBS / BDS",
  "B.Com / BBA / MBA",
  "B.Sc / M.Sc",
  "B.A / M.A",
  "Law (LLB)",
  "Design / Architecture",
  "Other",
];

const stateOptions = [
  "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Haryana", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other",
];

export function LeadCaptureForm({ 
  variant = "card", 
  title = "Get Free Counseling",
  subtitle = "Talk to our expert counselors for personalized college recommendations",
  source = "website_form"
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    state: "",
    city: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(LEAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          city: formData.city || null,
          state: formData.state || null,
          current_situation: formData.course || null,
          source,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Thank you! Our counselor will contact you soon.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Lead submission error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          ${variant === "card" ? "bg-card rounded-2xl border border-border p-5 md:p-6 shadow-lg" : ""}
          ${variant === "banner" ? "bg-gradient-to-r from-success to-mint rounded-2xl p-5 md:p-6 text-primary-foreground" : ""}
          ${variant === "sidebar" ? "bg-card rounded-2xl border border-border p-4 md:p-5" : ""}
          ${variant === "inline" ? "bg-muted/50 rounded-xl p-4" : ""}
        `}
      >
        <div className="text-center py-4 md:py-6">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-3 md:mb-4">
            <CheckCircle className="w-7 h-7 md:w-8 md:h-8 text-success" />
          </div>
          <h3 className={`text-lg md:text-xl font-bold mb-2 ${variant === "banner" ? "text-primary-foreground" : "text-foreground"}`}>
            Thank You! 🎉
          </h3>
          <p className={`text-sm ${variant === "banner" ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
            Our expert counselor will call you within 24 hours
          </p>
        </div>
      </motion.div>
    );
  }

  // Shared select classes
  const selectCls = "w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none";

  // Card variant — full featured form
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl gradient-accent flex items-center justify-center">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-foreground">{title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={formData.name} onChange={e => update("name", e.target.value)} placeholder="Your Name *" className="pl-10 rounded-xl h-10 text-sm" required />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={formData.phone} onChange={e => update("phone", e.target.value)} placeholder="Phone Number *" type="tel" className="pl-10 rounded-xl h-10 text-sm" required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={formData.email} onChange={e => update("email", e.target.value)} placeholder="Email (optional)" type="email" className="pl-10 rounded-xl h-10 text-sm" />
          </div>

          {/* Course dropdown */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select value={formData.course} onChange={e => update("course", e.target.value)} className={`${selectCls} pl-10`}>
              <option value="">Select Course</option>
              {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* State & City in a row */}
          <div className="grid grid-cols-2 gap-2">
            <select value={formData.state} onChange={e => update("state", e.target.value)} className={selectCls}>
              <option value="">State</option>
              {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input value={formData.city} onChange={e => update("city", e.target.value)} placeholder="City" className="pl-10 rounded-xl h-10 text-sm" />
            </div>
          </div>

          <Button type="submit" className="w-full gradient-accent btn-accent-glow rounded-xl h-10 text-sm" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
            ) : (
              <>Get Free Counseling <Send className="w-4 h-4 ml-2" /></>
            )}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">
            By submitting, you agree to receive calls from our counselors
          </p>
        </form>
      </motion.div>
    );
  }

  // Banner variant — horizontal layout
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary via-primary to-accent rounded-2xl p-5 md:p-8"
      >
        <div className="flex flex-col lg:flex-row items-center gap-4 md:gap-6">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-1 md:mb-2">{title}</h3>
            <p className="text-primary-foreground/90 text-sm md:text-base">{subtitle}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto">
            <Input value={formData.name} onChange={e => update("name", e.target.value)} placeholder="Your Name" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 rounded-xl min-w-[140px] h-10 text-sm" required />
            <Input value={formData.phone} onChange={e => update("phone", e.target.value)} placeholder="Phone Number" type="tel" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 rounded-xl min-w-[140px] h-10 text-sm" required />
            <select value={formData.course} onChange={e => update("course", e.target.value)} className="px-3 py-2 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-sm min-w-[140px] focus:outline-none [&>option]:text-foreground">
              <option value="">Course</option>
              {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Button type="submit" className="bg-card text-foreground hover:bg-card/90 rounded-xl px-5 whitespace-nowrap h-10 text-sm" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Callback"}
            </Button>
          </form>
        </div>
      </motion.div>
    );
  }

  // Sidebar variant — compact vertical
  if (variant === "sidebar") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-secondary to-muted rounded-2xl border border-border p-4 md:p-5"
      >
        <div className="text-center mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full gradient-accent flex items-center justify-center mx-auto mb-2 md:mb-3">
            <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-accent-foreground" />
          </div>
          <h4 className="font-bold text-foreground text-sm md:text-base">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Input value={formData.name} onChange={e => update("name", e.target.value)} placeholder="Name *" className="rounded-xl text-sm h-9" required />
          <Input value={formData.phone} onChange={e => update("phone", e.target.value)} placeholder="Phone *" type="tel" className="rounded-xl text-sm h-9" required />
          <Input value={formData.email} onChange={e => update("email", e.target.value)} placeholder="Email" type="email" className="rounded-xl text-sm h-9" />
          <select value={formData.course} onChange={e => update("course", e.target.value)} className={`${selectCls} h-9 text-xs`}>
            <option value="">Select Course</option>
            {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select value={formData.state} onChange={e => update("state", e.target.value)} className={`${selectCls} h-9 text-xs`}>
              <option value="">State</option>
              {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Input value={formData.city} onChange={e => update("city", e.target.value)} placeholder="City" className="rounded-xl text-sm h-9" />
          </div>
          <Button type="submit" size="sm" className="w-full gradient-accent rounded-xl h-9 text-sm" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Free Help"}
          </Button>
        </form>
      </motion.div>
    );
  }

  // Inline variant — with email added
  return (
    <div className="bg-muted/50 rounded-xl p-4">
      <p className="text-sm font-medium text-foreground mb-3">{title}</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <Input value={formData.name} onChange={e => update("name", e.target.value)} placeholder="Name *" className="rounded-lg text-sm h-10" required />
        <Input value={formData.phone} onChange={e => update("phone", e.target.value)} placeholder="Phone *" type="tel" className="rounded-lg text-sm h-10" required />
        <Input value={formData.email} onChange={e => update("email", e.target.value)} placeholder="Email" type="email" className="rounded-lg text-sm h-10" />
        <select value={formData.course} onChange={e => update("course", e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none h-10">
          <option value="">Course</option>
          {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Button type="submit" size="sm" className="gradient-primary rounded-lg h-10 px-5" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
        </Button>
      </form>
    </div>
  );
}
