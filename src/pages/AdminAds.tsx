import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAllAds } from "@/hooks/useAds";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const VARIANTS = ["horizontal", "vertical", "square", "leaderboard"] as const;
const TARGET_TYPES = ["universal", "page", "item", "city"] as const;
const PAGES = ["colleges", "courses", "exams", "articles"] as const;
const POSITIONS = ["sidebar", "mid-page", "top", "bottom", "leaderboard"] as const;
const GRADIENTS = [
  "from-violet-600 to-purple-600",
  "from-teal-500 to-emerald-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-blue-500 to-indigo-500",
  "from-green-500 to-teal-500",
  "from-red-500 to-rose-500",
  "from-cyan-500 to-blue-500",
] as const;

interface AdForm {
  title: string;
  subtitle: string;
  cta_text: string;
  link_url: string;
  variant: string;
  bg_gradient: string;
  target_type: string;
  target_page: string | null;
  target_item_slug: string;
  target_city: string;
  position: string;
  priority: number;
  is_active: boolean;
}

const emptyForm: AdForm = {
  title: "",
  subtitle: "",
  cta_text: "Learn More",
  link_url: "#",
  variant: "horizontal",
  bg_gradient: "from-violet-600 to-purple-600",
  target_type: "universal",
  target_page: null,
  target_item_slug: "",
  target_city: "",
  position: "mid-page",
  priority: 0,
  is_active: true,
};

export default function AdminAds() {
  const { data: ads, isLoading } = useAllAds();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (ad: any) => {
    setForm({
      title: ad.title,
      subtitle: ad.subtitle || "",
      cta_text: ad.cta_text,
      link_url: ad.link_url,
      variant: ad.variant,
      bg_gradient: ad.bg_gradient,
      target_type: ad.target_type,
      target_page: ad.target_page,
      target_item_slug: ad.target_item_slug || "",
      target_city: ad.target_city || "",
      position: ad.position,
      priority: ad.priority,
      is_active: ad.is_active,
    });
    setEditingId(ad.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      cta_text: form.cta_text.trim(),
      link_url: form.link_url.trim(),
      variant: form.variant,
      bg_gradient: form.bg_gradient,
      target_type: form.target_type,
      target_page: form.target_type === "page" || form.target_type === "item" ? form.target_page : null,
      target_item_slug: form.target_type === "item" ? form.target_item_slug.trim() || null : null,
      target_city: (form.target_type === "city" || form.target_page) && form.target_city.trim()
        ? form.target_city.trim()
        : null,
      position: form.position,
      priority: form.priority,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("ads").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Ad updated" });
      } else {
        const { error } = await supabase.from("ads").insert(payload);
        if (error) throw error;
        toast({ title: "Ad created" });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      setShowForm(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this ad?")) return;
    const { error } = await supabase.from("ads").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ad deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    await supabase.from("ads").update({ is_active: active }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
    queryClient.invalidateQueries({ queryKey: ["ads"] });
  };

  return (
    <AdminLayout title="Ads Manager">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{ads?.length ?? 0} ads total</p>
        <Button onClick={openCreate} className="rounded-xl gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Create Ad
        </Button>
      </div>

      {/* Ad Form */}
      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{editingId ? "Edit Ad" : "Create New Ad"}</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-3">
              <Label className="text-xs">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl mt-1" placeholder="Ad title" />
            </div>

            <div>
              <Label className="text-xs">Subtitle</Label>
              <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="rounded-xl mt-1" placeholder="Optional subtitle" />
            </div>

            <div>
              <Label className="text-xs">CTA Text</Label>
              <Input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} className="rounded-xl mt-1" />
            </div>

            <div>
              <Label className="text-xs">Link URL</Label>
              <Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className="rounded-xl mt-1" />
            </div>

            <div>
              <Label className="text-xs">Variant</Label>
              <Select value={form.variant} onValueChange={(v) => setForm({ ...form, variant: v })}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VARIANTS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Position</Label>
              <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Gradient</Label>
              <Select value={form.bg_gradient} onValueChange={(v) => setForm({ ...form, bg_gradient: v })}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GRADIENTS.map((g) => (
                    <SelectItem key={g} value={g}>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-4 rounded bg-gradient-to-r ${g}`} />
                        <span className="text-xs">{g}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Target Type</Label>
              <Select value={form.target_type} onValueChange={(v) => setForm({ ...form, target_type: v })}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TARGET_TYPES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {(form.target_type === "page" || form.target_type === "item") && (
              <div>
                <Label className="text-xs">Target Page</Label>
                <Select value={form.target_page || ""} onValueChange={(v) => setForm({ ...form, target_page: v })}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAGES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {form.target_type === "item" && (
              <div>
                <Label className="text-xs">Item Slug</Label>
                <Input
                  value={form.target_item_slug}
                  onChange={(e) => setForm({ ...form, target_item_slug: e.target.value })}
                  className="rounded-xl mt-1"
                  placeholder="e.g. iit-delhi"
                />
              </div>
            )}

            {(form.target_type === "city" || form.target_type === "page") && (
              <div>
                <Label className="text-xs">City (optional for page)</Label>
                <Input
                  value={form.target_city}
                  onChange={(e) => setForm({ ...form, target_city: e.target.value })}
                  className="rounded-xl mt-1"
                  placeholder="e.g. Delhi, Mumbai"
                />
              </div>
            )}

            <div>
              <Label className="text-xs">Priority (higher = first)</Label>
              <Input
                type="number"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                className="rounded-xl mt-1"
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label className="text-xs">Active</Label>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-muted rounded-xl">
            <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
            <div className={`bg-gradient-to-r ${form.bg_gradient} rounded-xl p-4 text-white`}>
              <h4 className="font-bold">{form.title || "Ad Title"}</h4>
              {form.subtitle && <p className="text-white/80 text-sm">{form.subtitle}</p>}
              <span className="inline-block mt-2 px-3 py-1 bg-white text-foreground text-sm font-semibold rounded-lg">
                {form.cta_text}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} disabled={saving} className="rounded-xl gradient-primary text-primary-foreground">
              {saving ? "Saving..." : editingId ? "Update Ad" : "Create Ad"}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
          </div>
        </div>
      )}

      {/* Ads Table */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading ads...</div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Ad</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Target</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Variant</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Position</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Priority</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads?.map((ad) => (
                  <tr key={ad.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-foreground line-clamp-1">{ad.title}</div>
                        {ad.subtitle && <div className="text-xs text-muted-foreground line-clamp-1">{ad.subtitle}</div>}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs capitalize">{ad.target_type}</Badge>
                      {ad.target_page && <span className="text-xs text-muted-foreground ml-1">({ad.target_page})</span>}
                      {ad.target_item_slug && <span className="text-xs text-muted-foreground ml-1">[{ad.target_item_slug}]</span>}
                      {ad.target_city && <span className="text-xs text-muted-foreground ml-1">📍{ad.target_city}</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-3 rounded bg-gradient-to-r ${ad.bg_gradient}`} />
                        <span className="text-xs capitalize">{ad.variant}</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs capitalize">{ad.position}</td>
                    <td className="p-3 text-xs font-mono">{ad.priority}</td>
                    <td className="p-3">
                      <Switch
                        checked={ad.is_active}
                        onCheckedChange={(v) => handleToggle(ad.id, v)}
                        className="scale-75"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(ad)} className="w-8 h-8">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(ad.id)} className="w-8 h-8 text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!ads || ads.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">No ads yet. Create your first one!</div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
