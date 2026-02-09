interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export function RichTextEditor({ label, value, onChange, rows = 4, placeholder }: RichTextEditorProps) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
        className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm resize-y mt-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
      />
    </div>
  );
}
