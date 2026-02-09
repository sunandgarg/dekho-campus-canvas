import { motion } from "framer-motion";
import { MapPin, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      return data ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });

  if (!places?.length) return null;

  return (
    <section className="py-10 md:py-14 bg-muted/30" aria-labelledby="city-search-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
            <MapPin className="w-4 h-4" />
            Search by City
          </div>
          <h2 id="city-search-heading" className="text-headline font-bold text-foreground">
            Find Colleges in Your <span className="text-gradient">City</span>
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm">
            Discover top colleges in India's most popular education hubs
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {places.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/colleges?state=${encodeURIComponent(place.state)}`}
                className="group flex flex-col items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-center"
              >
                {place.image_url ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
                    <img src={place.image_url} alt={place.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{place.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Building className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{place.college_count}+ Colleges</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
