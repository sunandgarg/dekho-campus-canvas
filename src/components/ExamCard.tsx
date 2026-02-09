import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Globe, Users, Languages, Calendar, FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DbExam } from "@/hooks/useExamsData";

interface ExamCardProps {
  exam: DbExam;
  index: number;
}

const statusColors: Record<string, string> = {
  "Upcoming": "bg-primary/10 text-primary border-primary/30",
  "Applications Open": "bg-success/10 text-success border-success/30",
  "Applications Closed": "bg-destructive/10 text-destructive border-destructive/30",
  "Exam Over": "bg-muted text-muted-foreground border-border",
};

export function ExamCard({ exam, index }: ExamCardProps) {
  const importantDates = Array.isArray(exam.important_dates)
    ? (exam.important_dates as { event: string; date: string }[])
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <article className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-foreground">{exam.name}</h2>
                <p className="text-sm text-muted-foreground line-clamp-1">{exam.full_name}</p>
              </div>
              <Badge className={`text-xs border flex-shrink-0 ${statusColors[exam.status] || ""}`}>
                {exam.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Category & Level */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs text-success border-success/30 bg-success/5 font-semibold">
            {exam.category}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">{exam.level} Level</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <span className="text-xs text-muted-foreground">Duration: </span>
              <span className="text-xs font-medium text-foreground">{exam.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div>
              <span className="text-xs text-muted-foreground">Mode: </span>
              <span className="text-xs font-medium text-foreground">{exam.mode.split(" ")[0]}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <span className="text-xs text-muted-foreground">Type: </span>
              <span className="text-xs font-medium text-foreground">{exam.exam_type}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-muted-foreground" />
            <div>
              <span className="text-xs text-muted-foreground">Language: </span>
              <span className="text-xs font-medium text-foreground">{exam.language}</span>
            </div>
          </div>
        </div>

        {/* Important Dates */}
        {importantDates.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Important Dates</h3>
            <div className="space-y-1.5">
              {importantDates.slice(0, 4).map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{d.event}:</span>
                  <span className={`font-medium ${i >= 2 ? "text-destructive" : "text-foreground"}`}>
                    {d.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Frequency & Apply mode */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Frequency: {exam.frequency}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            Apply: {exam.application_mode}
          </span>
        </div>

        {/* Download Sample Paper */}
        <Button variant="outline" className="w-full rounded-xl gap-2 h-10 text-sm border-primary/30 text-primary hover:bg-primary/5 mb-3">
          <Download className="w-4 h-4" />
          Download Sample Paper
        </Button>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link to={`/exams/${exam.slug}`}>
            <Button variant="outline" className="w-full rounded-xl h-10 text-sm">
              View Details
            </Button>
          </Link>
          <Button className="w-full rounded-xl h-10 text-sm gradient-accent text-white border-0">
            Apply Now
          </Button>
        </div>
      </article>
    </motion.div>
  );
}
