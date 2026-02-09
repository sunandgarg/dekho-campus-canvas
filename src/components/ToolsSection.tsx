import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Calculator, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define college data and conversion functions
const collegeData: Record<string, {
  name: string; location: string; ranking: number; fees: string; avgPackage: string; courses: number; acceptanceRate: string; campusSize: string;
}> = {
  "IIT Delhi": { name: "IIT Delhi", location: "New Delhi", ranking: 1, fees: "₹2.5L/year", avgPackage: "₹25 LPA", courses: 50, acceptanceRate: "1.2%", campusSize: "320 acres" },
  "IIT Bombay": { name: "IIT Bombay", location: "Mumbai", ranking: 2, fees: "₹2.5L/year", avgPackage: "₹28 LPA", courses: 45, acceptanceRate: "1.0%", campusSize: "550 acres" },
  "BITS Pilani": { name: "BITS Pilani", location: "Rajasthan", ranking: 5, fees: "₹5L/year", avgPackage: "₹18 LPA", courses: 40, acceptanceRate: "3.5%", campusSize: "1500 acres" },
  "NIT Trichy": { name: "NIT Trichy", location: "Tamil Nadu", ranking: 8, fees: "₹1.5L/year", avgPackage: "₹15 LPA", courses: 35, acceptanceRate: "2.8%", campusSize: "800 acres" },
};
const collegeOptions = Object.keys(collegeData);
const sgpaToPercentage = (sgpa: number) => (sgpa - 0.75) * 10;
const cgpaToPercentage = (cgpa: number) => (cgpa - 0.75) * 10;
const sgpaToCgpa = (sgpa: number) => sgpa;
type ConverterType = "sgpa-percentage" | "cgpa-percentage" | "sgpa-cgpa";

const toolCards = [
  { id: "compare", title: "Compare Colleges", desc: "Side-by-side comparison", icon: Building2, gradient: "from-teal-400 to-emerald-500" },
  { id: "converter", title: "Academic Converter", desc: "CGPA/SGPA to Percentage", icon: Calculator, gradient: "from-primary to-accent" },
];

