import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

interface LeadGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  source?: string;
  /** Called after successful lead submission */
  onSuccess?: () => void;
}

export function LeadGateDialog({
  open,
  onOpenChange,
  title = "🎯 Apply Now — Get Free Counseling!",
  subtitle = "Fill the form & get ₹999 counselling session FREE!",
  source = "lead_gate",
  onSuccess,
}: LeadGateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-1 gap-0">
        <LeadCaptureForm
          variant="card"
          title={title}
          subtitle={subtitle}
          source={source}
        />
      </DialogContent>
    </Dialog>
  );
}
