import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Calculator, GraduationCap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sample college data
const collegeData: Record<string, { 
  name: string; 
  location: string; 
  ranking: number; 
  fees: string; 
  avgPackage: string; 
  courses: number;
  acceptanceRate: string;
  campusSize: string;
}> = {
  "IIT Delhi": {
    name: "IIT Delhi",
    location: "New Delhi",
    ranking: 1,
    fees: "₹2.5L/year",
    avgPackage: "₹25 LPA",
    courses: 50,
    acceptanceRate: "1.2%",
    campusSize: "320 acres",
  },
  "IIT Bombay": {
    name: "IIT Bombay",
    location: "Mumbai",
    ranking: 2,
    fees: "₹2.5L/year",
    avgPackage: "₹28 LPA",
    courses: 45,
    acceptanceRate: "1.0%",
    campusSize: "550 acres",
  },
  "BITS Pilani": {
    name: "BITS Pilani",
    location: "Rajasthan",
    ranking: 5,
    fees: "₹5L/year",
    avgPackage: "₹18 LPA",
    courses: 40,
    acceptanceRate: "3.5%",
    campusSize: "1500 acres",
  },
  "NIT Trichy": {
    name: "NIT Trichy",
    location: "Tamil Nadu",
    ranking: 8,
    fees: "₹1.5L/year",
    avgPackage: "₹15 LPA",
    courses: 35,
    acceptanceRate: "2.8%",
    campusSize: "800 acres",
  },
};

const collegeOptions = Object.keys(collegeData);

// Conversion functions
const sgpaToPercentage = (sgpa: number) => (sgpa - 0.75) * 10;
const cgpaToPercentage = (cgpa: number) => (cgpa - 0.75) * 10;
const sgpaToCgpa = (sgpa: number) => sgpa; // Simplified - in reality depends on credits

type ConverterType = "sgpa-percentage" | "cgpa-percentage" | "sgpa-cgpa";

