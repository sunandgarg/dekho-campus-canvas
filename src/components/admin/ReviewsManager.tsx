import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X, Star, CheckCircle } from "lucide-react";

interface ReviewForm {
  college_slug: string;
  reviewer_name: string;
  course: string;
  batch_year: number;
  rating: number;
  title: string;
  content: string;
  pros: string;
  cons: string;
  is_verified: boolean;
  is_active: boolean;
  display_order: number;
}

const emptyReview: ReviewForm = {
  college_slug: "", reviewer_name: "", course: "", batch_year: 2024,
  rating: 4, title: "", content: "", pros: "", cons: "",
  is_verified: false, is_active: true, display_order: 0,
};

export function ReviewsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ReviewForm>(emptyReview);

  const { data: reviews } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("student_reviews").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const openCreate = () => { setForm(emptyReview); setEditId(null); setShowForm(true); };
  const openEdit = (r: any) => {
    setForm({
      college_slug: r.college_slug, reviewer_name: r.reviewer_name, course: r.course,
      batch_year: r.batch_year, rating: r.rating, title: r.title, content: r.content,
      pros: r.pros, cons: r.cons, is_verified: r.is_verified, is_active: r.is_active,
      display_order: r.display_order,
    });
    setEditId(r.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.college_slug.trim() || !form.reviewer_name.trim()) {
      toast({ title: "College slug and reviewer name required", variant: "destructive" });
      return;
    }
    if (editId) {
      await supabase.from("student_reviews").update(form).eq("id", editId);
      toast({ title: "✅ Review updated" });
    } else {
      await supabase.from("student_reviews").insert(form);
      toast({ title: "✅ Review created" });
    }
    queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    queryClient.invalidateQueries({ queryKey: ["student-reviews"] });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await supabase.from("student_reviews").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    toast({ title: "🗑️ Review deleted" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{reviews?.length ?? 0} reviews</span>
        <Button onClick={openCreate} className="rounded-xl gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Review
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editId ? "Edit Review" : "New Review"}</h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label>College Slug *</Label>
                <Input value={form.college_slug} onChange={(e) => setForm({ ...form, college_slug: e.target.value })} placeholder="e.g. iit-delhi" className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>Reviewer Name *</Label>
                <Input value={form.reviewer_name} onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>Course</Label>
                <Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="e.g. B.Tech CSE" className="rounded-xl mt-1" />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label>Batch Year</Label>
                <Input type="number" value={form.batch_year} onChange={(e) => setForm({ ...form, batch_year: parseInt(e.target.value) || 2024 })} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>Rating (1-5)</Label>
                <Input type="number" min={1} max={5} step={0.5} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 4 })} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="rounded-xl mt-1" />
              </div>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="rounded-xl mt-1 min-h-[60px]" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Pros (comma-separated)</Label>
                <Input value={form.pros} onChange={(e) => setForm({ ...form, pros: e.target.value })} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>Cons (comma-separated)</Label>
                <Input value={form.cons} onChange={(e) => setForm({ ...form, cons: e.target.value })} className="rounded-xl mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_verified} onCheckedChange={(v) => setForm({ ...form, is_verified: v })} />
                <Label>Verified</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <Label>{form.is_active ? "Active" : "Hidden"}</Label>
              </div>
            </div>
            <Button onClick={handleSave} className="rounded-xl gradient-primary text-primary-foreground">
              {editId ? "Save Changes" : "Create Review"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {(reviews ?? []).map((r) => (
          <div key={r.id} className={`bg-card rounded-xl border border-border p-3 flex items-start gap-3 ${!r.is_active ? "opacity-50" : ""}`}>
            <Star className="w-4 h-4 text-golden mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                {r.reviewer_name}
                {r.is_verified && <CheckCircle className="w-3 h-3 text-success" />}
                <span className="text-xs text-muted-foreground">• {r.rating}/5</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.title}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className="text-[10px]">{r.college_slug}</Badge>
                <Badge variant="secondary" className="text-[10px]">{r.course}</Badge>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => openEdit(r)} className="w-7 h-7"><Pencil className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="w-7 h-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
