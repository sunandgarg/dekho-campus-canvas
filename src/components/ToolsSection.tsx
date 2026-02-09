import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Calculator, GraduationCap, Search, ArrowRight, Percent, IndianRupee, BarChart3, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Tools data
const tools = [
  { id: "compare", title: "Compare Colleges", desc: "Side-by-side college comparison", icon: Building2 },
  { id: "converter", title: "CGPA Converter", desc: "SGPA/CGPA to Percentage", icon: Percent },
  { id: "emi", title: "EMI Calculator", desc: "Education loan EMI planner", icon: IndianRupee },
  { id: "rank", title: "Rank Predictor", desc: "Predict your rank from score", icon: BarChart3 },
  { id: "eligibility", title: "Eligibility Checker", desc: "Check college eligibility", icon: FileCheck },
];

// College compare data
const collegeData: Record<string, { name: string; ranking: number; fees: string; avgPackage: string; acceptanceRate: string }> = {
  "IIT Delhi": { name: "IIT Delhi", ranking: 1, fees: "₹2.5L/yr", avgPackage: "₹25 LPA", acceptanceRate: "1.2%" },
  "IIT Bombay": { name: "IIT Bombay", ranking: 2, fees: "₹2.5L/yr", avgPackage: "₹28 LPA", acceptanceRate: "1.0%" },
  "BITS Pilani": { name: "BITS Pilani", ranking: 5, fees: "₹5L/yr", avgPackage: "₹18 LPA", acceptanceRate: "3.5%" },
  "NIT Trichy": { name: "NIT Trichy", ranking: 8, fees: "₹1.5L/yr", avgPackage: "₹15 LPA", acceptanceRate: "2.8%" },
};
const collegeOptions = Object.keys(collegeData);

type ConverterType = "sgpa-percentage" | "cgpa-percentage" | "sgpa-cgpa";

