import { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, User, Mail, Phone, BookOpen, MapPin, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const LEAD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-lead`;

const courseOptions = [
  "B.Tech / B.E.", "MBBS / BDS", "B.Com / BBA / MBA", "B.Sc / M.Sc",
  "B.A / M.A", "Law (LLB)", "Design / Architecture", "Other",
];

const stateOptions = [
  "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Haryana", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other",
];

interface AILeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; course: string; state: string; city: string }) => void;
}

export function AILeadForm({ isOpen, onClose, onSubmit }: AILeadFormProps) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", course: "", state: "", city: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const update = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Please fill name and phone number");
      return;
    }
    setIsLoading(true);
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
          current_situation: formData.course || null, source: "ai_chat_lead",
        }),
      });
      onSubmit({ name: formData.name, course: formData.course, state: formData.state, city: formData.city });
    } catch (error) {
      console.error("Lead save error:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectCls = "w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-foreground/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl shadow-elevated p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Before we start</h3>
              <p className="text-xs text-muted-foreground">Help us give you better recommendations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={formData.name} onChange={(e) => update("name", e.target.value)} placeholder="Your Name *" className="pl-10 rounded-xl" required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={formData.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" type="email" className="pl-10 rounded-xl" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={formData.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone Number *" type="tel" className="pl-10 rounded-xl" required />
          </div>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select value={formData.course} onChange={(e) => update("course", e.target.value)} className={`${selectCls} pl-10`}>
              <option value="">Select Course</option>
              {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select value={formData.state} onChange={(e) => update("state", e.target.value)} className={selectCls}>
              <option value="">State</option>
              {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input value={formData.city} onChange={(e) => update("city", e.target.value)} placeholder="City" className="pl-10 rounded-xl" />
            </div>
          </div>
          <Button type="submit" className="w-full gradient-primary btn-glow rounded-xl" disabled={isLoading}>
            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <>Start AI Chat <Send className="w-4 h-4 ml-2" /></>}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">
            By submitting, you agree to receive guidance from our counselors
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}
