import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAllDbColleges, useSaveCollege, useDeleteCollege, type DbCollege } from "@/hooks/useCollegesData";
import { AdminFormSection } from "@/components/AdminFormSection";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUpload } from "@/components/ImageUpload";
import { ArrayFieldEditor } from "@/components/ArrayFieldEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, GraduationCap, Info, MapPin, FileText, Image, Award, Settings, BarChart } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Engineering", "Medical", "Management", "Law", "Design", "Science", "Commerce", "Arts", "Pharmacy", "Agriculture"];
const TYPES = ["Government", "Private", "Deemed", "Autonomous"];
const NAAC_GRADES = ["A++", "A+", "A", "B++", "B+", "B", "C", ""];
const STATUSES = ["Draft", "Published"];
const APPROVAL_SUGGESTIONS = ["AICTE", "UGC", "NAAC", "MCI", "BCI", "NMC", "PCI", "AACSB", "EQUIS", "NBA", "COA", "ICAR", "NCTE"];
const FACILITY_SUGGESTIONS = ["Library", "Hostel", "Sports Complex", "Wi-Fi Campus", "Medical Center", "Cafeteria", "Labs", "Auditorium", "Swimming Pool", "Gymnasium", "Incubation Center", "Innovation Lab"];
const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

const emptyCollege: Partial<DbCollege> = {
  slug: "", name: "", short_name: "", location: "", city: "", state: "", type: "Private", category: "Engineering",
  rating: 0, reviews: 0, courses_count: 0, fees: "", placement: "", ranking: "", image: "", logo: "",
  tags: [], established: 2000, description: "", highlights: [], facilities: [], approvals: [], naac_grade: "",
  top_recruiters: [], is_active: true, status: "Draft", carousel_images: [], brochure_url: "",
  eligibility_criteria: "", admission_process: "", scholarship_details: "", hostel_life: "",
  gallery_images: [], cutoff: "", course_fee_content: "", placement_content: "", rankings_content: "",
  facilities_content: "", meta_title: "", meta_description: "", meta_keywords: "",
  banner_ad_image: "", square_ad_image: "",
};

