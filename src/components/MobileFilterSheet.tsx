import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface FilterConfig {
  title: string;
  items: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  singleSelect?: boolean;
}

interface MobileFilterSheetProps {
  filters: FilterConfig[];
  activeCount: number;
  onClearAll: () => void;
}

export function MobileFilterSheet({ filters, activeCount, onClearAll }: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden rounded-xl gap-2 h-9 text-xs">
          <Filter className="w-3.5 h-3.5" />
          Filters
          {activeCount > 0 && (
            <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 h-4">{activeCount}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base">Filters</SheetTitle>
            {activeCount > 0 && (
              <button onClick={onClearAll} className="text-xs text-destructive hover:underline">Reset All</button>
            )}
          </div>
        </SheetHeader>
        <div className="p-4 space-y-3">
          {filters.map((f) => (
            <MobileFilterSection key={f.title} {...f} />
          ))}
        </div>
        <div className="sticky bottom-0 p-4 border-t border-border bg-background">
          <Button className="w-full rounded-xl" onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileFilterSection({ title, items, selected, onChange, singleSelect }: FilterConfig) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? items : items.slice(0, 4);

  const toggle = (item: string) => {
    if (singleSelect) {
      onChange(selected.includes(item) ? [] : [item]);
    } else {
      onChange(selected.includes(item) ? selected.filter(x => x !== item) : [...selected, item]);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-3">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-sm font-semibold text-foreground">
        {title}
        {selected.length > 0 && <Badge variant="secondary" className="text-[10px] ml-2 px-1.5">{selected.length}</Badge>}
        <span className="ml-auto">{expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
      </button>
      {expanded && (
        <div className="mt-2 space-y-1.5">
          {displayItems.map(item => (
            <label key={item} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted rounded px-1 py-0.5">
              <Checkbox checked={selected.includes(item)} onCheckedChange={() => toggle(item)} className="w-4 h-4" />
              <span className="text-xs">{item}</span>
            </label>
          ))}
          {items.length > 4 && (
            <button onClick={() => setShowAll(!showAll)} className="text-xs text-primary hover:underline mt-1">
              {showAll ? "Show less" : `+ ${items.length - 4} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
