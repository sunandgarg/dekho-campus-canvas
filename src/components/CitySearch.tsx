import { motion } from "framer-motion";
import { MapPin, Building, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const fallbackCities = [
  { id: "1", name: "Delhi", state: "Delhi", college_count: 450, image_url: null },
  { id: "2", name: "Mumbai", state: "Maharashtra", college_count: 380, image_url: null },
  { id: "3", name: "Bangalore", state: "Karnataka", college_count: 420, image_url: null },
  { id: "4", name: "Chennai", state: "Tamil Nadu", college_count: 350, image_url: null },
  { id: "5", name: "Hyderabad", state: "Telangana", college_count: 310, image_url: null },
  { id: "6", name: "Pune", state: "Maharashtra", college_count: 290, image_url: null },
  { id: "7", name: "Kolkata", state: "West Bengal", college_count: 270, image_url: null },
  { id: "8", name: "Jaipur", state: "Rajasthan", college_count: 200, image_url: null },
  { id: "9", name: "Lucknow", state: "Uttar Pradesh", college_count: 220, image_url: null },
  { id: "10", name: "Chandigarh", state: "Punjab", college_count: 150, image_url: null },
];

export function CitySearch() {
  const { data: places } = useQuery({
    queryKey: ["popular-places"],
    queryFn: async () => {
      const { data } = await supabase
        .from("popular_places")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(12);
      return data?.length ? data : fallbackCities;
    },
    staleTime: 10 * 60 * 1000,
  });

  const cities = places ?? fallbackCities;

  return (
    <section className="py-10 md:py-14 bg-muted/30" aria-labelledby="city-search-heading">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-2">
              <MapPin className="w-4 h-4" />
              Top Cities
            </div>
            <h2 id="city-search-heading" className="text-headline font-bold text-foreground">
              Find Colleges in Your <span className="text-gradient">City</span>
            </h2>
          </div>
          <Link to="/colleges">
            <Button variant="outline" size="sm" className="rounded-xl border-border hover:bg-primary/5">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Single-row horizontal scroll carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {cities.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="flex-shrink-0"
            >
              <Link
                to={`/colleges?state=${encodeURIComponent(place.state)}`}
                className="group flex items-center gap-3 px-4 py-3 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
              >
                {place.image_url ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                    <img src={place.image_url} alt={place.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors whitespace-nowrap">{place.name}</h3>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building className="w-3 h-3" />{place.college_count}+ Colleges
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
