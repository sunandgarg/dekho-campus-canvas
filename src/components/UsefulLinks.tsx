import { Link } from "react-router-dom";
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

  // "Know more about" links — scroll to sections on same page
  const knowMoreLinks = sections.slice(0, 8).map((s) => ({
    label: s.label,
    sectionId: s.id,
  }));

  // Course group links for college pages
  const courseGroupLinks = (courseGroups || [
    "B.Tech", "B.Sc.", "M.Sc.", "MBA", "M.Des", "B.Des", "M.A.", "Ph.D.",
    "Executive MBA", "BBA", "MCA", "BCA",
  ]).slice(0, 10).map((cg) => ({
    label: cg,
    href: `/courses?group=${encodeURIComponent(cg)}`,
  }));

  // Top courses at this college
  const topCourseLinks = (topCourses || []).slice(0, 8).map((c) => ({
    label: c.name,
    href: `/courses/${c.slug}`,
  }));

  // Location-based course links — navigate to colleges with filters
  const locationCourseLinks = location !== "India" ? [
    "B.Sc.", "M.Sc.", "Ph.D.", "MBA", "M.A.", "B.Des", "B.Tech", "M.Tech",
  ].slice(0, 8).map((c) => ({
    label: `${c} in ${location}`,
    href: `/colleges?city=${encodeURIComponent(location)}&stream=${encodeURIComponent(c)}`,
  })) : [];

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.replaceState(null, "", `/${type}s/${slug}/${sectionId}`);
    }
  };

  return (
    <section className="bg-card rounded-2xl border border-border p-5 mt-6">
      <h2 className="text-lg font-bold text-foreground mb-5">Useful Links</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Know more about — in-page scroll */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Know more about {displayName}
          </h3>
          <div className="flex flex-wrap gap-2">
            {knowMoreLinks.map((l) => (
              <button
                key={l.sectionId}
                onClick={() => scrollToSection(l.sectionId)}
                className="text-xs text-primary hover:underline bg-primary/5 px-2.5 py-1.5 rounded-lg cursor-pointer"
              >
                {l.label}
              </button>
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

        {/* Location courses - navigate to colleges page with filters */}
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
