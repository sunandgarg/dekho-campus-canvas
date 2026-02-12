import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { ScrollSection } from "@/components/ScrollSpy";

interface UsefulLinksProps {
  type: "college" | "course" | "exam";
  name: string;
  shortName?: string;
  slug: string;
  state?: string;
  city?: string;
  category?: string;
  sections: ScrollSection[];
  courseGroups?: string[];
  topCourses?: { name: string; slug: string }[];
}

export function UsefulLinks({
  type, name, shortName, slug, state, city, category,
  sections, courseGroups, topCourses,
}: UsefulLinksProps) {
  const displayName = shortName || name;
  const location = city || state || "India";

  // Generate "Know more about" links from page sections
  const knowMoreLinks = sections.slice(0, 8).map((s) => ({
    label: s.label,
    href: `/${type}s/${slug}/${s.id}`,
  }));

  // Generate course group links dynamically
  const courseGroupLinks = (courseGroups || [
    "B.Tech", "B.Sc.", "M.Sc.", "MBA", "M.Des", "B.Des", "M.A.", "Ph.D.",
    "Executive MBA", "BBA", "MCA", "BCA",
  ]).slice(0, 10).map((cg) => ({
    label: cg,
    href: `/courses?group=${encodeURIComponent(cg)}`,
  }));

  // Generate top courses dynamically
  const topCourseLinks = (topCourses || []).slice(0, 8).map((c) => ({
    label: c.name,
    href: `/courses/${c.slug}`,
  }));

  // Generate location-based course links
  const locationCourseLinks = location !== "India" ? [
    "B.Sc.", "M.Sc.", "Ph.D.", "MBA", "M.A.", "B.Des", "B.Tech", "M.Tech",
  ].slice(0, 8).map((c) => ({
    label: `${c} in ${location}`,
    href: `/courses?location=${encodeURIComponent(location)}`,
  })) : [];

  return (
    <section className="bg-card rounded-2xl border border-border p-5 mt-6">
      <h2 className="text-lg font-bold text-foreground mb-5">Useful Links</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Know more about */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Know more about {displayName}
          </h3>
          <div className="flex flex-wrap gap-2">
            {knowMoreLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="text-xs text-primary hover:underline bg-primary/5 px-2.5 py-1.5 rounded-lg"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Course Groups */}
        {type === "college" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Top Course Group Offered by {displayName}
            </h3>
            <div className="flex flex-wrap gap-2">
              {courseGroupLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  className="text-xs text-primary hover:underline bg-primary/5 px-2.5 py-1.5 rounded-lg"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Top Courses at this college */}
        {type === "college" && topCourseLinks.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Top Courses Offered in {displayName}
            </h3>
            <div className="flex flex-wrap gap-2">
              {topCourseLinks.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="text-xs text-primary hover:underline bg-primary/5 px-2.5 py-1.5 rounded-lg"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Location courses */}
        {locationCourseLinks.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Top Courses Offered in {location}
            </h3>
            <div className="flex flex-wrap gap-2">
              {locationCourseLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  className="text-xs text-primary hover:underline bg-primary/5 px-2.5 py-1.5 rounded-lg"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
