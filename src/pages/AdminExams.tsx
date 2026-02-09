import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAllDbExams, useSaveExam, useDeleteExam, type DbExam, type ExamImportantDate } from "@/hooks/useExamsData";
import { ArrayFieldEditor } from "@/components/ArrayFieldEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, FileText, X } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Engineering", "Medical", "Management", "Law", "Design", "Science"];
const LEVELS = ["National", "State", "University", "International", "Professional"];
const MODES = ["Online (CBT)", "Offline (OMR)", "Online/Offline", "Online + Studio", "Offline"];
const STATUSES = ["Upcoming", "Applications Open", "Applications Closed", "Exam Over"];
const FREQUENCIES = ["Once", "Twice", "Quarterly", "Multiple"];

const emptyExam: Partial<DbExam> = {
  slug: "", name: "", full_name: "", category: "Engineering", level: "National", exam_date: "",
  applicants: "", eligibility: "", mode: "Online (CBT)", description: "", important_dates: [],
  syllabus: [], top_colleges: [], image: "", registration_url: "#", duration: "", exam_type: "",
  language: "English", frequency: "Once", application_mode: "Online", status: "Upcoming", is_active: true,
};

function ImportantDatesEditor({ dates, onChange }: { dates: ExamImportantDate[]; onChange: (d: ExamImportantDate[]) => void }) {
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");

  const add = () => {
    if (event.trim() && date.trim()) {
      onChange([...dates, { event: event.trim(), date: date.trim() }]);
      setEvent(""); setDate("");
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">Important Dates</label>
      <div className="flex gap-2">
        <Input value={event} onChange={(e) => setEvent(e.target.value)} placeholder="Event name" className="rounded-lg h-9 text-sm flex-1" />
        <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date" className="rounded-lg h-9 text-sm flex-1" />
        <Button type="button" variant="outline" size="sm" onClick={add} className="h-9 px-3"><Plus className="w-3.5 h-3.5" /></Button>
      </div>
      {dates.map((d, i) => (
        <div key={i} className="flex items-center gap-2 bg-muted rounded-lg p-2">
          <span className="text-xs font-medium text-foreground flex-1">{d.event}: {d.date}</span>
          <button type="button" onClick={() => onChange(dates.filter((_, j) => j !== i))} className="text-destructive hover:bg-destructive/10 rounded p-1"><X className="w-3 h-3" /></button>
        </div>
      ))}
    </div>
  );
}

export default function AdminExams() {
  const { data: exams, isLoading } = useAllDbExams();
  const saveExam = useSaveExam();
  const deleteExam = useDeleteExam();
  const [editing, setEditing] = useState<Partial<DbExam> | null>(null);
  const [search, setSearch] = useState("");

  const filtered = (exams ?? []).filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!editing?.slug || !editing?.name) { toast.error("Slug and Name required"); return; }
    saveExam.mutate(editing as any, { onSuccess: () => setEditing(null) });
  };

  const update = (field: string, value: any) => setEditing((prev) => prev ? { ...prev, [field]: value } : prev);

  return (
    <AdminLayout title="Exams Manager">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exams..." className="pl-10 rounded-xl h-10" />
        </div>
        <Button onClick={() => setEditing({ ...emptyExam })} className="rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Add Exam
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((e) => (
            <div key={e.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground text-sm">{e.name}</span>
                  <Badge variant="outline" className="text-[10px]">{e.category}</Badge>
                  <Badge variant="outline" className="text-[10px]">{e.level}</Badge>
                  <Badge className={`text-[10px] ${e.status === "Applications Open" ? "bg-success/20 text-success" : ""}`}>{e.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{e.full_name} • {e.exam_date}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditing({ ...e })} className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) deleteExam.mutate(e.id); }} className="w-8 h-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No exams found</div>}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> {editing?.id ? "Edit" : "Add"} Exam</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground">Name *</label><Input value={editing.name || ""} onChange={(e) => update("name", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Slug *</label><Input value={editing.slug || ""} onChange={(e) => update("slug", e.target.value)} placeholder="jee-main-2026" className="rounded-lg h-9 text-sm" /></div>
                <div className="sm:col-span-2"><label className="text-xs font-medium text-muted-foreground">Full Name</label><Input value={editing.full_name || ""} onChange={(e) => update("full_name", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category</label>
                  <select value={editing.category || ""} onChange={(e) => update("category", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Level</label>
                  <select value={editing.level || ""} onChange={(e) => update("level", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Exam Date</label><Input value={editing.exam_date || ""} onChange={(e) => update("exam_date", e.target.value)} placeholder="April 2026" className="rounded-lg h-9 text-sm" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Applicants</label><Input value={editing.applicants || ""} onChange={(e) => update("applicants", e.target.value)} placeholder="15L+" className="rounded-lg h-9 text-sm" /></div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Mode</label>
                  <select value={editing.mode || ""} onChange={(e) => update("mode", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                    {MODES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Duration</label><Input value={editing.duration || ""} onChange={(e) => update("duration", e.target.value)} placeholder="3 hours" className="rounded-lg h-9 text-sm" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Exam Type</label><Input value={editing.exam_type || ""} onChange={(e) => update("exam_type", e.target.value)} placeholder="National Wise" className="rounded-lg h-9 text-sm" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Language</label><Input value={editing.language || ""} onChange={(e) => update("language", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Frequency</label>
                  <select value={editing.frequency || ""} onChange={(e) => update("frequency", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                    {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Application Mode</label><Input value={editing.application_mode || ""} onChange={(e) => update("application_mode", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select value={editing.status || ""} onChange={(e) => update("status", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Registration URL</label><Input value={editing.registration_url || ""} onChange={(e) => update("registration_url", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Image URL</label><Input value={editing.image || ""} onChange={(e) => update("image", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" checked={editing.is_active !== false} onChange={(e) => update("is_active", e.target.checked)} className="rounded" />
                  <label className="text-sm text-foreground">Active</label>
                </div>
              </div>

              <div><label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea value={editing.description || ""} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm resize-none" />
              </div>
              <div><label className="text-xs font-medium text-muted-foreground">Eligibility</label>
                <textarea value={editing.eligibility || ""} onChange={(e) => update("eligibility", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm resize-none" />
              </div>

              <ImportantDatesEditor dates={editing.important_dates || []} onChange={(d) => update("important_dates", d)} />
              <ArrayFieldEditor label="Syllabus Topics" values={editing.syllabus || []} onChange={(v) => update("syllabus", v)} />
              <ArrayFieldEditor label="Top Colleges Accepting" values={editing.top_colleges || []} onChange={(v) => update("top_colleges", v)} />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditing(null)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleSave} disabled={saveExam.isPending} className="rounded-xl">
                  {saveExam.isPending ? "Saving..." : "Save Exam"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
