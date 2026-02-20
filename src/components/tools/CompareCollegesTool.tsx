import { useState, useMemo } from "react";
import { Search, ArrowRight, X, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface CompareCollegesToolProps {
  preSelectedSlug?: string;
}

export function CompareCollegesTool({ preSelectedSlug }: CompareCollegesToolProps) {
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  const [slug1, setSlug1] = useState<string | null>(preSelectedSlug || null);
  const [slug2, setSlug2] = useState<string | null>(null);
  const [showDrop1, setShowDrop1] = useState(false);
  const [showDrop2, setShowDrop2] = useState(false);

  const { data: allColleges = [] } = useQuery({
    queryKey: ["compare-colleges-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("colleges")
        .select("slug, name, short_name, city, state, type, category, rating, fees, placement, ranking, established, naac_grade, approvals, courses_count, logo")
        .eq("is_active", true)
        .order("rating", { ascending: false });
      return data || [];
    },
  });

  // Set initial query text for pre-selected college
  useState(() => {
    if (preSelectedSlug && allColleges.length > 0) {
      const found = allColleges.find(c => c.slug === preSelectedSlug);
      if (found) setQuery1(found.name);
    }
  });

  const filtered1 = useMemo(() => {
    if (!query1 || slug1) return [];
    return allColleges.filter(c =>
      c.name.toLowerCase().includes(query1.toLowerCase()) ||
      (c.short_name && c.short_name.toLowerCase().includes(query1.toLowerCase()))
    ).slice(0, 8);
  }, [query1, allColleges, slug1]);

  const filtered2 = useMemo(() => {
    if (!query2 || slug2) return [];
    return allColleges.filter(c =>
      c.slug !== slug1 &&
      (c.name.toLowerCase().includes(query2.toLowerCase()) ||
      (c.short_name && c.short_name.toLowerCase().includes(query2.toLowerCase())))
    ).slice(0, 8);
  }, [query2, allColleges, slug1, slug2]);

  const college1 = allColleges.find(c => c.slug === slug1);
  const college2 = allColleges.find(c => c.slug === slug2);

  // Update query1 text when preSelectedSlug college data loads
  useMemo(() => {
    if (preSelectedSlug && college1 && !query1) {
      setQuery1(college1.name);
    }
  }, [college1, preSelectedSlug]);

  const selectCollege = (slug: string, name: string, which: 1 | 2) => {
    if (which === 1) { setSlug1(slug); setQuery1(name); setShowDrop1(false); }
    else { setSlug2(slug); setQuery2(name); setShowDrop2(false); }
  };

  const clearSelection = (which: 1 | 2) => {
    if (which === 1) { setSlug1(null); setQuery1(""); }
    else { setSlug2(null); setQuery2(""); }
  };

  const swapColleges = () => {
    setSlug1(slug2);
    setSlug2(slug1);
    setQuery1(query2);
    setQuery2(query1);
  };

  const comparisonFields = college1 && college2 ? [
    { label: "Type", v1: college1.type, v2: college2.type },
    { label: "Category", v1: college1.category, v2: college2.category },
    { label: "Rating", v1: `${college1.rating}/5`, v2: `${college2.rating}/5`, highlight: Number(college1.rating) !== Number(college2.rating) },
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
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        {/* College 1 */}
        <div className="relative flex-1">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 rounded-xl border border-border focus-within:border-primary/40">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query1}
              onChange={(e) => { setQuery1(e.target.value); setShowDrop1(true); setSlug1(null); }}
              onFocus={() => !slug1 && query1 && setShowDrop1(true)}
              onBlur={() => setTimeout(() => setShowDrop1(false), 200)}
              placeholder="Search first college..."
              className="flex-1 bg-transparent border-0 text-sm focus:outline-none"
            />
            {slug1 && (
              <button onClick={() => clearSelection(1)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {showDrop1 && filtered1.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {filtered1.map(c => (
                <button
                  key={c.slug}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectCollege(c.slug, c.name, 1)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors border-b border-border/30 last:border-0"
                >
                  <span className="font-medium">{c.short_name || c.name}</span>
                  <span className="text-muted-foreground ml-1">— {c.city}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap button */}
        <button
          onClick={swapColleges}
          className="self-center w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shrink-0"
          aria-label="Swap colleges"
        >
          <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* College 2 */}
        <div className="relative flex-1">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 rounded-xl border border-border focus-within:border-primary/40">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query2}
              onChange={(e) => { setQuery2(e.target.value); setShowDrop2(true); setSlug2(null); }}
              onFocus={() => !slug2 && query2 && setShowDrop2(true)}
              onBlur={() => setTimeout(() => setShowDrop2(false), 200)}
              placeholder="Search second college..."
              className="flex-1 bg-transparent border-0 text-sm focus:outline-none"
            />
            {slug2 && (
              <button onClick={() => clearSelection(2)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {showDrop2 && filtered2.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {filtered2.map(c => (
                <button
                  key={c.slug}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectCollege(c.slug, c.name, 2)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors border-b border-border/30 last:border-0"
                >
                  <span className="font-medium">{c.short_name || c.name}</span>
                  <span className="text-muted-foreground ml-1">— {c.city}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison table */}
      {college1 && college2 && (
        <div className="rounded-xl border border-border overflow-hidden mt-4">
          {/* Header */}
          <div className="grid grid-cols-3 bg-primary/10">
            <div className="p-3 text-center">
              <Link to={`/colleges/${college1.slug}`} className="font-semibold text-sm text-primary hover:underline">{college1.short_name || college1.name}</Link>
            </div>
            <div className="p-3 text-center text-xs text-muted-foreground font-medium flex items-center justify-center">VS</div>
            <div className="p-3 text-center">
              <Link to={`/colleges/${college2.slug}`} className="font-semibold text-sm text-primary hover:underline">{college2.short_name || college2.name}</Link>
            </div>
          </div>
          {/* Rows */}
          {comparisonFields.map((r, i) => (
            <div key={r.label} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
              <div className="p-2.5 text-center text-sm text-foreground border-r border-border/50">{r.v1}</div>
              <div className="p-2.5 text-center text-xs text-muted-foreground font-medium">{r.label}</div>
              <div className="p-2.5 text-center text-sm text-foreground border-l border-border/50">{r.v2}</div>
            </div>
          ))}
          {/* View detail links */}
          <div className="grid grid-cols-3 bg-muted/30 border-t border-border">
            <div className="p-3 text-center">
              <Link to={`/colleges/${college1.slug}`} className="text-xs text-primary font-medium hover:underline">View Details →</Link>
            </div>
            <div className="p-3" />
            <div className="p-3 text-center">
              <Link to={`/colleges/${college2.slug}`} className="text-xs text-primary font-medium hover:underline">View Details →</Link>
            </div>
          </div>
        </div>
      )}

      {!college1 || !college2 ? (
        <p className="text-xs text-muted-foreground text-center py-2">Select both colleges above to see comparison</p>
      ) : null}
    </div>
  );
}
