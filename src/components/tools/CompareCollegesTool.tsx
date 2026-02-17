import { useState, useMemo } from "react";
import { Search, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function CompareCollegesTool() {
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  const [slug1, setSlug1] = useState<string | null>(null);
  const [slug2, setSlug2] = useState<string | null>(null);
  const [showDrop1, setShowDrop1] = useState(false);
  const [showDrop2, setShowDrop2] = useState(false);

  // Fetch all college names for autocomplete
  const { data: allColleges = [] } = useQuery({
    queryKey: ["compare-colleges-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("colleges")
        .select("slug, name, short_name, city, state, type, category, rating, fees, placement, ranking, established, naac_grade, approvals, courses_count")
        .eq("is_active", true)
        .order("rating", { ascending: false });
      return data || [];
    },
  });

  const filtered1 = useMemo(() => {
    if (!query1) return [];
    return allColleges.filter(c =>
      c.name.toLowerCase().includes(query1.toLowerCase()) ||
      c.short_name.toLowerCase().includes(query1.toLowerCase())
    ).slice(0, 8);
  }, [query1, allColleges]);

  const filtered2 = useMemo(() => {
    if (!query2) return [];
    return allColleges.filter(c =>
      c.name.toLowerCase().includes(query2.toLowerCase()) ||
      c.short_name.toLowerCase().includes(query2.toLowerCase())
    ).slice(0, 8);
  }, [query2, allColleges]);

  const college1 = allColleges.find(c => c.slug === slug1);
  const college2 = allColleges.find(c => c.slug === slug2);

  const selectCollege = (slug: string, name: string, which: 1 | 2) => {
    if (which === 1) { setSlug1(slug); setQuery1(name); setShowDrop1(false); }
    else { setSlug2(slug); setQuery2(name); setShowDrop2(false); }
  };

  const clearSelection = (which: 1 | 2) => {
    if (which === 1) { setSlug1(null); setQuery1(""); }
    else { setSlug2(null); setQuery2(""); }
  };

  const comparisonFields = college1 && college2 ? [
    { label: "Type", v1: college1.type, v2: college2.type },
    { label: "Category", v1: college1.category, v2: college2.category },
    { label: "Rating", v1: `${college1.rating}/5`, v2: `${college2.rating}/5` },
    { label: "Ranking", v1: college1.ranking || "N/A", v2: college2.ranking || "N/A" },
    { label: "Fees", v1: college1.fees || "N/A", v2: college2.fees || "N/A" },
    { label: "Placement", v1: college1.placement || "N/A", v2: college2.placement || "N/A" },
    { label: "Established", v1: String(college1.established), v2: String(college2.established) },
    { label: "NAAC Grade", v1: college1.naac_grade || "N/A", v2: college2.naac_grade || "N/A" },
    { label: "Location", v1: `${college1.city}, ${college1.state}`, v2: `${college2.city}, ${college2.state}` },
    { label: "Approvals", v1: (college1.approvals || []).join(", ") || "N/A", v2: (college2.approvals || []).join(", ") || "N/A" },
    { label: "Courses", v1: String(college1.courses_count), v2: String(college2.courses_count) },
  ] : [];

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground">Compare Colleges Side-by-Side</h3>
      <p className="text-sm text-muted-foreground">Select two colleges to see a detailed comparison of fees, placements, rankings & more.</p>

      {/* College search inputs */}
      {([{ query: query1, setQuery: setQuery1, filtered: filtered1, show: showDrop1, setShow: setShowDrop1, slug: slug1, w: 1 as const },
        { query: query2, setQuery: setQuery2, filtered: filtered2, show: showDrop2, setShow: setShowDrop2, slug: slug2, w: 2 as const }]).map((item) => (
        <div key={item.w} className="relative">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 rounded-xl border border-border focus-within:border-primary/40">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={item.query}
              onChange={(e) => { item.setQuery(e.target.value); item.setShow(true); if (item.w === 1) setSlug1(null); else setSlug2(null); }}
              onFocus={() => item.query && item.setShow(true)}
              onBlur={() => setTimeout(() => item.setShow(false), 200)}
              placeholder={`Search ${item.w === 1 ? "first" : "second"} college...`}
              className="flex-1 bg-transparent border-0 text-sm focus:outline-none"
            />
            {item.slug && (
              <button onClick={() => clearSelection(item.w)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {item.show && item.filtered.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {item.filtered.map(c => (
                <button
                  key={c.slug}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectCollege(c.slug, c.name, item.w)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors border-b border-border/30 last:border-0"
                >
                  <span className="font-medium">{c.short_name}</span>
                  <span className="text-muted-foreground ml-1">— {c.name}, {c.city}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button
        onClick={() => {}}
        disabled={!college1 || !college2}
        className="gradient-primary text-primary-foreground rounded-xl"
      >
        Compare Now <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {/* Comparison table */}
      {college1 && college2 && (
        <div className="rounded-xl border border-border overflow-hidden mt-4">
          {/* Header */}
          <div className="grid grid-cols-3 bg-muted/50">
            <div className="p-3 text-center font-semibold text-sm text-foreground border-r border-border">{college1.short_name}</div>
            <div className="p-3 text-center text-xs text-muted-foreground font-medium">Parameter</div>
            <div className="p-3 text-center font-semibold text-sm text-foreground border-l border-border">{college2.short_name}</div>
          </div>
          {/* Rows */}
          {comparisonFields.map((r, i) => (
            <div key={r.label} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
              <div className="p-2.5 text-center text-sm text-foreground border-r border-border/50">{r.v1}</div>
              <div className="p-2.5 text-center text-xs text-muted-foreground font-medium">{r.label}</div>
              <div className="p-2.5 text-center text-sm text-foreground border-l border-border/50">{r.v2}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