export function ToolsSection() {
  const [activeTool, setActiveTool] = useState("compare");

  // Compare state
  const [college1, setCollege1] = useState("");
  const [college2, setCollege2] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [showDrop1, setShowDrop1] = useState(false);
  const [showDrop2, setShowDrop2] = useState(false);
  const [filtered1, setFiltered1] = useState<string[]>([]);
  const [filtered2, setFiltered2] = useState<string[]>([]);

  // Converter state
  const [converterType, setConverterType] = useState<ConverterType>("sgpa-percentage");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<number | null>(null);

  // EMI state
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState<number | null>(null);

  // Rank predictor state
  const [examName, setExamName] = useState("JEE Main");
  const [score, setScore] = useState("");
  const [predictedRank, setPredictedRank] = useState<string | null>(null);

  // Eligibility state
  const [eligPercentage, setEligPercentage] = useState("");
  const [eligCategory, setEligCategory] = useState("General");
  const [eligResult, setEligResult] = useState<string[] | null>(null);

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

  const handleConvert = () => {
    const v = parseFloat(inputValue);
    if (isNaN(v)) return;
    const r = converterType === "sgpa-cgpa" ? v : (v - 0.75) * 10;
    setResult(Math.round(r * 100) / 100);
  };

  const handleEmi = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(tenure) * 12;
    if (isNaN(P) || isNaN(r) || isNaN(n) || n === 0) return;
    const e = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(Math.round(e));
  };

  const handleRankPredict = () => {
    const s = parseFloat(score);
    if (isNaN(s)) return;
    // Simplified prediction formula
    const ranks: Record<string, (s: number) => string> = {
      "JEE Main": (s) => s >= 250 ? "Under 1,000" : s >= 200 ? "1,000 - 5,000" : s >= 150 ? "5,000 - 25,000" : s >= 100 ? "25,000 - 1,00,000" : "Above 1,00,000",
      "NEET": (s) => s >= 650 ? "Under 1,000" : s >= 550 ? "1,000 - 10,000" : s >= 450 ? "10,000 - 50,000" : s >= 350 ? "50,000 - 2,00,000" : "Above 2,00,000",
      "CAT": (s) => s >= 99 ? "Under 100" : s >= 95 ? "100 - 500" : s >= 90 ? "500 - 2,000" : s >= 80 ? "2,000 - 10,000" : "Above 10,000",
    };
    setPredictedRank(ranks[examName]?.(s) ?? "N/A");
  };

  const handleEligibility = () => {
    const p = parseFloat(eligPercentage);
    if (isNaN(p)) return;
    const results: string[] = [];
    if (p >= 75 || (eligCategory !== "General" && p >= 65)) results.push("IITs (via JEE Advanced)");
    if (p >= 75 || (eligCategory !== "General" && p >= 65)) results.push("NITs (via JEE Main)");
    if (p >= 60) results.push("State Engineering Colleges");
    if (p >= 50) results.push("NEET eligible medical colleges");
    if (p >= 50) results.push("Most Private Universities");
    if (results.length === 0) results.push("Check specific college requirements");
    setEligResult(results);
  };

  const converterLabels: Record<ConverterType, { input: string; output: string }> = {
    "sgpa-percentage": { input: "Enter SGPA (0-10)", output: "Percentage" },
    "cgpa-percentage": { input: "Enter CGPA (0-10)", output: "Percentage" },
    "sgpa-cgpa": { input: "Enter SGPA (0-10)", output: "CGPA" },
  };

  return (
    <section className="py-12 md:py-16 bg-muted/20" aria-labelledby="tools-heading">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
            <Calculator className="w-4 h-4" />
            Student Toolkit
          </div>
          <h2 id="tools-heading" className="text-headline font-bold text-foreground">
            Helpful <span className="text-gradient-accent">Tools</span> for You
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">Quick utilities to make your education journey easier</p>
        </motion.div>

        {/* Tool selector */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                activeTool === tool.id
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
              }`}
            >
              <tool.icon className="w-4 h-4" />
              {tool.title}
            </button>
          ))}
        </div>

        {/* Tool content */}
        <motion.div key={activeTool} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-5 md:p-6 max-w-2xl mx-auto shadow-sm">

          {/* Compare Colleges */}
          {activeTool === "compare" && (
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
          )}

          {/* CGPA Converter */}
          {activeTool === "converter" && (
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Academic Score Converter</h3>
              <div className="flex flex-wrap gap-2">
                {(["sgpa-percentage", "cgpa-percentage", "sgpa-cgpa"] as ConverterType[]).map(t => (
                  <button key={t} onClick={() => { setConverterType(t); setResult(null); setInputValue(""); }}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${converterType === t ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}>
                    {t === "sgpa-percentage" ? "SGPA → %" : t === "cgpa-percentage" ? "CGPA → %" : "SGPA → CGPA"}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Input type="number" step="0.01" min="0" max="10" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={converterLabels[converterType].input} className="flex-1 rounded-xl" />
                <Button onClick={handleConvert} className="gradient-primary text-primary-foreground rounded-xl">Convert</Button>
              </div>
              <div className="bg-muted/40 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{converterLabels[converterType].output}</p>
                <p className="text-3xl font-bold text-foreground">{result !== null ? `${result}${converterType.includes("percentage") ? "%" : ""}` : "--"}</p>
              </div>
            </div>
          )}

          {/* EMI Calculator */}
          {activeTool === "emi" && (
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Education Loan EMI Calculator</h3>
              <p className="text-sm text-muted-foreground">Plan your education loan with our easy EMI calculator.</p>
              <div className="grid grid-cols-3 gap-3">
                <Input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} placeholder="Loan (₹)" className="rounded-xl" />
                <Input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="Rate (%)" className="rounded-xl" />
                <Input type="number" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="Years" className="rounded-xl" />
              </div>
              <Button onClick={handleEmi} className="gradient-primary text-primary-foreground rounded-xl w-full">Calculate EMI</Button>
              {emi !== null && (
                <div className="bg-muted/40 rounded-xl p-4 text-center space-y-1">
                  <p className="text-xs text-muted-foreground">Monthly EMI</p>
                  <p className="text-3xl font-bold text-foreground">₹{emi.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">Total payable: ₹{(emi * parseFloat(tenure) * 12).toLocaleString("en-IN")}</p>
                </div>
              )}
            </div>
          )}

          {/* Rank Predictor */}
          {activeTool === "rank" && (
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Exam Rank Predictor</h3>
              <p className="text-sm text-muted-foreground">Get an estimated rank based on your expected score.</p>
              <div className="flex gap-2">
                {["JEE Main", "NEET", "CAT"].map(e => (
                  <button key={e} onClick={() => { setExamName(e); setPredictedRank(null); }}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${examName === e ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{e}</button>
                ))}
              </div>
              <div className="flex gap-3">
                <Input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder={examName === "CAT" ? "Percentile (0-100)" : "Expected Score"} className="flex-1 rounded-xl" />
                <Button onClick={handleRankPredict} className="gradient-primary text-primary-foreground rounded-xl">Predict</Button>
              </div>
              {predictedRank && (
                <div className="bg-muted/40 rounded-xl p-4 text-center space-y-1">
                  <p className="text-xs text-muted-foreground">Predicted Rank Range</p>
                  <p className="text-2xl font-bold text-foreground">{predictedRank}</p>
                  <p className="text-xs text-muted-foreground">*Based on previous year trends. Actual rank may vary.</p>
                </div>
              )}
            </div>
          )}

          {/* Eligibility Checker */}
          {activeTool === "eligibility" && (
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">College Eligibility Checker</h3>
              <p className="text-sm text-muted-foreground">Check which colleges you're eligible for based on your academics.</p>
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" value={eligPercentage} onChange={e => setEligPercentage(e.target.value)} placeholder="12th % or CGPA×9.5" className="rounded-xl" />
                <select value={eligCategory} onChange={e => setEligCategory(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {["General", "OBC", "SC", "ST", "EWS"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Button onClick={handleEligibility} className="gradient-primary text-primary-foreground rounded-xl w-full">Check Eligibility</Button>
              {eligResult && (
                <div className="bg-muted/40 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-foreground">You're eligible for:</p>
                  <ul className="space-y-1.5">
                    {eligResult.map(r => (
                      <li key={r} className="flex items-center gap-2 text-sm text-foreground">
                        <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
