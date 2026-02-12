import { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, Loader2, Phone, User, Mail, BookOpen, MapPin } from "lucide-react";
import dcLogo from "@/assets/dc-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/SearchableSelect";
import { indianStates, citiesByState, educationStatus } from "@/data/indianLocations";
import { toast } from "sonner";

const LEAD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-lead`;

const courseOptions = [
  "B.Tech / B.E.", "MBBS / BDS", "B.Com / BBA / MBA", "B.Sc / M.Sc",
  "B.A / M.A", "Law (LLB)", "Design / Architecture", "Other",
];

interface AILeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; course: string; state: string; city: string }) => void;
}

export function AILeadForm({ isOpen, onClose, onSubmit }: AILeadFormProps) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", course: "", otherCourse: "", state: "", city: "", education: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authorized, setAuthorized] = useState(true);

  const update = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const cities = formData.state ? (citiesByState[formData.state] || []) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Please fill name and phone number");
      return;
    }
    setIsLoading(true);
    const courseValue = formData.course === "Other" ? formData.otherCourse : formData.course;
    try {
      await fetch(LEAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          name: formData.name, email: formData.email || null, phone: formData.phone,
          city: formData.city || null, state: formData.state || null,
          current_situation: `${formData.education ? formData.education + " | " : ""}${courseValue || ""}` || null,
          source: "ai_chat_lead",
        }),
      });
      onSubmit({ name: formData.name, course: courseValue, state: formData.state, city: formData.city });
    } catch (error) {
      console.error("Lead save error:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectCls = "w-full h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-card rounded-2xl shadow-elevated w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - more human, less AI */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={dcLogo} alt="DekhoCampus" className="w-10 h-10 object-contain rounded-full bg-primary-foreground/20 p-1" />
            <div>
              <h3 className="font-bold text-primary-foreground text-sm">Help Us Understand You Better</h3>
              <p className="text-[11px] text-primary-foreground/80">So we can give you the best guidance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-primary-foreground/80 hover:text-primary-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-2.5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={formData.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your Name *"
              className="pl-10 rounded-xl h-10 text-sm"
              required
            />
          </div>

          {/* Phone with +91 */}
          <div className="relative flex items-center gap-0">
            <span className="flex-shrink-0 px-3 py-2.5 bg-muted rounded-l-xl border border-r-0 border-border text-sm text-muted-foreground font-medium">+91</span>
            <Input
              value={formData.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="Mobile Number *"
              type="tel"
              className="rounded-l-none rounded-r-xl h-10 text-sm"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="Email (optional)"
              type="email"
              className="pl-10 rounded-xl h-10 text-sm"
            />
          </div>

          {/* Education status */}
          <select
            value={formData.education}
            onChange={(e) => update("education", e.target.value)}
            className={selectCls}
          >
            <option value="">Current Education Status</option>
            {educationStatus.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Course select */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={formData.course}
              onChange={(e) => update("course", e.target.value)}
              className={`${selectCls} pl-10`}
            >
              <option value="">Interested Course</option>
              {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {formData.course === "Other" && (
            <Input
              value={formData.otherCourse}
              onChange={(e) => update("otherCourse", e.target.value)}
              placeholder="Enter your course interest"
              className="rounded-xl h-10 text-sm"
            />
          )}

          {/* State & City */}
          <div className="grid grid-cols-2 gap-2">
            <SearchableSelect
              options={indianStates}
              value={formData.state}
              onChange={(v) => { update("state", v); update("city", ""); }}
              placeholder="State"
            />
            <SearchableSelect
              options={cities}
              value={formData.city}
              onChange={(v) => update("city", v)}
              placeholder={formData.state ? "City" : "Select state first"}
            />
          </div>

          {/* Authorization checkbox */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={authorized} onChange={e => setAuthorized(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-border text-primary accent-primary" />
            <span className="text-[11px] text-muted-foreground leading-tight">
              I authorize DekhoCampus to contact me with updates via Email, SMS, WhatsApp & Call. <a href="/terms" className="text-primary underline">T&C apply</a>
            </span>
          </label>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-xl h-11 text-sm" disabled={isLoading || !authorized}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {isLoading ? "Saving..." : "Get Expert Guidance"}
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            Our counselors will reach out within 30 minutes
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}
