import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const collegeData: Record<string, { name: string; ranking: number; fees: string; avgPackage: string; acceptanceRate: string }> = {
  "IIT Delhi": { name: "IIT Delhi", ranking: 1, fees: "₹2.5L/yr", avgPackage: "₹25 LPA", acceptanceRate: "1.2%" },
  "IIT Bombay": { name: "IIT Bombay", ranking: 2, fees: "₹2.5L/yr", avgPackage: "₹28 LPA", acceptanceRate: "1.0%" },
  "IIT Madras": { name: "IIT Madras", ranking: 3, fees: "₹2.5L/yr", avgPackage: "₹22 LPA", acceptanceRate: "1.1%" },
  "IIT Kanpur": { name: "IIT Kanpur", ranking: 4, fees: "₹2.5L/yr", avgPackage: "₹20 LPA", acceptanceRate: "1.5%" },
  "BITS Pilani": { name: "BITS Pilani", ranking: 5, fees: "₹5L/yr", avgPackage: "₹18 LPA", acceptanceRate: "3.5%" },
  "NIT Trichy": { name: "NIT Trichy", ranking: 8, fees: "₹1.5L/yr", avgPackage: "₹15 LPA", acceptanceRate: "2.8%" },
  "VIT Vellore": { name: "VIT Vellore", ranking: 12, fees: "₹3L/yr", avgPackage: "₹10 LPA", acceptanceRate: "15%" },
  "SRM Chennai": { name: "SRM Chennai", ranking: 15, fees: "₹3.5L/yr", avgPackage: "₹8 LPA", acceptanceRate: "20%" },
};
const collegeOptions = Object.keys(collegeData);

export function CompareCollegesTool() {
  const [college1, setCollege1] = useState("");
  const [college2, setCollege2] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [showDrop1, setShowDrop1] = useState(false);
  const [showDrop2, setShowDrop2] = useState(false);
  const [filtered1, setFiltered1] = useState<string[]>([]);
  const [filtered2, setFiltered2] = useState<string[]>([]);

  const searchCollege = (val: string, which: 1 | 2) => {
    const set = which === 1 ? setCollege1 : setCollege2;
    const setF = which === 1 ? setFiltered1 : setFiltered2;
    const setD = which === 1 ? setShowDrop1 : setShowDrop2;
    set(val);
    setShowComparison(false);
    if (val) {
      setF(collegeOptions.filter(c => c.toLowerCase().includes(val.toLowerCase())));
      setD(true);
    } else { setF([]); setD(false); }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground">Compare Colleges Side-by-Side</h3>
      <p className="text-sm text-muted-foreground">Select two colleges to see a detailed comparison of fees, placements, and rankings.</p>
      {[{ val: college1, filtered: filtered1, show: showDrop1, w: 1 as const },
        { val: college2, filtered: filtered2, show: showDrop2, w: 2 as const }].map((item) => (
        <div key={item.w} className="relative">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 rounded-xl border border-border focus-within:border-primary/40">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input type="text" value={item.val}
              onChange={(e) => searchCollege(e.target.value, item.w)}
              onFocus={() => item.val && (item.w === 1 ? setShowDrop1(true) : setShowDrop2(true))}
              onBlur={() => setTimeout(() => (item.w === 1 ? setShowDrop1(false) : setShowDrop2(false)), 200)}
              placeholder={`Search ${item.w === 1 ? "first" : "second"} college...`}
              className="flex-1 bg-transparent border-0 text-sm focus:outline-none" />
          </div>
          {item.show && item.filtered.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-40 overflow-y-auto">
              {item.filtered.map(c => (
                <button key={c} onClick={() => { (item.w === 1 ? setCollege1 : setCollege2)(c); (item.w === 1 ? setShowDrop1 : setShowDrop2)(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">{c}</button>
              ))}
            </div>
          )}
        </div>
      ))}
      <Button onClick={() => { if (collegeData[college1] && collegeData[college2]) setShowComparison(true); }} disabled={!collegeData[college1] || !collegeData[college2]} className="gradient-primary text-primary-foreground rounded-xl">
        Compare Now <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
      {showComparison && collegeData[college1] && collegeData[college2] && (
        <div className="grid grid-cols-3 gap-2 text-sm mt-4">
          <div className="text-center font-semibold py-2">{collegeData[college1].name}</div>
          <div className="text-center text-muted-foreground py-2">vs</div>
          <div className="text-center font-semibold py-2">{collegeData[college2].name}</div>
          {[{ l: "Ranking", v1: `#${collegeData[college1].ranking}`, v2: `#${collegeData[college2].ranking}` },
            { l: "Fees", v1: collegeData[college1].fees, v2: collegeData[college2].fees },
            { l: "Avg Package", v1: collegeData[college1].avgPackage, v2: collegeData[college2].avgPackage },
            { l: "Acceptance", v1: collegeData[college1].acceptanceRate, v2: collegeData[college2].acceptanceRate }
          ].map(r => (
            <div key={r.l} className="contents">
              <div className="text-center bg-muted/50 rounded-lg py-2">{r.v1}</div>
              <div className="text-center text-xs text-muted-foreground py-2">{r.l}</div>
              <div className="text-center bg-muted/50 rounded-lg py-2">{r.v2}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
