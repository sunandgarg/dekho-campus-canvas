import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAllDbCourses, useSaveCourse, useDeleteCourse, type DbCourse } from "@/hooks/useCoursesData";
import { AdminFormSection } from "@/components/AdminFormSection";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUpload } from "@/components/ImageUpload";
import { ArrayFieldEditor } from "@/components/ArrayFieldEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, BookOpen, Info, DollarSign, FileText, Settings } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Engineering", "Medical", "Management", "Law", "Design", "Science", "Commerce", "Arts", "Pharmacy"];
const LEVELS = ["Undergraduate", "Postgraduate", "Diploma", "Doctoral"];
const MODES = ["Full-Time", "Part-Time", "Distance", "Online"];
const STATUSES = ["Draft", "Published"];
const DOMAINS = ["Engineering & Technology", "Medical & Health", "Business & Management", "Law & Legal", "Design & Architecture", "Science & Research", "Arts & Humanities", "Commerce & Finance", "Pharmacy", "Agriculture"];
const DURATION_TYPES = ["Years", "Months", "Semesters"];
const STUDY_TYPES = ["Regular", "Part-Time", "Distance", "Online", "Hybrid"];
const FEE_TYPES = ["Per Year", "Per Semester", "Total Course", "Per Month"];

const emptyCourse: Partial<DbCourse> = {
  slug: "", name: "", full_name: "", category: "Engineering", duration: "", level: "Undergraduate",
  colleges_count: 0, avg_fees: "", avg_salary: "", growth: "", description: "", eligibility: "",
  top_exams: [], careers: [], subjects: [], image: "", mode: "Full-Time", specializations: [], is_active: true,
  status: "Draft", short_description: "", domain: "", duration_type: "", study_type: "", rating: 0,
  fee_type: "", fee: 0, low_fee: 0, high_fee: 0, syllabus_pdf_url: "",
  about_content: "", scope_content: "", subjects_content: "", placements_content: "",
  admission_process: "", fees_content: "", cutoff_content: "", specialization_content: "",
  recruiters_content: "", syllabus_content: "", meta_title: "", meta_description: "", meta_keywords: "",
};