export function ToolsSection() {
  // Compare colleges state
  const [college1, setCollege1] = useState("");
  const [college2, setCollege2] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [filteredColleges1, setFilteredColleges1] = useState<string[]>([]);
  const [filteredColleges2, setFilteredColleges2] = useState<string[]>([]);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  // Converter state
  const [converterType, setConverterType] = useState<ConverterType>("sgpa-percentage");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<number | null>(null);

  // College search handlers
  const handleCollegeSearch1 = (value: string) => {
    setCollege1(value);
    setShowComparison(false);
    if (value) {
      const filtered = collegeOptions.filter(c => 
        c.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredColleges1(filtered);
      setShowDropdown1(true);
    } else {
      setFilteredColleges1([]);
      setShowDropdown1(false);
    }
  };

  const handleCollegeSearch2 = (value: string) => {
    setCollege2(value);
    setShowComparison(false);
    if (value) {
      const filtered = collegeOptions.filter(c => 
        c.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredColleges2(filtered);
      setShowDropdown2(true);
    } else {
      setFilteredColleges2([]);
      setShowDropdown2(false);
    }
  };

  const selectCollege1 = (college: string) => {
    setCollege1(college);
    setShowDropdown1(false);
  };

  const selectCollege2 = (college: string) => {
    setCollege2(college);
    setShowDropdown2(false);
  };

  const handleCompare = () => {
    if (collegeData[college1] && collegeData[college2]) {
      setShowComparison(true);
    }
  };

  // Converter handler
  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    let calculatedResult: number;
    switch (converterType) {
      case "sgpa-percentage":
        calculatedResult = sgpaToPercentage(value);
        break;
      case "cgpa-percentage":
        calculatedResult = cgpaToPercentage(value);
        break;
      case "sgpa-cgpa":
        calculatedResult = sgpaToCgpa(value);
        break;
      default:
        calculatedResult = 0;
    }
    setResult(Math.round(calculatedResult * 100) / 100);
  };

  const getConverterLabel = () => {
    switch (converterType) {
      case "sgpa-percentage":
        return { input: "Enter your SGPA", output: "Your percentage is" };
      case "cgpa-percentage":
        return { input: "Enter your CGPA", output: "Your percentage is" };
      case "sgpa-cgpa":
        return { input: "Enter your SGPA", output: "Your CGPA is" };
    }
  };

  return (
    <section className="py-16 bg-slate-50/50" aria-labelledby="tools-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 id="tools-heading" className="text-headline font-bold text-foreground">
            Helpful <span className="text-gradient-accent">Tools</span> for You
          </h2>
          <p className="mt-2 text-muted-foreground">
            Quick utilities to make your college journey easier
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Compare Colleges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Compare Colleges</h3>
                <p className="text-sm text-muted-foreground">Side-by-side comparison</p>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-4">
              Confused between colleges? Compare the colleges that are on your mind, to 
              see what all they provide and choose the best that you like.
            </p>

            {/* College inputs */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 rounded-xl border border-border focus-within:border-primary/50">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={college1}
                    onChange={(e) => handleCollegeSearch1(e.target.value)}
                    onFocus={() => college1 && setShowDropdown1(true)}
                    onBlur={() => setTimeout(() => setShowDropdown1(false), 200)}
                    placeholder="Search first college..."
                    className="flex-1 bg-transparent border-0 text-sm placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                {showDropdown1 && filteredColleges1.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-xl shadow-lg max-h-40 overflow-y-auto">
                    {filteredColleges1.map((c) => (
                      <button
                        key={c}
                        onClick={() => selectCollege1(c)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 rounded-xl border border-border focus-within:border-primary/50">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={college2}
                    onChange={(e) => handleCollegeSearch2(e.target.value)}
                    onFocus={() => college2 && setShowDropdown2(true)}
                    onBlur={() => setTimeout(() => setShowDropdown2(false), 200)}
                    placeholder="Search second college..."
                    className="flex-1 bg-transparent border-0 text-sm placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                {showDropdown2 && filteredColleges2.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-xl shadow-lg max-h-40 overflow-y-auto">
                    {filteredColleges2.map((c) => (
                      <button
                        key={c}
                        onClick={() => selectCollege2(c)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleCompare}
              disabled={!collegeData[college1] || !collegeData[college2]}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl"
            >
              Compare Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Comparison Results */}
            {showComparison && collegeData[college1] && collegeData[college2] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid grid-cols-3 gap-2 text-sm"
              >
                <div className="text-center font-semibold text-foreground py-2">
                  {collegeData[college1].name}
                </div>
                <div className="text-center font-medium text-muted-foreground py-2">
                  vs
                </div>
                <div className="text-center font-semibold text-foreground py-2">
                  {collegeData[college2].name}
                </div>

                {/* Ranking */}
                <div className="text-center bg-muted/50 rounded-lg py-2">#{collegeData[college1].ranking}</div>
                <div className="text-center text-xs text-muted-foreground py-2">Ranking</div>
                <div className="text-center bg-muted/50 rounded-lg py-2">#{collegeData[college2].ranking}</div>

                {/* Fees */}
                <div className="text-center bg-muted/50 rounded-lg py-2">{collegeData[college1].fees}</div>
                <div className="text-center text-xs text-muted-foreground py-2">Fees</div>
                <div className="text-center bg-muted/50 rounded-lg py-2">{collegeData[college2].fees}</div>

                {/* Avg Package */}
                <div className="text-center bg-muted/50 rounded-lg py-2">{collegeData[college1].avgPackage}</div>
                <div className="text-center text-xs text-muted-foreground py-2">Avg Package</div>
                <div className="text-center bg-muted/50 rounded-lg py-2">{collegeData[college2].avgPackage}</div>

                {/* Acceptance Rate */}
                <div className="text-center bg-muted/50 rounded-lg py-2">{collegeData[college1].acceptanceRate}</div>
                <div className="text-center text-xs text-muted-foreground py-2">Acceptance</div>
                <div className="text-center bg-muted/50 rounded-lg py-2">{collegeData[college2].acceptanceRate}</div>
              </motion.div>
            )}
          </motion.div>

          {/* Academic Converter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Academic Converter</h3>
                <p className="text-sm text-muted-foreground">CGPA/SGPA to Percentage</p>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-4">
              Convert your academic scores instantly. Whether it's SGPA to Percentage, 
              CGPA to Percentage, or SGPA to CGPA - we've got you covered.
            </p>

            {/* Converter type tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => { setConverterType("sgpa-percentage"); setResult(null); setInputValue(""); }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  converterType === "sgpa-percentage"
                    ? "bg-amber-500 text-white"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                SGPA to Percentage
              </button>
              <button
                onClick={() => { setConverterType("cgpa-percentage"); setResult(null); setInputValue(""); }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  converterType === "cgpa-percentage"
                    ? "bg-amber-500 text-white"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                CGPA to Percentage
              </button>
              <button
                onClick={() => { setConverterType("sgpa-cgpa"); setResult(null); setInputValue(""); }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  converterType === "sgpa-cgpa"
                    ? "bg-amber-500 text-white"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                SGPA to CGPA
              </button>
            </div>

            {/* Input */}
            <div className="flex gap-3 mb-4">
              <Input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={getConverterLabel().input}
                className="flex-1 rounded-xl"
              />
              <Button
                onClick={handleConvert}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-6"
              >
                Convert
              </Button>
            </div>

            {/* Result */}
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">{getConverterLabel().output}</p>
              <p className="text-4xl font-bold text-foreground">
                {result !== null ? (
                  <>
                    {result}
                    <span className="text-2xl text-muted-foreground ml-1">
                      {converterType.includes("percentage") ? "%" : ""}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">--.--%</span>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
