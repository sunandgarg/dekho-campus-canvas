import { AdminLayout } from "@/components/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AdminLeads() {
  const { data: leads, isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      // Service role would be needed for real access. This shows the structure.
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AdminLayout title="Leads">
      <p className="text-sm text-muted-foreground mb-4">
        Recent leads captured from forms and chatbot. Note: Leads are read via service role access.
      </p>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading leads...</div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Phone</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">City</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Source</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Query</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads?.map((lead) => (
                  <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-3 font-medium text-foreground">{lead.name || "—"}</td>
                    <td className="p-3 text-muted-foreground">{lead.phone || "—"}</td>
                    <td className="p-3 text-muted-foreground">{lead.city || "—"}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{lead.source || "unknown"}</Badge>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{lead.initial_query || "—"}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {lead.created_at ? format(new Date(lead.created_at), "MMM d, yyyy") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!leads || leads.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">No leads captured yet.</div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
