import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { MapPin, Building } from "lucide-react";
import { Link } from "react-router-dom";

export function PopularPlaces() {
  const { data: places } = useQuery({
    queryKey: ["popular-places"],
    queryFn: async () => {
      const { data } = await supabase
        .from("popular_places")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(20);
      return data ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });

  if (!places?.length) return null;

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
            <MapPin className="w-4 h-4" />
            Explore Places
          </div>
          <h2 className="text-headline font-bold text-foreground">Popular Education Cities</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">Discover top colleges in India's most popular education hubs</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {places.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/colleges?state=${encodeURIComponent(place.state)}`}
                className="group relative block rounded-2xl overflow-hidden card-elevated h-36 md:h-44"
              >
                {place.image_url && (
                  <img
                    src={place.image_url}
                    alt={place.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-bold text-background">{place.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3 text-background/70" />
                    <span className="text-xs text-background/70">{place.college_count}+ Colleges</span>
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
