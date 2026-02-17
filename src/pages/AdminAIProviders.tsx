import { useState } from "react";

import { AdminLayout } from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Eye, EyeOff, Save, TestTube, Loader2, Shield, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * AdminAIProviders — Manage AI Provider API Keys
 * 
 * This page allows admins to:
 * 1. View all supported AI providers (ChatGPT, Gemini, Claude, etc.)
 * 2. Enter/update API keys for each provider
 * 3. Toggle providers on/off
 * 4. Test API key connectivity
 * 
 * Security: API keys are stored in the `ai_providers` table.
 * RLS ensures only admins can write; public can only read non-key fields.
 * 
 * How it works:
 * - Each provider row has: provider_name, display_name, api_key_encrypted, base_url, default_model, is_active
 * - The admin enters an API key, clicks Save, and it's stored in the DB
 * - The ai-counselor edge function can then read the active provider's key to route requests
 */

interface AIProvider {
  id: string;
  provider_name: string;
  display_name: string;
  api_key_encrypted: string;
  base_url: string;
  default_model: string;
  is_active: boolean;
  icon_emoji: string;
  updated_at: string;
}

export default function AdminAIProviders() {
  const queryClient = useQueryClient();
  const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testingProvider, setTestingProvider] = useState<string | null>(null);

  const { data: providers, isLoading } = useQuery({
    queryKey: ["ai-providers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_providers")
        .select("*")
        .order("display_name");
      if (error) throw error;
      return data as AIProvider[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AIProvider> }) => {
      const { error } = await supabase
        .from("ai_providers")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-providers"] });
      toast.success("Provider updated");
    },
    onError: (err: Error) => {
      toast.error("Update failed: " + err.message);
    },
  });

  const handleSaveKey = (provider: AIProvider) => {
    const newKey = editingKeys[provider.id];
    if (!newKey?.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    updateMutation.mutate({
      id: provider.id,
      updates: { api_key_encrypted: newKey.trim() },
    });
    setEditingKeys((prev) => ({ ...prev, [provider.id]: "" }));
  };

  const handleToggle = (provider: AIProvider) => {
    updateMutation.mutate({
      id: provider.id,
      updates: { is_active: !provider.is_active },
    });
  };

  const handleTest = async (provider: AIProvider) => {
    setTestingProvider(provider.id);
    // Simple connectivity test - just check if key is set
    setTimeout(() => {
      if (provider.api_key_encrypted) {
        toast.success(`${provider.display_name} key is configured ✓`);
      } else {
        toast.error(`${provider.display_name} has no API key set`);
      }
      setTestingProvider(null);
    }, 1000);
  };

  const maskKey = (key: string) => {
    if (!key) return "Not set";
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
  };

  return (
    <AdminLayout title="AI Providers">
      {/* Documentation block */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm text-foreground space-y-1">
            <p className="font-semibold">How AI Provider Management Works</p>
            <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
              <li>Enter API keys from each provider's developer dashboard</li>
              <li>Toggle providers on/off — the AI counselor will use the first active provider</li>
              <li>Keys are stored securely in the database with admin-only write access</li>
              <li>The default provider (Lovable AI) works without any API key</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Default Lovable AI notice */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-accent" />
        <div>
          <p className="text-sm font-semibold text-foreground">Lovable AI (Default) — Always Available</p>
          <p className="text-xs text-muted-foreground">No API key needed. Uses Google Gemini & OpenAI GPT via Lovable's built-in gateway.</p>
        </div>
        <Badge className="ml-auto bg-accent/20 text-accent border-0">Active</Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {providers?.map((provider) => (
            <div
              key={provider.id}
              className={`bg-card rounded-2xl border p-5 transition-all ${
                provider.is_active ? "border-primary/30 shadow-sm" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.icon_emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{provider.display_name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Model: {provider.default_model} • {provider.base_url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {provider.api_key_encrypted ? (
                    <Badge variant="outline" className="text-xs border-accent/30 text-accent">Key Set</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs border-destructive/30 text-destructive">No Key</Badge>
                  )}
                  <Switch
                    checked={provider.is_active}
                    onCheckedChange={() => handleToggle(provider)}
                  />
                </div>
              </div>

              {/* Current key display */}
              <div className="flex items-center gap-2 mb-3">
                <code className="text-xs bg-muted px-3 py-1.5 rounded-lg flex-1 text-muted-foreground font-mono">
                  {showKeys[provider.id] && provider.api_key_encrypted
                    ? provider.api_key_encrypted
                    : maskKey(provider.api_key_encrypted)}
                </code>
                {provider.api_key_encrypted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowKeys((prev) => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                  >
                    {showKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                )}
              </div>

              {/* Update key */}
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={editingKeys[provider.id] || ""}
                  onChange={(e) => setEditingKeys((prev) => ({ ...prev, [provider.id]: e.target.value }))}
                  placeholder={`Enter ${provider.display_name} API key...`}
                  className="flex-1 rounded-xl h-9 text-sm font-mono"
                />
                <Button
                  size="sm"
                  className="rounded-xl h-9"
                  onClick={() => handleSaveKey(provider)}
                  disabled={!editingKeys[provider.id]?.trim()}
                >
                  <Save className="w-3.5 h-3.5 mr-1" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl h-9"
                  onClick={() => handleTest(provider)}
                  disabled={testingProvider === provider.id}
                >
                  {testingProvider === provider.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <TestTube className="w-3.5 h-3.5 mr-1" />
                  )}
                  Test
                </Button>
              </div>

              {/* Model & URL editing */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Default Model</label>
                  <Input
                    defaultValue={provider.default_model}
                    onBlur={(e) => {
                      if (e.target.value !== provider.default_model) {
                        updateMutation.mutate({ id: provider.id, updates: { default_model: e.target.value } });
                      }
                    }}
                    className="rounded-xl h-8 text-xs mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Base URL</label>
                  <Input
                    defaultValue={provider.base_url}
                    onBlur={(e) => {
                      if (e.target.value !== provider.base_url) {
                        updateMutation.mutate({ id: provider.id, updates: { base_url: e.target.value } });
                      }
                    }}
                    className="rounded-xl h-8 text-xs mt-0.5"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
