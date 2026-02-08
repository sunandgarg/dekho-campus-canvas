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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, X, Eye, EyeOff, ExternalLink, Copy, Search, Megaphone } from "lucide-react";
import { colleges } from "@/data/colleges";
import { courses } from "@/data/courses";
import { exams } from "@/data/exams";
import { articles } from "@/data/articles";


const VARIANTS = [
  { value: "horizontal", label: "Horizontal Banner", desc: "Wide banner for mid-page" },
  { value: "vertical", label: "Vertical Sidebar", desc: "Tall sidebar ad" },
  { value: "square", label: "Square", desc: "Compact square ad" },
  { value: "leaderboard", label: "Leaderboard", desc: "Full-width top strip" },
] as const;

const TARGET_TYPES = [
  { value: "universal", label: "Universal", desc: "Shows everywhere as fallback" },
  { value: "page", label: "Page-specific", desc: "Shows on a specific listing page" },
  { value: "item", label: "Item-specific", desc: "Shows on a specific detail page" },
  { value: "city", label: "City-specific", desc: "Shows for a specific city" },
] as const;

const PAGES = [
  { value: "colleges", label: "All Colleges" },
  { value: "courses", label: "All Courses" },
  { value: "exams", label: "All Exams" },
  { value: "articles", label: "All Articles" },
] as const;

const POSITIONS = [
  { value: "leaderboard", label: "Leaderboard (top strip)" },
  { value: "mid-page", label: "Mid-page" },
  { value: "sidebar", label: "Sidebar" },
  { value: "top", label: "Top of content" },
  { value: "bottom", label: "Bottom of content" },
] as const;

const GRADIENTS = [
  { value: "from-violet-600 to-purple-600", label: "Violet → Purple" },
  { value: "from-teal-500 to-emerald-500", label: "Teal → Emerald" },
  { value: "from-amber-500 to-orange-500", label: "Amber → Orange" },
  { value: "from-rose-500 to-pink-500", label: "Rose → Pink" },
  { value: "from-blue-500 to-indigo-500", label: "Blue → Indigo" },
  { value: "from-green-500 to-teal-500", label: "Green → Teal" },
  { value: "from-red-500 to-rose-500", label: "Red → Rose" },
  { value: "from-cyan-500 to-blue-500", label: "Cyan → Blue" },
  { value: "from-slate-700 to-slate-900", label: "Dark Slate" },
  { value: "from-pink-500 to-violet-500", label: "Pink → Violet" },
] as const;

const CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", 
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Bhopal", "Kochi", "Indore",
] as const;

interface AdForm {
  title: string;
  subtitle: string;
  cta_text: string;
  link_url: string;
  variant: string;
  bg_gradient: string;
  target_type: string;
  target_page: string;
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
  link_url: "",
  variant: "horizontal",
  bg_gradient: "from-violet-600 to-purple-600",
  target_type: "universal",
  target_page: "",
  target_item_slug: "",
  target_city: "",
  position: "mid-page",
  priority: 0,
  is_active: true,
};

// Helper to get all item slugs for autocomplete
function getItemSlugs(page: string): { slug: string; name: string }[] {
  switch (page) {
    case "colleges": return colleges.map((c) => ({ slug: c.slug, name: c.shortName + " — " + c.name }));
    case "courses": return courses.map((c) => ({ slug: c.slug, name: c.name + " — " + c.fullName }));
    case "exams": return exams.map((e) => ({ slug: e.slug, name: e.name + " — " + e.fullName }));
    case "articles": return articles.map((a) => ({ slug: a.slug, name: a.title }));
    default: return [];
  }
}