export default function AdminColleges() {
  const { data: colleges, isLoading } = useAllDbColleges();
  const saveCollege = useSaveCollege();
  const deleteCollege = useDeleteCollege();
  const [editing, setEditing] = useState<Partial<DbCollege> | null>(null);
  const [search, setSearch] = useState("");

  const filtered = (colleges ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!editing?.slug || !editing?.name) { toast.error("Slug and Name required"); return; }
    saveCollege.mutate(editing as any, { onSuccess: () => setEditing(null) });
  };

  const update = (field: string, value: any) => setEditing((prev) => prev ? { ...prev, [field]: value } : prev);

  return (
    <AdminLayout title="Colleges Manager">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colleges..." className="pl-10 rounded-xl h-10" />
        </div>
        <Button onClick={() => setEditing({ ...emptyCollege })} className="rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Add College
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              {c.image && <img src={c.image} alt={c.name} className="w-12 h-12 rounded-lg object-cover hidden sm:block" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground text-sm">{c.name}</span>
                  <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                  <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                  <Badge variant={c.status === "Published" ? "default" : "secondary"} className="text-[10px]">{c.status}</Badge>
                  {!c.is_active && <Badge variant="destructive" className="text-[10px]">Inactive</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.location} • {c.state} • {c.ranking}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditing({ ...c })} className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) deleteCollege.mutate(c.id); }} className="w-8 h-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No colleges found</div>}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5" /> {editing?.id ? "Edit" : "Add"} College</DialogTitle>
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
                  <div><label className="text-xs font-medium text-muted-foreground">Slug *</label><Input value={editing.slug || ""} onChange={(e) => update("slug", e.target.value)} placeholder="iit-delhi" className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Short Name</label><Input value={editing.short_name || ""} onChange={(e) => update("short_name", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Logo URL</label><ImageUpload value={editing.logo || ""} onChange={(v) => update("logo", v)} label="" folder="colleges/logos" /></div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Type</label>
                    <select value={editing.type || ""} onChange={(e) => update("type", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      {TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <select value={editing.category || ""} onChange={(e) => update("category", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-medium text-muted-foreground">Rating</label><Input type="number" step="0.1" min="0" max="5" value={editing.rating ?? 0} onChange={(e) => update("rating", parseFloat(e.target.value) || 0)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Rating Count</label><Input type="number" value={editing.reviews ?? 0} onChange={(e) => update("reviews", parseInt(e.target.value) || 0)} className="rounded-lg h-9 text-sm" /></div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description *</label>
                  <textarea value={editing.description || ""} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm resize-none" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.is_active !== false} onChange={(e) => update("is_active", e.target.checked)} className="rounded" />
                  <label className="text-sm text-foreground">Active</label>
                </div>
              </AdminFormSection>

              {/* ── Location ── */}
              <AdminFormSection title="Location" icon={<MapPin className="w-4 h-4 text-primary" />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground">Location</label><Input value={editing.location || ""} onChange={(e) => update("location", e.target.value)} placeholder="Coimbatore, Tamil Nadu" className="rounded-lg h-9 text-sm" /></div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">State</label>
                    <select value={editing.state || ""} onChange={(e) => update("state", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      <option value="">Select</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-medium text-muted-foreground">City</label><Input value={editing.city || ""} onChange={(e) => update("city", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Established In</label><Input type="number" value={editing.established ?? 2000} onChange={(e) => update("established", parseInt(e.target.value) || 2000)} className="rounded-lg h-9 text-sm" /></div>
                </div>
              </AdminFormSection>

              {/* ── Approvals & Accreditation ── */}
              <AdminFormSection title="Approvals & Accreditation" icon={<Award className="w-4 h-4 text-primary" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">NAAC Grade</label>
                    <select value={editing.naac_grade || ""} onChange={(e) => update("naac_grade", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      {NAAC_GRADES.map((g) => <option key={g} value={g}>{g || "None"}</option>)}
                    </select>
                  </div>
                </div>
                <ArrayFieldEditor label="Approvals" values={editing.approvals || []} onChange={(v) => update("approvals", v)} suggestions={APPROVAL_SUGGESTIONS} />
              </AdminFormSection>

              {/* ── Images & Media ── */}
              <AdminFormSection title="Images & Media" icon={<Image className="w-4 h-4 text-primary" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ImageUpload value={editing.image || ""} onChange={(v) => update("image", v)} label="Featured Image" folder="colleges/images" />
                  <div><label className="text-xs font-medium text-muted-foreground">Brochure URL</label><Input value={editing.brochure_url || ""} onChange={(e) => update("brochure_url", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                </div>
                <ArrayFieldEditor label="Carousel Images" values={editing.carousel_images || []} onChange={(v) => update("carousel_images", v)} placeholder="Add image URL..." />
                <ArrayFieldEditor label="Gallery Images" values={editing.gallery_images || []} onChange={(v) => update("gallery_images", v)} placeholder="Add image URL..." />
              </AdminFormSection>

              {/* ── Courses & Fees ── */}
              <AdminFormSection title="Courses & Fees" icon={<FileText className="w-4 h-4 text-primary" />} defaultOpen={false}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground">Courses Count</label><Input type="number" value={editing.courses_count ?? 0} onChange={(e) => update("courses_count", parseInt(e.target.value) || 0)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Fees</label><Input value={editing.fees || ""} onChange={(e) => update("fees", e.target.value)} placeholder="₹2.5L/year" className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Ranking</label><Input value={editing.ranking || ""} onChange={(e) => update("ranking", e.target.value)} placeholder="NIRF #1" className="rounded-lg h-9 text-sm" /></div>
                </div>
                <RichTextEditor label="Course & Fee Content" value={editing.course_fee_content || ""} onChange={(v) => update("course_fee_content", v)} />
              </AdminFormSection>

              {/* ── Placement ── */}
              <AdminFormSection title="Placement" icon={<BarChart className="w-4 h-4 text-primary" />} defaultOpen={false}>
                <div><label className="text-xs font-medium text-muted-foreground">Placement Summary</label><Input value={editing.placement || ""} onChange={(e) => update("placement", e.target.value)} placeholder="₹25 LPA avg" className="rounded-lg h-9 text-sm" /></div>
                <RichTextEditor label="Placement Content" value={editing.placement_content || ""} onChange={(v) => update("placement_content", v)} />
                <ArrayFieldEditor label="Top Recruiters" values={editing.top_recruiters || []} onChange={(v) => update("top_recruiters", v)} suggestions={["Google","Microsoft","Amazon","TCS","Infosys","Wipro","Flipkart","Goldman Sachs","JP Morgan","Deloitte","McKinsey","Accenture"]} />
              </AdminFormSection>

              {/* ── Detailed Content ── */}
              <AdminFormSection title="Detailed Content" icon={<FileText className="w-4 h-4 text-primary" />} defaultOpen={false}>
                <RichTextEditor label="Eligibility Criteria" value={editing.eligibility_criteria || ""} onChange={(v) => update("eligibility_criteria", v)} />
                <RichTextEditor label="Admission Process" value={editing.admission_process || ""} onChange={(v) => update("admission_process", v)} />
                <RichTextEditor label="Scholarship Details" value={editing.scholarship_details || ""} onChange={(v) => update("scholarship_details", v)} />
                <RichTextEditor label="Hostel Life" value={editing.hostel_life || ""} onChange={(v) => update("hostel_life", v)} />
                <RichTextEditor label="Cutoff" value={editing.cutoff || ""} onChange={(v) => update("cutoff", v)} />
                <RichTextEditor label="Rankings Content" value={editing.rankings_content || ""} onChange={(v) => update("rankings_content", v)} />
                <RichTextEditor label="Facilities Content" value={editing.facilities_content || ""} onChange={(v) => update("facilities_content", v)} />
              </AdminFormSection>

              {/* ── Tags & Arrays ── */}
              <AdminFormSection title="Tags, Facilities & Highlights" icon={<Settings className="w-4 h-4 text-primary" />} defaultOpen={false}>
                <ArrayFieldEditor label="Facilities" values={editing.facilities || []} onChange={(v) => update("facilities", v)} suggestions={FACILITY_SUGGESTIONS} />
                <ArrayFieldEditor label="Tags" values={editing.tags || []} onChange={(v) => update("tags", v)} placeholder="Add tag..." />
                <ArrayFieldEditor label="Highlights" values={editing.highlights || []} onChange={(v) => update("highlights", v)} placeholder="Add highlight..." />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground">Banner Ad Image URL</label><Input value={editing.banner_ad_image || ""} onChange={(e) => update("banner_ad_image", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Square Ad Image URL</label><Input value={editing.square_ad_image || ""} onChange={(e) => update("square_ad_image", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                </div>
              </AdminFormSection>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditing(null)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleSave} disabled={saveCollege.isPending} className="rounded-xl">
                  {saveCollege.isPending ? "Saving..." : "Save College"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