export default function AdminCourses() {
  const { data: courses, isLoading } = useAllDbCourses();
  const saveCourse = useSaveCourse();
  const deleteCourse = useDeleteCourse();
  const [editing, setEditing] = useState<Partial<DbCourse> | null>(null);
  const [search, setSearch] = useState("");

  const filtered = (courses ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!editing?.slug || !editing?.name) { toast.error("Slug and Name required"); return; }
    saveCourse.mutate(editing as any, { onSuccess: () => setEditing(null) });
  };

  const update = (field: string, value: any) => setEditing((prev) => prev ? { ...prev, [field]: value } : prev);

  return (
    <AdminLayout title="Courses Manager">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." className="pl-10 rounded-xl h-10" />
        </div>
        <Button onClick={() => setEditing({ ...emptyCourse })} className="rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Add Course
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground text-sm">{c.name}</span>
                  <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                  <Badge variant="outline" className="text-[10px]">{c.level}</Badge>
                  <Badge variant={c.status === "Published" ? "default" : "secondary"} className="text-[10px]">{c.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.full_name} • {c.duration} • {c.mode}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditing({ ...c })} className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) deleteCourse.mutate(c.id); }} className="w-8 h-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No courses found</div>}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> {editing?.id ? "Edit" : "Add"} Course</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              {/* ── Basic Info ── */}
              <AdminFormSection title="Basic Information" icon={<Info className="w-4 h-4 text-primary" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                    <select value={editing.status || "Draft"} onChange={(e) => update("status", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-medium text-muted-foreground">Name *</label><Input value={editing.name || ""} onChange={(e) => update("name", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Slug *</label><Input value={editing.slug || ""} onChange={(e) => update("slug", e.target.value)} placeholder="btech-computer-science" className="rounded-lg h-9 text-sm" /></div>
                  <div className="sm:col-span-2 lg:col-span-3"><label className="text-xs font-medium text-muted-foreground">Full Name</label><Input value={editing.full_name || ""} onChange={(e) => update("full_name", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                  <div className="sm:col-span-2 lg:col-span-3"><label className="text-xs font-medium text-muted-foreground">Short Description</label><Input value={editing.short_description || ""} onChange={(e) => update("short_description", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Domain</label>
                    <select value={editing.domain || ""} onChange={(e) => update("domain", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      <option value="">Select</option>
                      {DOMAINS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
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
                  <div><label className="text-xs font-medium text-muted-foreground">Duration</label><Input value={editing.duration || ""} onChange={(e) => update("duration", e.target.value)} placeholder="4" className="rounded-lg h-9 text-sm" /></div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Duration Type</label>
                    <select value={editing.duration_type || ""} onChange={(e) => update("duration_type", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      <option value="">Select</option>
                      {DURATION_TYPES.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Study Type</label>
                    <select value={editing.study_type || ""} onChange={(e) => update("study_type", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      <option value="">Select</option>
                      {STUDY_TYPES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Mode</label>
                    <select value={editing.mode || ""} onChange={(e) => update("mode", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      {MODES.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-medium text-muted-foreground">Rating</label><Input type="number" step="0.1" min="0" max="5" value={editing.rating ?? 0} onChange={(e) => update("rating", parseFloat(e.target.value) || 0)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Colleges Count</label><Input type="number" value={editing.colleges_count ?? 0} onChange={(e) => update("colleges_count", parseInt(e.target.value) || 0)} className="rounded-lg h-9 text-sm" /></div>
                  <ImageUpload value={editing.image || ""} onChange={(v) => update("image", v)} label="Image" folder="courses" />
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Description</label>
                  <textarea value={editing.description || ""} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm resize-none" />
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Eligibility</label>
                  <textarea value={editing.eligibility || ""} onChange={(e) => update("eligibility", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm resize-none" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.is_active !== false} onChange={(e) => update("is_active", e.target.checked)} className="rounded" />
                  <label className="text-sm text-foreground">Active</label>
                </div>
              </AdminFormSection>

              {/* ── Fees ── */}
              <AdminFormSection title="Fee Structure" icon={<DollarSign className="w-4 h-4 text-primary" />} defaultOpen={false}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Fee Type</label>
                    <select value={editing.fee_type || ""} onChange={(e) => update("fee_type", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      <option value="">Select</option>
                      {FEE_TYPES.map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-medium text-muted-foreground">Fee (₹)</label><Input type="number" value={editing.fee ?? 0} onChange={(e) => update("fee", parseFloat(e.target.value) || 0)} placeholder="Average fee" className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Low Fee (₹)</label><Input type="number" value={editing.low_fee ?? 0} onChange={(e) => update("low_fee", parseFloat(e.target.value) || 0)} placeholder="Lowest fee" className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">High Fee (₹)</label><Input type="number" value={editing.high_fee ?? 0} onChange={(e) => update("high_fee", parseFloat(e.target.value) || 0)} placeholder="Highest fee" className="rounded-lg h-9 text-sm" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground">Avg Fees (Display)</label><Input value={editing.avg_fees || ""} onChange={(e) => update("avg_fees", e.target.value)} placeholder="₹1.5L - ₹5L/year" className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Avg Salary</label><Input value={editing.avg_salary || ""} onChange={(e) => update("avg_salary", e.target.value)} placeholder="₹12 LPA" className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Growth</label><Input value={editing.growth || ""} onChange={(e) => update("growth", e.target.value)} placeholder="+25%" className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Syllabus PDF URL</label><Input value={editing.syllabus_pdf_url || ""} onChange={(e) => update("syllabus_pdf_url", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                </div>
                <RichTextEditor label="Fees Content" value={editing.fees_content || ""} onChange={(v) => update("fees_content", v)} />
              </AdminFormSection>

              {/* ── Detailed Content ── */}
              <AdminFormSection title="Detailed Content" icon={<FileText className="w-4 h-4 text-primary" />} defaultOpen={false}>
                <RichTextEditor label="About" value={editing.about_content || ""} onChange={(v) => update("about_content", v)} />
                <RichTextEditor label="Scope" value={editing.scope_content || ""} onChange={(v) => update("scope_content", v)} />
                <RichTextEditor label="Subjects" value={editing.subjects_content || ""} onChange={(v) => update("subjects_content", v)} />
                <RichTextEditor label="Placements" value={editing.placements_content || ""} onChange={(v) => update("placements_content", v)} />
                <RichTextEditor label="Admission Process" value={editing.admission_process || ""} onChange={(v) => update("admission_process", v)} />
                <RichTextEditor label="Cut Off" value={editing.cutoff_content || ""} onChange={(v) => update("cutoff_content", v)} />
                <RichTextEditor label="Specialization" value={editing.specialization_content || ""} onChange={(v) => update("specialization_content", v)} />
                <RichTextEditor label="Course Recruiters" value={editing.recruiters_content || ""} onChange={(v) => update("recruiters_content", v)} />
                <RichTextEditor label="Syllabus" value={editing.syllabus_content || ""} onChange={(v) => update("syllabus_content", v)} />
              </AdminFormSection>

              {/* ── Tags & Arrays ── */}
              <AdminFormSection title="Exams, Careers & Subjects" icon={<Settings className="w-4 h-4 text-primary" />} defaultOpen={false}>
                <ArrayFieldEditor label="Top Exams" values={editing.top_exams || []} onChange={(v) => update("top_exams", v)} suggestions={["JEE Main","JEE Advanced","NEET UG","CAT","CLAT","GATE","BITSAT","VITEEE","CUET","XAT","MAT","SNAP"]} />
                <ArrayFieldEditor label="Careers" values={editing.careers || []} onChange={(v) => update("careers", v)} />
                <ArrayFieldEditor label="Subjects" values={editing.subjects || []} onChange={(v) => update("subjects", v)} />
                <ArrayFieldEditor label="Specializations" values={editing.specializations || []} onChange={(v) => update("specializations", v)} />
              </AdminFormSection>

              {/* ── SEO ── */}
              <AdminFormSection title="SEO" icon={<Search className="w-4 h-4 text-primary" />} defaultOpen={false}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground">Meta Title</label><Input value={editing.meta_title || ""} onChange={(e) => update("meta_title", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Meta Keywords</label><Input value={editing.meta_keywords || ""} onChange={(e) => update("meta_keywords", e.target.value)} placeholder="Comma separated" className="rounded-lg h-9 text-sm" /></div>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Meta Description</label>
                  <textarea value={editing.meta_description || ""} onChange={(e) => update("meta_description", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm resize-none" />
                </div>
              </AdminFormSection>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditing(null)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleSave} disabled={saveCourse.isPending} className="rounded-xl">
                  {saveCourse.isPending ? "Saving..." : "Save Course"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