export function ToolsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState("compare");

  const [college1, setCollege1] = useState("");
  const [college2, setCollege2] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [filteredColleges1, setFilteredColleges1] = useState<string[]>([]);
  const [filteredColleges2, setFilteredColleges2] = useState<string[]>([]);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [converterType, setConverterType] = useState<ConverterType>("sgpa-percentage");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const handleCollegeSearch = (value: string, which: 1 | 2) => {
    const setter = which === 1 ? setCollege1 : setCollege2;
    const setFiltered = which === 1 ? setFilteredColleges1 : setFilteredColleges2;
    const setShow = which === 1 ? setShowDropdown1 : setShowDropdown2;
    setter(value);
    setShowComparison(false);
    if (value) {
      setFiltered(collegeOptions.filter(c => c.toLowerCase().includes(value.toLowerCase())));
      setShow(true);
    } else {
      setFiltered([]);
      setShow(false);
    }
  };

  const handleCompare = () => {
    if (collegeData[college1] && collegeData[college2]) setShowComparison(true);
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;
    let r: number;
    switch (converterType) {
      case "sgpa-percentage": r = sgpaToPercentage(value); break;
      case "cgpa-percentage": r = cgpaToPercentage(value); break;
      case "sgpa-cgpa": r = sgpaToCgpa(value); break;
      default: r = 0;
    }
    setResult(Math.round(r * 100) / 100);
  };

  const getConverterLabel = () => {
    switch (converterType) {
      case "sgpa-percentage": return { input: "Enter your SGPA", output: "Your percentage is" };
      case "cgpa-percentage": return { input: "Enter your CGPA", output: "Your percentage is" };
      case "sgpa-cgpa": return { input: "Enter your SGPA", output: "Your CGPA is" };
    }
  };

  return (
    <section className="py-10 md:py-16 bg-muted/20" aria-labelledby="tools-heading">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 id="tools-heading" className="text-headline font-bold text-foreground">
            Helpful <span className="text-gradient-accent">Tools</span> for You
          </h2>
          <p className="mt-2 text-muted-foreground">Quick utilities to make your college journey easier</p>
        </motion.div>

        {/* Tool selector carousel */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {toolCards.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${
                activeTool === tool.id
                  ? "bg-card border-primary/30 shadow-md"
                  : "bg-card/50 border-border hover:border-primary/20"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                <tool.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-foreground">{tool.title}</p>
                <p className="text-xs text-muted-foreground">{tool.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Active tool content */}
        <motion.div key={activeTool} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 shadow-sm max-w-2xl mx-auto">
          {activeTool === "compare" && (
            <>
              <div className="space-y-3 mb-4">
                {[{ val: college1, filtered: filteredColleges1, show: showDropdown1, which: 1 as const },
                  { val: college2, filtered: filteredColleges2, show: showDropdown2, which: 2 as const }].map((item) => (
                  <div key={item.which} className="relative">
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 rounded-xl border border-border focus-within:border-primary/50">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={item.val}
                        onChange={(e) => handleCollegeSearch(e.target.value, item.which)}
                        onFocus={() => item.val && (item.which === 1 ? setShowDropdown1(true) : setShowDropdown2(true))}
                        onBlur={() => setTimeout(() => (item.which === 1 ? setShowDropdown1(false) : setShowDropdown2(false)), 200)}
                        placeholder={`Search ${item.which === 1 ? "first" : "second"} college...`}
                        className="flex-1 bg-transparent border-0 text-sm placeholder:text-muted-foreground focus:outline-none"
                      />
                    </div>
                    {item.show && item.filtered.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-40 overflow-y-auto">
                        {item.filtered.map((c) => (
                          <button key={c} onClick={() => { (item.which === 1 ? setCollege1 : setCollege2)(c); (item.which === 1 ? setShowDropdown1 : setShowDropdown2)(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">{c}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button onClick={handleCompare} disabled={!collegeData[college1] || !collegeData[college2]} className="gradient-primary text-primary-foreground rounded-xl">
                Compare Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {showComparison && collegeData[college1] && collegeData[college2] && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center font-semibold py-2">{collegeData[college1].name}</div>
                  <div className="text-center text-muted-foreground py-2">vs</div>
                  <div className="text-center font-semibold py-2">{collegeData[college2].name}</div>
                  {[
                    { label: "Ranking", v1: `#${collegeData[college1].ranking}`, v2: `#${collegeData[college2].ranking}` },
                    { label: "Fees", v1: collegeData[college1].fees, v2: collegeData[college2].fees },
                    { label: "Avg Package", v1: collegeData[college1].avgPackage, v2: collegeData[college2].avgPackage },
                    { label: "Acceptance", v1: collegeData[college1].acceptanceRate, v2: collegeData[college2].acceptanceRate },
                  ].map((row) => (
                    <>
                      <div className="text-center bg-muted/50 rounded-lg py-2">{row.v1}</div>
                      <div className="text-center text-xs text-muted-foreground py-2">{row.label}</div>
                      <div className="text-center bg-muted/50 rounded-lg py-2">{row.v2}</div>
                    </>
                  ))}
                </motion.div>
              )}
            </>
          )}
          {activeTool === "converter" && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {(["sgpa-percentage", "cgpa-percentage", "sgpa-cgpa"] as ConverterType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setConverterType(t); setResult(null); setInputValue(""); }}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${converterType === t ? "gradient-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"}`}
                  >
                    {t === "sgpa-percentage" ? "SGPA → %" : t === "cgpa-percentage" ? "CGPA → %" : "SGPA → CGPA"}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mb-4">
                <Input type="number" step="0.01" min="0" max="10" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={getConverterLabel().input} className="flex-1 rounded-xl" />
                <Button onClick={handleConvert} className="gradient-primary text-primary-foreground rounded-xl px-6">Convert</Button>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">{getConverterLabel().output}</p>
                <p className="text-4xl font-bold text-foreground">
                  {result !== null ? <>{result}<span className="text-2xl text-muted-foreground ml-1">{converterType.includes("percentage") ? "%" : ""}</span></> : <span className="text-muted-foreground">--.--%</span>}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