export default function AdminAds() {
  const { data: ads, isLoading } = useAllAds();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTarget, setFilterTarget] = useState("all");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
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
      target_page: ad.target_page || "",
      target_item_slug: ad.target_item_slug || "",
      target_city: ad.target_city || "",
      position: ad.position,
      priority: ad.priority,
      is_active: ad.is_active,
    });
    setEditingId(ad.id);
    setErrors({});
    setShowForm(true);
  };

  const duplicateAd = (ad: any) => {
    setForm({
      title: ad.title + " (Copy)",
      subtitle: ad.subtitle || "",
      cta_text: ad.cta_text,
      link_url: ad.link_url,
      variant: ad.variant,
      bg_gradient: ad.bg_gradient,
      target_type: ad.target_type,
      target_page: ad.target_page || "",
      target_item_slug: ad.target_item_slug || "",
      target_city: ad.target_city || "",
      position: ad.position,
      priority: ad.priority,
      is_active: false,
    });
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.title.trim()) newErrors.title = "Title is required";
    else if (form.title.length > 200) newErrors.title = "Title must be under 200 characters";
    
    if (!form.cta_text.trim()) newErrors.cta_text = "CTA text is required";
    else if (form.cta_text.length > 50) newErrors.cta_text = "CTA text must be under 50 characters";
    
    if (!form.link_url.trim()) newErrors.link_url = "Link URL is required";
    else if (!/^https?:\/\/.+/.test(form.link_url.trim()) && form.link_url.trim() !== "#") {
      newErrors.link_url = "Must be a valid URL starting with http:// or https://";
    }

    if (form.subtitle && form.subtitle.length > 300) newErrors.subtitle = "Subtitle must be under 300 characters";

    if ((form.target_type === "page" || form.target_type === "item") && !form.target_page) {
      newErrors.target_page = "Select a target page";
    }

    if (form.target_type === "item" && !form.target_item_slug.trim()) {
      newErrors.target_item_slug = "Select or enter an item slug";
    }

    if (form.target_type === "city" && !form.target_city.trim()) {
      newErrors.target_city = "Enter a city name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      cta_text: form.cta_text.trim(),
      link_url: form.link_url.trim(),
      variant: form.variant,
      bg_gradient: form.bg_gradient,
      target_type: form.target_type,
      target_page: (form.target_type === "page" || form.target_type === "item") && form.target_page
        ? form.target_page : null,
      target_item_slug: form.target_type === "item" && form.target_item_slug.trim()
        ? form.target_item_slug.trim() : null,
      target_city: form.target_city.trim() || null,
      position: form.position,
      priority: form.priority,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("ads").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "✅ Ad updated successfully" });
      } else {
        const { error } = await supabase.from("ads").insert(payload);
        if (error) throw error;
        toast({ title: "✅ Ad created successfully" });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      setShowForm(false);
    } catch (err: any) {
      toast({ title: "Error saving ad", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad? This action cannot be undone.")) return;
    const { error } = await supabase.from("ads").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "🗑️ Ad deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    const { error } = await supabase.from("ads").update({ is_active: active }).eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast({ title: active ? "✅ Ad activated" : "⏸️ Ad paused" });
    }
  };

  // Filtered ads
  const filteredAds = (ads ?? []).filter((ad) => {
    const matchSearch = !searchQuery || 
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.target_city?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (ad.target_page?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchTarget = filterTarget === "all" || ad.target_type === filterTarget;
    return matchSearch && matchTarget;
  });

  const activeCount = ads?.filter((a) => a.is_active).length ?? 0;
  const totalCount = ads?.length ?? 0;

  const itemSlugs = form.target_page ? getItemSlugs(form.target_page) : [];

  return (
    <AdminLayout title="Ads Manager">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">{totalCount}</span>
          <span className="text-sm text-muted-foreground">total ads</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm text-muted-foreground">{activeCount} active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="text-sm text-muted-foreground">{totalCount - activeCount} paused</span>
        </div>
        <div className="ml-auto">
          <Button onClick={openCreate} className="rounded-xl gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> Create Ad
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ads by title, city, page..."
            className="pl-10 rounded-xl"
          />
        </div>
        <Select value={filterTarget} onValueChange={setFilterTarget}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Filter by target" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Targets</SelectItem>
            <SelectItem value="universal">Universal</SelectItem>
            <SelectItem value="page">Page-specific</SelectItem>
            <SelectItem value="item">Item-specific</SelectItem>
            <SelectItem value="city">City-specific</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ad Form */}
      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {editingId ? "Edit Ad" : "Create New Ad"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {editingId ? "Update the ad configuration below" : "Fill in the details to create a targeted ad"}
              </p>
            </div>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Content Section */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                Ad Content
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium">Title *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: "" }); }}
                    className={`rounded-xl mt-1 ${errors.title ? "border-destructive" : ""}`}
                    placeholder="e.g. 🎓 Get 50% Off on Coaching!"
                    maxLength={200}
                  />
                  {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{form.title.length}/200</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs font-medium">Subtitle (optional)</Label>
                  <Textarea
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    className="rounded-xl mt-1 min-h-[60px]"
                    placeholder="Brief description or offer details"
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{form.subtitle.length}/300</p>
                </div>
                <div>
                  <Label className="text-xs font-medium">CTA Button Text *</Label>
                  <Input
                    value={form.cta_text}
                    onChange={(e) => { setForm({ ...form, cta_text: e.target.value }); setErrors({ ...errors, cta_text: "" }); }}
                    className={`rounded-xl mt-1 ${errors.cta_text ? "border-destructive" : ""}`}
                    placeholder="e.g. Apply Now, Learn More"
                    maxLength={50}
                  />
                  {errors.cta_text && <p className="text-xs text-destructive mt-1">{errors.cta_text}</p>}
                </div>
                <div>
                  <Label className="text-xs font-medium">Link URL *</Label>
                  <Input
                    value={form.link_url}
                    onChange={(e) => { setForm({ ...form, link_url: e.target.value }); setErrors({ ...errors, link_url: "" }); }}
                    className={`rounded-xl mt-1 ${errors.link_url ? "border-destructive" : ""}`}
                    placeholder="https://example.com/offer"
                  />
                  {errors.link_url && <p className="text-xs text-destructive mt-1">{errors.link_url}</p>}
                </div>
              </div>
            </div>

            {/* Appearance Section */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                Appearance
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium">Variant</Label>
                  <Select value={form.variant} onValueChange={(v) => setForm({ ...form, variant: v })}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {VARIANTS.map((v) => (
                        <SelectItem key={v.value} value={v.value}>
                          <div>
                            <div className="font-medium">{v.label}</div>
                            <div className="text-xs text-muted-foreground">{v.desc}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Position</Label>
                  <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Background Gradient</Label>
                  <Select value={form.bg_gradient} onValueChange={(v) => setForm({ ...form, bg_gradient: v })}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {GRADIENTS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-4 rounded bg-gradient-to-r ${g.value}`} />
                            <span className="text-xs">{g.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Targeting Section */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                Targeting
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium">Target Type</Label>
                  <Select value={form.target_type} onValueChange={(v) => setForm({ ...form, target_type: v, target_page: "", target_item_slug: "", target_city: "" })}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TARGET_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div>
                            <div className="font-medium">{t.label}</div>
                            <div className="text-xs text-muted-foreground">{t.desc}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(form.target_type === "page" || form.target_type === "item") && (
                  <div>
                    <Label className="text-xs font-medium">Target Page *</Label>
                    <Select value={form.target_page} onValueChange={(v) => { setForm({ ...form, target_page: v, target_item_slug: "" }); setErrors({ ...errors, target_page: "" }); }}>
                      <SelectTrigger className={`rounded-xl mt-1 ${errors.target_page ? "border-destructive" : ""}`}><SelectValue placeholder="Select page" /></SelectTrigger>
                      <SelectContent>
                        {PAGES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.target_page && <p className="text-xs text-destructive mt-1">{errors.target_page}</p>}
                  </div>
                )}

                {form.target_type === "item" && form.target_page && (
                  <div>
                    <Label className="text-xs font-medium">Item *</Label>
                    <Select value={form.target_item_slug} onValueChange={(v) => { setForm({ ...form, target_item_slug: v }); setErrors({ ...errors, target_item_slug: "" }); }}>
                      <SelectTrigger className={`rounded-xl mt-1 ${errors.target_item_slug ? "border-destructive" : ""}`}><SelectValue placeholder="Select item" /></SelectTrigger>
                      <SelectContent>
                        {itemSlugs.map((item) => (
                          <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.target_item_slug && <p className="text-xs text-destructive mt-1">{errors.target_item_slug}</p>}
                  </div>
                )}

                {(form.target_type === "city" || form.target_type === "page") && (
                  <div>
                    <Label className="text-xs font-medium">
                      City {form.target_type === "city" ? "*" : "(optional)"}
                    </Label>
                    <Select value={form.target_city} onValueChange={(v) => { setForm({ ...form, target_city: v }); setErrors({ ...errors, target_city: "" }); }}>
                      <SelectTrigger className={`rounded-xl mt-1 ${errors.target_city ? "border-destructive" : ""}`}><SelectValue placeholder="Select city" /></SelectTrigger>
                      <SelectContent>
                        {form.target_type === "page" && <SelectItem value="">No specific city</SelectItem>}
                        {CITIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.target_city && <p className="text-xs text-destructive mt-1">{errors.target_city}</p>}
                  </div>
                )}

                <div>
                  <Label className="text-xs font-medium">Priority (higher = shown first)</Label>
                  <Input
                    type="number"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                    className="rounded-xl mt-1"
                    min={0}
                    max={1000}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Higher priority ads override lower ones</p>
                </div>

                <div className="flex items-center gap-3 pt-5">
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                  />
                  <div>
                    <Label className="text-xs font-medium">{form.is_active ? "Active" : "Paused"}</Label>
                    <p className="text-xs text-muted-foreground">{form.is_active ? "Ad is live and visible" : "Ad is hidden from users"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">4</span>
                Live Preview
              </h4>
              <div className="bg-muted rounded-xl p-4">
                {form.variant === "leaderboard" ? (
                  <div className={`bg-gradient-to-r ${form.bg_gradient} h-14 rounded-xl flex items-center justify-center px-4`}>
                    <p className="text-white text-sm font-medium truncate mr-4">{form.title || "Ad Title"}</p>
                    <span className="px-4 py-1.5 bg-white text-foreground text-sm font-semibold rounded-full">{form.cta_text}</span>
                  </div>
                ) : form.variant === "vertical" ? (
                  <div className={`bg-gradient-to-b ${form.bg_gradient} rounded-xl p-5 max-w-[240px]`}>
                    <h4 className="text-lg font-bold text-white mb-2">{form.title || "Ad Title"}</h4>
                    {form.subtitle && <p className="text-white/80 text-sm mb-3">{form.subtitle}</p>}
                    <span className="inline-block w-full py-2 bg-white text-foreground text-sm font-semibold rounded-xl text-center">{form.cta_text}</span>
                  </div>
                ) : form.variant === "square" ? (
                  <div className={`bg-gradient-to-br ${form.bg_gradient} aspect-square rounded-xl flex flex-col items-center justify-center p-5 text-center max-w-[200px]`}>
                    <h4 className="text-lg font-bold text-white mb-2">{form.title || "Ad Title"}</h4>
                    {form.subtitle && <p className="text-white/80 text-sm mb-3">{form.subtitle}</p>}
                    <span className="px-5 py-1.5 bg-white text-foreground text-sm font-semibold rounded-xl">{form.cta_text}</span>
                  </div>
                ) : (
                  <div className={`bg-gradient-to-r ${form.bg_gradient} h-24 rounded-xl flex items-center justify-between px-6`}>
                    <div>
                      <h4 className="text-lg font-bold text-white">{form.title || "Ad Title"}</h4>
                      {form.subtitle && <p className="text-white/80 text-sm">{form.subtitle}</p>}
                    </div>
                    <span className="flex items-center gap-2 px-5 py-2 bg-white text-foreground font-semibold rounded-xl text-sm">
                      {form.cta_text}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6 pt-4 border-t border-border">
            <Button onClick={handleSave} disabled={saving} className="rounded-xl gradient-primary text-primary-foreground px-6">
              {saving ? "Saving..." : editingId ? "Update Ad" : "Create Ad"}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
          </div>
        </div>
      )}

      {/* Ads List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading ads...</div>
      ) : filteredAds.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <Megaphone className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">
            {searchQuery || filterTarget !== "all" ? "No ads match your filters" : "No ads yet"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery || filterTarget !== "all" ? "Try adjusting your search or filters" : "Create your first ad to get started"}
          </p>
          {!searchQuery && filterTarget === "all" && (
            <Button onClick={openCreate} className="rounded-xl gradient-primary text-primary-foreground gap-2">
              <Plus className="w-4 h-4" /> Create First Ad
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAds.map((ad) => (
            <div key={ad.id} className={`bg-card rounded-2xl border transition-all ${ad.is_active ? "border-border" : "border-border/50 opacity-70"}`}>
              <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Gradient preview */}
                <div className={`w-full lg:w-24 h-16 lg:h-14 rounded-xl bg-gradient-to-r ${ad.bg_gradient} flex items-center justify-center shrink-0`}>
                  <span className="text-xs text-white/70 uppercase tracking-wider font-medium">{ad.variant}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground truncate">{ad.title}</h4>
                    {!ad.is_active && <Badge variant="outline" className="text-xs shrink-0">Paused</Badge>}
                  </div>
                  {ad.subtitle && <p className="text-xs text-muted-foreground truncate mb-1">{ad.subtitle}</p>}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs capitalize">{ad.target_type}</Badge>
                    {ad.target_page && <Badge variant="outline" className="text-xs">{ad.target_page}</Badge>}
                    {ad.target_item_slug && <Badge variant="outline" className="text-xs font-mono">{ad.target_item_slug}</Badge>}
                    {ad.target_city && <Badge variant="outline" className="text-xs">📍 {ad.target_city}</Badge>}
                    <Badge variant="outline" className="text-xs">{ad.position}</Badge>
                    <span className="text-xs text-muted-foreground">P:{ad.priority}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={ad.is_active}
                    onCheckedChange={(v) => handleToggle(ad.id, v)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => duplicateAd(ad)} className="w-8 h-8" title="Duplicate">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(ad)} className="w-8 h-8" title="Edit">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(ad.id)} className="w-8 h-8 text-destructive hover:text-destructive" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  {ad.link_url && ad.link_url !== "#" && (
                    <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Targeting guide */}
      <div className="mt-8 bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-3">📋 Ad Targeting Priority Guide</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
          <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-center">
            <div className="font-bold text-primary mb-1">#1 Highest</div>
            <div className="text-muted-foreground">Item-specific</div>
          </div>
          <div className="p-3 bg-muted rounded-xl text-center">
            <div className="font-bold text-foreground mb-1">#2</div>
            <div className="text-muted-foreground">Page + City</div>
          </div>
          <div className="p-3 bg-muted rounded-xl text-center">
            <div className="font-bold text-foreground mb-1">#3</div>
            <div className="text-muted-foreground">Page-only</div>
          </div>
          <div className="p-3 bg-muted rounded-xl text-center">
            <div className="font-bold text-foreground mb-1">#4</div>
            <div className="text-muted-foreground">City-only</div>
          </div>
          <div className="p-3 bg-muted rounded-xl text-center">
            <div className="font-bold text-foreground mb-1">#5 Fallback</div>
            <div className="text-muted-foreground">Universal</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
