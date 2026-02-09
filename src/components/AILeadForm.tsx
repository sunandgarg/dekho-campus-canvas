import { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
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
        {/* Header */}
        <div className="gradient-primary px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
            <div>
              <h3 className="font-bold text-primary-foreground text-sm">Quick Details</h3>
              <p className="text-[11px] text-primary-foreground/80">Get personalized AI guidance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-primary-foreground/80 hover:text-primary-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <Input
            value={formData.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your Name *"
            className="rounded-xl h-10 text-sm"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="Email"
              type="email"
              className="rounded-xl h-10 text-sm"
            />
            <Input
              value={formData.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="Phone *"
              type="tel"
              className="rounded-xl h-10 text-sm"
              required
            />
          </div>
          <select
            value={formData.course}
            onChange={(e) => update("course", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select Course Interest</option>
            {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={formData.state}
              onChange={(e) => update("state", e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">State</option>
              {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Input
              value={formData.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="City"
              className="rounded-xl h-10 text-sm"
            />
          </div>
          <Button type="submit" className="w-full gradient-primary rounded-xl h-11" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {isLoading ? "Saving..." : "Start AI Chat"}
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            By submitting, you agree to receive guidance from our counselors
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}
