import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useDbExams } from "@/hooks/useExamsData";

export function UpcomingExams() {
  const { data: allExams } = useDbExams();

  // Filter exams with exam_date in the next 2 weeks
  const upcomingExams = (() => {
    if (!allExams?.length) return [];
    const now = new Date();
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    return allExams
      .filter((exam) => {
        if (!exam.exam_date) return false;
        const examDate = new Date(exam.exam_date);
        return !isNaN(examDate.getTime()) && examDate >= now && examDate <= twoWeeksLater;
      })
      .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
      .slice(0, 6);
  })();

  // If no exams in next 2 weeks, show the soonest upcoming ones
  const displayExams = upcomingExams.length > 0
    ? upcomingExams
    : (allExams ?? [])
        .filter((e) => {
          if (!e.exam_date) return false;
          const d = new Date(e.exam_date);
          return !isNaN(d.getTime()) && d >= new Date();
        })
        .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
        .slice(0, 6);

  if (!displayExams.length) return null;

  return (
    <section className="py-10 md:py-14 bg-background" aria-labelledby="upcoming-exams-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-3">
              <AlertCircle className="w-4 h-4" />
              Upcoming Exams
            </div>
            <h2 id="upcoming-exams-heading" className="text-headline font-bold text-foreground">
              Exams <span className="text-gradient">Coming Soon</span>
            </h2>
            <p className="text-muted-foreground mt-1">Don't miss these important exam dates</p>
          </div>
          <Link to="/exams">
            <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5">
              All Exams <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayExams.map((exam, index) => {
            const examDate = new Date(exam.exam_date);
            const daysLeft = Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const isUrgent = daysLeft <= 7;

            return (
              <motion.div
                key={exam.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/exams/${exam.slug}`}
                  className="group block bg-card rounded-2xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold ${isUrgent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                      <Calendar className="w-4 h-4 mb-0.5" />
                      <span>{daysLeft}d</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {exam.short_name || exam.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{exam.full_name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{exam.category}</Badge>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {examDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
