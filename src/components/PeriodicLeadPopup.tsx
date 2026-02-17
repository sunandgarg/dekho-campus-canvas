import { useState, useEffect } from "react";
import { LeadGateDialog } from "@/components/LeadGateDialog";

const POPUP_INTERVAL_MS = 90_000; // 90 seconds
const STORAGE_KEY = "dc_lead_popup_dismissed";

export function PeriodicLeadPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Don't show if user already submitted a lead recently
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    // Show after 30s initially, then every 90s
    const initialTimer = setTimeout(() => {
      setOpen(true);
    }, 30_000);

    const interval = setInterval(() => {
      const d = sessionStorage.getItem(STORAGE_KEY);
      if (!d) setOpen(true);
    }, POPUP_INTERVAL_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const handleClose = (val: boolean) => {
    setOpen(val);
    if (!val) {
      // Suppress for this session after dismissal
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  };

  return (
    <LeadGateDialog
      open={open}
      onOpenChange={handleClose}
      title="🎓 Get Free Guidance — Worth ₹999!"
      subtitle="Apply now for free counselling & personalized college recommendations"
      source="periodic_popup"
    />
  );
}
