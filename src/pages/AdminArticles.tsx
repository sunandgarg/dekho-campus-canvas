import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAllDbArticles, useSaveArticle, useDeleteArticle, type DbArticle } from "@/hooks/useArticlesData";
import { AdminFormSection } from "@/components/AdminFormSection";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ArrayFieldEditor } from "@/components/ArrayFieldEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, Newspaper, Info, FileText, Settings } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["Draft", "Published"];
const CATEGORIES = ["Admission", "Career Guidance", "College Reviews", "Exam Tips", "Scholarships", "Study Abroad", "Trending", "News"];
const VERTICALS = ["Engineering", "Medical", "Management", "Law", "Design", "Science", "General"];

const emptyArticle: Partial<DbArticle> = {
  slug: "", title: "", description: "", content: "", vertical: "", category: "", author: "",
  featured_image: "", views: 0, tags: [], meta_title: "", meta_description: "", meta_keywords: "",
  is_active: true, status: "Draft",
};

export default function AdminArticles() {
  const { data: articles, isLoading } = useAllDbArticles();
  const saveArticle = useSaveArticle();
  const deleteArticle = useDeleteArticle();
  const [editing, setEditing] = useState<Partial<DbArticle> | null>(null);
  const [search, setSearch] = useState("");

  const filtered = (articles ?? []).filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) || a.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!editing?.slug || !editing?.title) { toast.error("Slug and Title required"); return; }
    saveArticle.mutate(editing as any, { onSuccess: () => setEditing(null) });
  };

  const update = (field: string, value: any) => setEditing((prev) => prev ? { ...prev, [field]: value } : prev);

  return (
    <AdminLayout title="Articles Manager">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." className="pl-10 rounded-xl h-10" />
        </div>
        <Button onClick={() => setEditing({ ...emptyArticle })} className="rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Add Article
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <div key={a.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              {a.featured_image && <img src={a.featured_image} alt={a.title} className="w-16 h-10 rounded-lg object-cover hidden sm:block" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground text-sm">{a.title}</span>
                  {a.category && <Badge variant="outline" className="text-[10px]">{a.category}</Badge>}
                  <Badge variant={a.status === "Published" ? "default" : "secondary"} className="text-[10px]">{a.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{a.author} • {a.views} views • {new Date(a.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditing({ ...a })} className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete?")) deleteArticle.mutate(a.id); }} className="w-8 h-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No articles found</div>}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Newspaper className="w-5 h-5" /> {editing?.id ? "Edit" : "Add"} Article</DialogTitle>
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
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Vertical</label>
                    <select value={editing.vertical || ""} onChange={(e) => update("vertical", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      <option value="">Select</option>
                      {VERTICALS.map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <select value={editing.category || ""} onChange={(e) => update("category", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm h-9">
                      <option value="">Select</option>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-medium text-muted-foreground">Author</label><Input value={editing.author || ""} onChange={(e) => update("author", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Title *</label><Input value={editing.title || ""} onChange={(e) => update("title", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Slug *</label><Input value={editing.slug || ""} onChange={(e) => update("slug", e.target.value)} placeholder="my-article-slug" className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Featured Image URL</label><Input value={editing.featured_image || ""} onChange={(e) => update("featured_image", e.target.value)} className="rounded-lg h-9 text-sm" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground">Views</label><Input type="number" value={editing.views ?? 0} onChange={(e) => update("views", parseInt(e.target.value) || 0)} className="rounded-lg h-9 text-sm" /></div>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Description *</label>
                  <textarea value={editing.description || ""} onChange={(e) => update("description", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm resize-none" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.is_active !== false} onChange={(e) => update("is_active", e.target.checked)} className="rounded" />
                  <label className="text-sm text-foreground">Active</label>
                </div>
              </AdminFormSection>

              {/* ── Content ── */}
              <AdminFormSection title="Content" icon={<FileText className="w-4 h-4 text-primary" />}>
                <RichTextEditor label="Article Content" value={editing.content || ""} onChange={(v) => update("content", v)} rows={12} />
              </AdminFormSection>

              {/* ── Tags ── */}
              <AdminFormSection title="Tags" icon={<Settings className="w-4 h-4 text-primary" />} defaultOpen={false}>
                <ArrayFieldEditor label="Tags" values={editing.tags || []} onChange={(v) => update("tags", v)} placeholder="Add tag..." />
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
                <Button onClick={handleSave} disabled={saveArticle.isPending} className="rounded-xl">
                  {saveArticle.isPending ? "Saving..." : "Save Article"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
