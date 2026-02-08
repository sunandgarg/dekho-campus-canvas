import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, Phone, MapPin, GraduationCap, Loader2, CheckCircle, Sparkles } from "lucide-react";
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

const situationOptions = [
  { label: "Appearing in 12th", value: "12th_appearing" },
  { label: "Passed 12th", value: "12th_passed" },
  { label: "Graduated", value: "graduated" },
  { label: "Other", value: "other" },
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
    city: "",
    situation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
          current_situation: formData.situation || null,
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
          ${variant === "card" ? "bg-white rounded-2xl border border-border p-6 shadow-lg" : ""}
          ${variant === "banner" ? "bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white" : ""}
          ${variant === "sidebar" ? "bg-white rounded-2xl border border-border p-5" : ""}
          ${variant === "inline" ? "bg-muted/50 rounded-xl p-4" : ""}
        `}
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${variant === "banner" ? "text-white" : "text-foreground"}`}>
            Thank You! 🎉
          </h3>
          <p className={`text-sm ${variant === "banner" ? "text-white/90" : "text-muted-foreground"}`}>
            Our expert counselor will call you within 24 hours
          </p>
        </div>
      </motion.div>
    );
  }

  // Card variant - full featured form
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl border border-amber-200 p-6 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name *"
              className="pl-10 rounded-xl"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone Number *"
              type="tel"
              className="pl-10 rounded-xl"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email (optional)"
              type="email"
              className="pl-10 rounded-xl"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="City"
              className="pl-10 rounded-xl"
            />
          </div>

          <select
            value={formData.situation}
            onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select your status</option>
            {situationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <Button
            type="submit"
            className="w-full gradient-accent btn-accent-glow rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
            ) : (
              <>Get Free Counseling <Send className="w-4 h-4 ml-2" /></>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By submitting, you agree to receive calls from our counselors
          </p>
        </form>
      </motion.div>
    );
  }

  // Banner variant - horizontal layout
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary via-primary to-accent rounded-2xl p-6 md:p-8"
      >
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white/90">{subtitle}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl min-w-[160px]"
              required
            />
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone Number"
              type="tel"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl min-w-[160px]"
              required
            />
            <Button
              type="submit"
              className="bg-white text-primary hover:bg-white/90 rounded-xl px-6 whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Callback"}
            </Button>
          </form>
        </div>
      </motion.div>
    );
  }

  // Sidebar variant - compact vertical
  if (variant === "sidebar") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5"
      >
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name *"
            className="rounded-xl text-sm h-9"
            required
          />
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone *"
            type="tel"
            className="rounded-xl text-sm h-9"
            required
          />
          <Button
            type="submit"
            size="sm"
            className="w-full gradient-accent rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Free Help"}
          </Button>
        </form>
      </motion.div>
    );
  }

  // Inline variant - minimal
  return (
    <div className="bg-muted/50 rounded-xl p-4">
      <p className="text-sm font-medium text-foreground mb-3">{title}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter phone number"
          type="tel"
          className="flex-1 rounded-lg text-sm"
          required
        />
        <Button type="submit" size="sm" className="gradient-primary rounded-lg" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
        </Button>
      </form>
    </div>
  );
}