import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Globe, Save, Plus, Trash2, ChevronDown, ExternalLink } from "lucide-react";

interface PageSEO {
  id: string;
  page_path: string;
  page_name: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  structured_data: string;
  robots: string;
  is_active: boolean;
}

export default function AdminSEO() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPage, setNewPage] = useState({ page_path: "", page_name: "" });

  const { data: pages, isLoading } = useQuery({
    queryKey: ["page-seo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_seo")
        .select("*")
        .order("page_path");
      if (error) throw error;
      return data as PageSEO[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (page: Partial<PageSEO> & { id: string }) => {
      const { id, ...updates } = page;
      const { error } = await supabase.from("page_seo").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-seo"] });
      toast.success("SEO settings saved!");
      setEditingId(null);
    },
    onError: () => toast.error("Failed to save"),
  });

  const addMutation = useMutation({
    mutationFn: async (page: { page_path: string; page_name: string }) => {
      const { error } = await supabase.from("page_seo").insert(page);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-seo"] });
      toast.success("Page added!");
      setShowAddForm(false);
      setNewPage({ page_path: "", page_name: "" });
    },
    onError: () => toast.error("Failed to add page"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("page_seo").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-seo"] });
      toast.success("Page removed");
    },
  });

  return (
    <AdminLayout title="SEO Manager">
      <p className="text-sm text-muted-foreground mb-6">
        Manage meta tags, canonical URLs, Open Graph, Twitter cards, and structured data for every page.
      </p>

      {/* Add new page */}
      <div className="mb-6">
        {showAddForm ? (
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Page Path</label>
              <Input value={newPage.page_path} onChange={e => setNewPage(p => ({ ...p, page_path: e.target.value }))} placeholder="/about" className="rounded-xl" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Page Name</label>
              <Input value={newPage.page_name} onChange={e => setNewPage(p => ({ ...p, page_name: e.target.value }))} placeholder="About Us" className="rounded-xl" />
            </div>
            <Button onClick={() => addMutation.mutate(newPage)} className="rounded-xl" disabled={!newPage.page_path || !newPage.page_name}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="rounded-xl">Cancel</Button>
          </div>
        ) : (
          <Button onClick={() => setShowAddForm(true)} variant="outline" className="rounded-xl">
            <Plus className="w-4 h-4 mr-1" /> Add New Page
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {pages?.map(page => (
            <SEOPageCard
              key={page.id}
              page={page}
              isEditing={editingId === page.id}
              onToggleEdit={() => setEditingId(editingId === page.id ? null : page.id)}
              onSave={(updates) => updateMutation.mutate({ id: page.id, ...updates })}
              onDelete={() => {
                if (confirm("Delete this page's SEO settings?")) deleteMutation.mutate(page.id);
              }}
              isSaving={updateMutation.isPending}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

function SEOPageCard({
  page, isEditing, onToggleEdit, onSave, onDelete, isSaving
}: {
  page: PageSEO;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: (updates: Partial<PageSEO>) => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Partial<PageSEO>>({});

  const handleOpen = () => {
    if (!isEditing) {
      setForm({
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        meta_keywords: page.meta_keywords,
        canonical_url: page.canonical_url,
        og_title: page.og_title,
        og_description: page.og_description,
        og_image: page.og_image,
        twitter_title: page.twitter_title,
        twitter_description: page.twitter_description,
        twitter_image: page.twitter_image,
        structured_data: page.structured_data,
        robots: page.robots,
      });
    }
    onToggleEdit();
  };

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button onClick={handleOpen} className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm">{page.page_name || page.page_path}</h3>
          <p className="text-xs text-muted-foreground truncate">{page.page_path} • {page.meta_title || "No title set"}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isEditing ? "rotate-180" : ""}`} />
      </button>

      {isEditing && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Basic Meta */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-bold text-foreground uppercase tracking-wide">Basic Meta Tags</legend>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Meta Title (max 60 chars)</label>
              <Input value={form.meta_title ?? ""} onChange={e => update("meta_title", e.target.value)} maxLength={60} className="rounded-xl" />
              <span className="text-[10px] text-muted-foreground">{(form.meta_title?.length ?? 0)}/60</span>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Meta Description (max 160 chars)</label>
              <Textarea value={form.meta_description ?? ""} onChange={e => update("meta_description", e.target.value)} maxLength={160} className="rounded-xl resize-none" rows={2} />
              <span className="text-[10px] text-muted-foreground">{(form.meta_description?.length ?? 0)}/160</span>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Meta Keywords (comma-separated)</label>
              <Input value={form.meta_keywords ?? ""} onChange={e => update("meta_keywords", e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Canonical URL</label>
              <Input value={form.canonical_url ?? ""} onChange={e => update("canonical_url", e.target.value)} placeholder="https://dekhocampus.com/..." className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Robots</label>
              <Input value={form.robots ?? ""} onChange={e => update("robots", e.target.value)} placeholder="index, follow" className="rounded-xl" />
            </div>
          </fieldset>

          {/* Open Graph */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-bold text-foreground uppercase tracking-wide">Open Graph (Facebook/LinkedIn)</legend>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">OG Title</label>
              <Input value={form.og_title ?? ""} onChange={e => update("og_title", e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">OG Description</label>
              <Textarea value={form.og_description ?? ""} onChange={e => update("og_description", e.target.value)} className="rounded-xl resize-none" rows={2} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">OG Image URL</label>
              <Input value={form.og_image ?? ""} onChange={e => update("og_image", e.target.value)} className="rounded-xl" />
            </div>
          </fieldset>

          {/* Twitter */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-bold text-foreground uppercase tracking-wide">Twitter Card</legend>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Twitter Title</label>
              <Input value={form.twitter_title ?? ""} onChange={e => update("twitter_title", e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Twitter Description</label>
              <Textarea value={form.twitter_description ?? ""} onChange={e => update("twitter_description", e.target.value)} className="rounded-xl resize-none" rows={2} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Twitter Image URL</label>
              <Input value={form.twitter_image ?? ""} onChange={e => update("twitter_image", e.target.value)} className="rounded-xl" />
            </div>
          </fieldset>

          {/* Structured Data */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-bold text-foreground uppercase tracking-wide">Structured Data (JSON-LD)</legend>
            <Textarea value={form.structured_data ?? ""} onChange={e => update("structured_data", e.target.value)} className="rounded-xl resize-none font-mono text-xs" rows={4} placeholder='{"@context":"https://schema.org",...}' />
          </fieldset>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button onClick={() => onSave(form)} disabled={isSaving} className="rounded-xl">
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
            <Button variant="outline" onClick={onToggleEdit} className="rounded-xl">Cancel</Button>
            <Button variant="ghost" onClick={onDelete} className="rounded-xl text-destructive ml-auto" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
