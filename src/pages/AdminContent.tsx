import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, X, HelpCircle, MapPin, GripVertical, Newspaper, CalendarDays, Megaphone, Star } from "lucide-react";
import { useAllCollegeUpdates, type CollegeUpdate } from "@/hooks/useCollegeUpdates";
import { ReviewsManager } from "@/components/admin/ReviewsManager";

// ─── FAQ Management ───────────────────────────────────────────────────

interface FAQForm {
  question: string;
  answer: string;
  page: string;
  item_slug: string;
  display_order: number;
  is_active: boolean;
}

const emptyFAQ: FAQForm = {
  question: "", answer: "", page: "homepage", item_slug: "", display_order: 0, is_active: true,
};

function FAQManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FAQForm>(emptyFAQ);
  const [filterPage, setFilterPage] = useState("all");

  const { data: faqs, isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const { data } = await supabase.from("faqs").select("*").order("display_order");
      return data ?? [];
    },
  });

  const filtered = (faqs ?? []).filter(
    (f) => filterPage === "all" || f.page === filterPage
  );

  const openCreate = () => { setForm(emptyFAQ); setEditId(null); setShowForm(true); };
  const openEdit = (faq: any) => {
    setForm({
      question: faq.question, answer: faq.answer, page: faq.page,
      item_slug: faq.item_slug || "", display_order: faq.display_order, is_active: faq.is_active,
    });
    setEditId(faq.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast({ title: "Please fill question and answer", variant: "destructive" });
      return;
    }
    const payload = {
      ...form,
      item_slug: form.item_slug.trim() || null,
    };
    if (editId) {
      await supabase.from("faqs").update(payload).eq("id", editId);
      toast({ title: "✅ FAQ updated" });
    } else {
      await supabase.from("faqs").insert(payload);
      toast({ title: "✅ FAQ created" });
    }
    queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
    queryClient.invalidateQueries({ queryKey: ["faqs"] });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
    queryClient.invalidateQueries({ queryKey: ["faqs"] });
    toast({ title: "🗑️ FAQ deleted" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Select value={filterPage} onValueChange={setFilterPage}>
            <SelectTrigger className="w-[160px] rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              <SelectItem value="homepage">Homepage</SelectItem>
              <SelectItem value="colleges">Colleges</SelectItem>
              <SelectItem value="courses">Courses</SelectItem>
              <SelectItem value="exams">Exams</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{filtered.length} FAQs</span>
        </div>
        <Button onClick={openCreate} className="rounded-xl gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editId ? "Edit FAQ" : "New FAQ"}</h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="space-y-3">
            <div>
              <Label>Question</Label>
              <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="rounded-xl mt-1 min-h-[80px]" />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label>Page</Label>
                <Select value={form.page} onValueChange={(v) => setForm({ ...form, page: v })}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="colleges">Colleges</SelectItem>
                    <SelectItem value="courses">Courses</SelectItem>
                    <SelectItem value="exams">Exams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Item Slug (optional)</Label>
                <Input value={form.item_slug} onChange={(e) => setForm({ ...form, item_slug: e.target.value })} placeholder="e.g. iit-delhi" className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="rounded-xl mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>{form.is_active ? "Active" : "Hidden"}</Label>
            </div>
            <Button onClick={handleSave} className="rounded-xl gradient-primary text-primary-foreground">
              {editId ? "Save Changes" : "Create FAQ"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((faq) => (
          <div key={faq.id} className={`bg-card rounded-xl border border-border p-3 flex items-start gap-3 ${!faq.is_active ? "opacity-50" : ""}`}>
            <HelpCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{faq.question}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{faq.answer}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className="text-[10px]">{faq.page}</Badge>
                {faq.item_slug && <Badge variant="secondary" className="text-[10px]">{faq.item_slug}</Badge>}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => openEdit(faq)} className="w-7 h-7"><Pencil className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)} className="w-7 h-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Popular Places Management ────────────────────────────────────────

interface PlaceForm {
  name: string;
  state: string;
  image_url: string;
  college_count: number;
  display_order: number;
  is_active: boolean;
}

const emptyPlace: PlaceForm = {
  name: "", state: "", image_url: "", college_count: 0, display_order: 0, is_active: true,
};

function PlacesManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PlaceForm>(emptyPlace);

  const { data: places } = useQuery({
    queryKey: ["admin-places"],
    queryFn: async () => {
      const { data } = await supabase.from("popular_places").select("*").order("display_order");
      return data ?? [];
    },
  });

  const openCreate = () => { setForm(emptyPlace); setEditId(null); setShowForm(true); };
  const openEdit = (p: any) => {
    setForm({
      name: p.name, state: p.state, image_url: p.image_url || "",
      college_count: p.college_count, display_order: p.display_order, is_active: p.is_active,
    });
    setEditId(p.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.state.trim()) {
      toast({ title: "Please fill name and state", variant: "destructive" });
      return;
    }
    const payload = { ...form, image_url: form.image_url.trim() || null };
    if (editId) {
      await supabase.from("popular_places").update(payload).eq("id", editId);
      toast({ title: "✅ Place updated" });
    } else {
      await supabase.from("popular_places").insert(payload);
      toast({ title: "✅ Place created" });
    }
    queryClient.invalidateQueries({ queryKey: ["admin-places"] });
    queryClient.invalidateQueries({ queryKey: ["popular-places"] });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this place?")) return;
    await supabase.from("popular_places").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-places"] });
    queryClient.invalidateQueries({ queryKey: ["popular-places"] });
    toast({ title: "🗑️ Place deleted" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{places?.length ?? 0} places</span>
        <Button onClick={openCreate} className="rounded-xl gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Place
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editId ? "Edit Place" : "New Place"}</h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>City/Area Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>State</Label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="rounded-xl mt-1" />
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="rounded-xl mt-1" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>College Count</Label>
                <Input type="number" value={form.college_count} onChange={(e) => setForm({ ...form, college_count: parseInt(e.target.value) || 0 })} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="rounded-xl mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>{form.is_active ? "Active" : "Hidden"}</Label>
            </div>
            <Button onClick={handleSave} className="rounded-xl gradient-primary text-primary-foreground">
              {editId ? "Save Changes" : "Create Place"}
            </Button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(places ?? []).map((place) => (
          <div key={place.id} className={`bg-card rounded-xl border border-border overflow-hidden ${!place.is_active ? "opacity-50" : ""}`}>
            {place.image_url && <img src={place.image_url} alt={place.name} className="w-full h-24 object-cover" />}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{place.name}</p>
                  <p className="text-xs text-muted-foreground">{place.state} • {place.college_count}+ colleges</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(place)} className="w-7 h-7"><Pencil className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(place.id)} className="w-7 h-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── College Updates Manager ──────────────────────────────────────────

interface UpdateForm {
  college_slug: string;
  type: string;
  title: string;
  content: string;
  image_url: string;
  event_date: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
}

const emptyUpdate: UpdateForm = {
  college_slug: "", type: "news", title: "", content: "", image_url: "", event_date: "", link_url: "", display_order: 0, is_active: true,
};

function CollegeUpdatesManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: updates } = useAllCollegeUpdates();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<UpdateForm>(emptyUpdate);
  const [filterType, setFilterType] = useState("all");

  const filtered = (updates ?? []).filter(
    (u) => filterType === "all" || u.type === filterType
  );

  const openCreate = () => { setForm(emptyUpdate); setEditId(null); setShowForm(true); };
  const openEdit = (u: CollegeUpdate) => {
    setForm({
      college_slug: u.college_slug, type: u.type, title: u.title, content: u.content,
      image_url: u.image_url || "", event_date: u.event_date ? u.event_date.split("T")[0] : "",
      link_url: u.link_url, display_order: u.display_order, is_active: u.is_active,
    });
    setEditId(u.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.college_slug.trim() || !form.title.trim()) {
      toast({ title: "College slug and title required", variant: "destructive" });
      return;
    }
    const payload = {
      ...form,
      image_url: form.image_url.trim() || null,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : null,
      link_url: form.link_url.trim(),
    };
    if (editId) {
      await supabase.from("college_updates").update(payload).eq("id", editId);
      toast({ title: "✅ Update saved" });
    } else {
      await supabase.from("college_updates").insert(payload);
      toast({ title: "✅ Update created" });
    }
    queryClient.invalidateQueries({ queryKey: ["admin-college-updates"] });
    queryClient.invalidateQueries({ queryKey: ["college-updates"] });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this update?")) return;
    await supabase.from("college_updates").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-college-updates"] });
    queryClient.invalidateQueries({ queryKey: ["college-updates"] });
    toast({ title: "🗑️ Update deleted" });
  };

  const typeIcon = (type: string) => {
    if (type === "event") return <CalendarDays className="w-4 h-4 text-accent" />;
    if (type === "announcement") return <Megaphone className="w-4 h-4 text-destructive" />;
    return <Newspaper className="w-4 h-4 text-primary" />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[160px] rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="announcement">Announcements</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{filtered.length} updates</span>
        </div>
        <Button onClick={openCreate} className="rounded-xl gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Update
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editId ? "Edit Update" : "New Update"}</h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label>College Slug *</Label>
                <Input value={form.college_slug} onChange={(e) => setForm({ ...form, college_slug: e.target.value })} placeholder="e.g. xlri-jamshedpur" className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="rounded-xl mt-1" />
              </div>
            </div>
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="rounded-xl mt-1 min-h-[60px]" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {form.type === "event" && (
                <div>
                  <Label>Event Date</Label>
                  <Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="rounded-xl mt-1" />
                </div>
              )}
              <div>
                <Label>Link URL (optional)</Label>
                <Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://..." className="rounded-xl mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>{form.is_active ? "Active" : "Hidden"}</Label>
            </div>
            <Button onClick={handleSave} className="rounded-xl gradient-primary text-primary-foreground">
              {editId ? "Save Changes" : "Create Update"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((u) => (
          <div key={u.id} className={`bg-card rounded-xl border border-border p-3 flex items-start gap-3 ${!u.is_active ? "opacity-50" : ""}`}>
            {typeIcon(u.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{u.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{u.content}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className="text-[10px]">{u.type}</Badge>
                <Badge variant="secondary" className="text-[10px]">{u.college_slug}</Badge>
                {u.event_date && <Badge variant="secondary" className="text-[10px]">{new Date(u.event_date).toLocaleDateString()}</Badge>}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => openEdit(u)} className="w-7 h-7"><Pencil className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)} className="w-7 h-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────

export default function AdminContent() {
  return (
    <AdminLayout title="Content Manager">
      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="faqs" className="gap-2"><HelpCircle className="w-4 h-4" />FAQs</TabsTrigger>
          <TabsTrigger value="places" className="gap-2"><MapPin className="w-4 h-4" />Popular Places</TabsTrigger>
          <TabsTrigger value="updates" className="gap-2"><Newspaper className="w-4 h-4" />College Updates</TabsTrigger>
          <TabsTrigger value="reviews" className="gap-2"><Star className="w-4 h-4" />Student Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="faqs"><FAQManager /></TabsContent>
        <TabsContent value="places"><PlacesManager /></TabsContent>
        <TabsContent value="updates"><CollegeUpdatesManager /></TabsContent>
        <TabsContent value="reviews"><ReviewsManager /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
