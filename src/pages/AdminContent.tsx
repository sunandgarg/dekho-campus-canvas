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
import { Plus, Pencil, Trash2, X, HelpCircle, MapPin, GripVertical } from "lucide-react";

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

// ─── Main Page ────────────────────────────────────────────────────────

export default function AdminContent() {
  return (
    <AdminLayout title="Content Manager">
      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="faqs" className="gap-2"><HelpCircle className="w-4 h-4" />FAQs</TabsTrigger>
          <TabsTrigger value="places" className="gap-2"><MapPin className="w-4 h-4" />Popular Places</TabsTrigger>
        </TabsList>
        <TabsContent value="faqs"><FAQManager /></TabsContent>
        <TabsContent value="places"><PlacesManager /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
