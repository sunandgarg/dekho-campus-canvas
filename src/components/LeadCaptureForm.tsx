import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, Phone, MapPin, Loader2, CheckCircle, BookOpen } from "lucide-react";
import { SearchableSelect } from "@/components/SearchableSelect";
import { indianStates, citiesByState, educationStatus } from "@/data/indianLocations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import dcLogo from "@/assets/dc-logo.png";

interface LeadCaptureFormProps {
  variant?: "inline" | "card" | "banner" | "sidebar";
  title?: string;
  subtitle?: string;
  source?: string;
  interestedCollegeSlug?: string;
  interestedCourseSlug?: string;
  interestedExamSlug?: string;
}

const LEAD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-lead`;

const courseOptions = [
  "B.Tech / B.E.", "MBBS / BDS", "B.Com / BBA / MBA", "B.Sc / M.Sc",
  "B.A / M.A", "Law (LLB)", "Design / Architecture", "Other",
];

const stateOptions = [
  "Delhi", "Delhi NCR", "Haryana", "Chandigarh", "Rajasthan",
  "Uttar Pradesh", "Uttarakhand", "Punjab", "Himachal Pradesh",
  "Bihar", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Tamil Nadu", "Telangana", "West Bengal", "Other",
];

export function LeadCaptureForm({ 
  variant = "card", 
  title = "Get Free Counseling",
  subtitle = "Talk to our expert counselors for personalized college recommendations",
  source = "website_form",
  interestedCollegeSlug,
  interestedCourseSlug,
  interestedExamSlug,
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", course: "", state: "", city: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authorized, setAuthorized] = useState(true);

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only name and phone are universally required
    if (!formData.name || !formData.phone) {
      toast.error("Please enter your name and phone number");
      return;
    }
    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    // Card variant requires all fields
    if (variant === "card" && (!formData.email || !formData.course || !formData.state || !formData.city)) {
      toast.error("Please fill all required fields");
      return;
    }
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
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
          name: formData.name, email: formData.email || null, phone: formData.phone,
          city: formData.city || null, state: formData.state || null,
          current_situation: formData.course || null, source,
          interested_college_slug: interestedCollegeSlug || null,
          interested_course_slug: interestedCourseSlug || null,
          interested_exam_slug: interestedExamSlug || null,
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
          ${variant === "card" ? "bg-card rounded-2xl border border-border p-5 shadow-soft" : ""}
          ${variant === "banner" ? "bg-primary rounded-2xl p-5 text-primary-foreground" : ""}
          ${variant === "sidebar" ? "bg-card rounded-2xl border border-border p-4" : ""}
          ${variant === "inline" ? "bg-muted/50 rounded-xl p-4" : ""}
        `}
      >
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-7 h-7 text-success" />
          </div>
          <h3 className={`text-lg font-bold mb-2 ${variant === "banner" ? "text-primary-foreground" : "text-foreground"}`}>
            Thank You! 🎉
          </h3>
          <p className={`text-sm ${variant === "banner" ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
            Our expert counselor will call you within 24 hours
          </p>
        </div>
      </motion.div>
    );
  }

  const selectCls = "w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none";

  const LogoBadge = () => (
    <img src={dcLogo} alt="DekhoCampus" className="h-8 w-8 object-contain" />
  );

  // Card variant
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card rounded-2xl border border-border p-5 shadow-soft"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={dcLogo} alt="DekhoCampus" className="w-10 h-10 object-contain" />
            <div>
              <h3 className="text-sm font-bold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={formData.name} onChange={e => update("name", e.target.value)} placeholder="Your Name *" className="pl-10 rounded-xl h-10 text-sm" required />
          </div>
          <div className="relative flex items-center gap-0">
            <span className="flex-shrink-0 px-3 py-2.5 bg-muted rounded-l-xl border border-r-0 border-border text-sm text-muted-foreground font-medium">+91</span>
            <Input value={formData.phone} onChange={e => {
              let val = e.target.value.replace(/\D/g, "");
              if (val.startsWith("91") && val.length > 10) val = val.slice(2);
              if (val.startsWith("0")) val = val.slice(1);
              if (val.length <= 10) update("phone", val);
            }} placeholder="Mobile Number *" type="tel" maxLength={10} className="rounded-l-none rounded-r-xl h-10 text-sm" required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={formData.email} onChange={e => update("email", e.target.value)} placeholder="Email *" type="email" className="pl-10 rounded-xl h-10 text-sm" required />
          </div>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select value={formData.course} onChange={e => update("course", e.target.value)} aria-label="Select Course" className={`${selectCls} pl-10`} required>
              <option value="">Interested Course *</option>
              {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SearchableSelect
              options={indianStates}
              value={formData.state}
              onChange={(v) => { update("state", v); update("city", ""); }}
              placeholder="State *"
            />
            <SearchableSelect
              options={formData.state ? (citiesByState[formData.state] || []) : []}
              value={formData.city}
              onChange={(v) => update("city", v)}
              placeholder={formData.state ? "City *" : "Select state first"}
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={authorized} onChange={e => setAuthorized(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-border text-primary accent-primary" />
            <span className="text-[11px] text-muted-foreground leading-tight">
              I authorize DekhoCampus to contact me via Email, SMS, WhatsApp & Call. <a href="/terms" className="text-primary underline">T&C apply</a>
            </span>
          </label>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-xl h-10 text-sm text-primary-foreground" disabled={isLoading || !authorized}>
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
            ) : (
              <>Register Now <Send className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </form>
      </motion.div>
    );
  }

  // Banner variant - single horizontal line
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary rounded-2xl p-4 md:p-5"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <h3 className="text-sm md:text-base font-bold text-primary-foreground whitespace-nowrap flex-shrink-0">{title}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:flex-1">
            <Input value={formData.name} onChange={e => update("name", e.target.value)} placeholder="Name" className="bg-primary-foreground/15 border-0 text-primary-foreground placeholder:text-primary-foreground/50 rounded-lg h-9 text-sm flex-1 min-w-0" required />
            <Input value={formData.phone} onChange={e => { let v = e.target.value.replace(/\D/g,""); if(v.length<=10) update("phone",v); }} placeholder="Phone" type="tel" maxLength={10} className="bg-primary-foreground/15 border-0 text-primary-foreground placeholder:text-primary-foreground/50 rounded-lg h-9 text-sm flex-1 min-w-0" required />
            <select value={formData.course} onChange={e => update("course", e.target.value)} aria-label="Select Course" className="px-3 py-2 rounded-lg bg-primary-foreground/15 border-0 text-primary-foreground text-sm h-9 focus:outline-none [&>option]:text-foreground flex-1 min-w-0">
              <option value="">Course</option>
              {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg px-5 whitespace-nowrap h-9 text-sm font-semibold flex-shrink-0" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Callback →"}
            </Button>
          </form>
        </div>
      </motion.div>
    );
  }

  // Sidebar variant
  if (variant === "sidebar") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-card rounded-2xl border border-border p-4"
      >
        <div className="text-center mb-3">
          <img src={dcLogo} alt="DekhoCampus" className="w-10 h-10 object-contain mx-auto mb-2" />
          <h4 className="font-bold text-foreground text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Input value={formData.name} onChange={e => update("name", e.target.value)} placeholder="Name *" className="rounded-xl text-sm h-9" required />
          <Input value={formData.phone} onChange={e => update("phone", e.target.value)} placeholder="Phone *" type="tel" className="rounded-xl text-sm h-9" required />
          <Input value={formData.email} onChange={e => update("email", e.target.value)} placeholder="Email" type="email" className="rounded-xl text-sm h-9" />
        <select value={formData.course} onChange={e => update("course", e.target.value)} aria-label="Select Course" className={`${selectCls} h-9 text-xs`}>
            <option value="">Select Course</option>
            {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select value={formData.state} onChange={e => update("state", e.target.value)} aria-label="Select State" className={`${selectCls} h-9 text-xs`}>
              <option value="">State</option>
              {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Input value={formData.city} onChange={e => update("city", e.target.value)} placeholder="City" className="rounded-xl text-sm h-9" />
          </div>
          <Button type="submit" size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-9 text-sm" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Free Help"}
          </Button>
        </form>
      </motion.div>
    );
  }

  // Inline variant
  return (
    <div className="bg-muted/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <img src={dcLogo} alt="DekhoCampus" className="h-7 w-7 object-contain" />
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <Input value={formData.name} onChange={e => update("name", e.target.value)} placeholder="Name *" className="rounded-lg text-sm h-10" required />
        <Input value={formData.phone} onChange={e => update("phone", e.target.value)} placeholder="Phone *" type="tel" className="rounded-lg text-sm h-10" required />
        <Input value={formData.email} onChange={e => update("email", e.target.value)} placeholder="Email" type="email" className="rounded-lg text-sm h-10" />
        <select value={formData.course} onChange={e => update("course", e.target.value)} aria-label="Select Course" className="px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none h-10">
          <option value="">Course</option>
          {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Button type="submit" size="sm" className="bg-primary text-primary-foreground rounded-lg h-10 px-5" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
        </Button>
      </form>
    </div>
  );
}
