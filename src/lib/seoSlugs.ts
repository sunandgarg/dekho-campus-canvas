/**
 * SEO Sub-Slug Utilities
 * Generates SEO-friendly headings, meta titles, and URL slugs based on active filters.
 */

/** Sanitize a value into a URL-friendly slug segment */
function slugify(val: string): string {
  return val
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Get current year dynamically */
function currentYear(): number {
  return new Date().getFullYear();
}

/** Generate SEO heading for college listings */
export function getCollegeHeading(filters: {
  courseGroup?: string;
  stream?: string;
  state?: string;
  city?: string;
  type?: string;
  exam?: string;
  approval?: string;
}) {
  const parts: string[] = ["Top"];
  if (filters.type) parts.push(filters.type);
  if (filters.courseGroup) parts.push(filters.courseGroup);
  else if (filters.stream) parts.push(filters.stream);
  if (filters.exam) parts.push(`Accepting ${filters.exam}`);
  parts.push("Colleges");
  if (filters.approval) parts.push(`(${filters.approval} Approved)`);
  const location = filters.city || filters.state || "India";
  parts.push(`in ${location}`);
  parts.push(String(currentYear()));
  return parts.join(" ");
}

/** Generate SEO heading for course listings */
export function getCourseHeading(filters: {
  courseGroup?: string;
  stream?: string;
  mode?: string;
  duration?: string;
}) {
  const parts: string[] = ["Top"];
  if (filters.mode) parts.push(filters.mode);
  if (filters.courseGroup) parts.push(filters.courseGroup);
  else if (filters.stream) parts.push(filters.stream);
  parts.push(`Courses in India ${currentYear()}`);
  if (filters.duration) parts.push(`— ${filters.duration}`);
  return parts.join(" ");
}

/** Generate SEO heading for exam listings */
export function getExamHeading(filters: {
  category?: string;
  stream?: string;
  courseGroup?: string;
  level?: string;
}) {
  const parts: string[] = ["Top"];
  if (filters.level) parts.push(filters.level + " Level");
  if (filters.courseGroup) parts.push(filters.courseGroup);
  else if (filters.stream) parts.push(filters.stream);
  else if (filters.category) parts.push(filters.category);
  parts.push(`Entrance Exams in India ${currentYear()}`);
  return parts.join(" ");
}

/** Generate SEO-friendly URL slug from filter state */
export function filtersToSlug(
  entity: "colleges" | "courses" | "exams",
  filters: Record<string, string | undefined>
): string {
  const parts: string[] = [];

  if (filters.type) parts.push(slugify(filters.type));
  if (filters.courseGroup) parts.push(slugify(filters.courseGroup));
  else if (filters.stream) parts.push(slugify(filters.stream));
  if (filters.exam) parts.push(`accepting-${slugify(filters.exam)}`);
  if (filters.mode) parts.push(slugify(filters.mode));

  parts.push(entity);

  if (filters.approval) parts.push(`${slugify(filters.approval)}-approved`);

  const location = filters.city || filters.state;
  if (location) parts.push(`in-${slugify(location)}`);
  else parts.push("in-india");

  parts.push(String(currentYear()));
  return parts.join("-");
}

/** Parse a SEO slug back into filter parameters */
export function slugToFilters(slug: string): Record<string, string> {
  const filters: Record<string, string> = {};
  // Extract year
  const yearMatch = slug.match(/-(\d{4})$/);
  if (yearMatch) slug = slug.replace(/-\d{4}$/, "");

  // Extract location (in-xxx)
  const locationMatch = slug.match(/in-([a-z-]+)$/);
  if (locationMatch && locationMatch[1] !== "india") {
    filters.location = locationMatch[1].replace(/-/g, " ");
    slug = slug.replace(/in-[a-z-]+$/, "").replace(/-$/, "");
  }

  // Extract exam (accepting-xxx)
  const examMatch = slug.match(/accepting-([a-z0-9-]+)/);
  if (examMatch) {
    filters.exam = examMatch[1].replace(/-/g, " ").toUpperCase();
    slug = slug.replace(/accepting-[a-z0-9-]+/, "").replace(/--+/g, "-").replace(/^-|-$/g, "");
  }

  // Remove entity name
  slug = slug.replace(/(colleges|courses|exams)/, "").replace(/--+/g, "-").replace(/^-|-$/g, "");

  // What remains is likely the course group or stream
  if (slug) {
    filters.group = slug.replace(/-/g, " ");
  }

  return filters;
}

/** Generate URL-friendly slug from filter state */
export function filtersToSearchParams(filters: Record<string, string | string[]>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      if (value.length === 1) params.set(key, value[0]);
    } else {
      params.set(key, value);
    }
  }
  return params;
}

/** Common SEO sub-slug configurations for colleges */
export const collegeSeoRoutes = [
  { label: "Engineering Colleges", params: { stream: "Engineering" } },
  { label: "Medical Colleges", params: { stream: "Medical" } },
  { label: "Management Colleges", params: { stream: "Management" } },
  { label: "Law Colleges", params: { stream: "Law" } },
  { label: "Science Colleges", params: { stream: "Science" } },
  { label: "Arts Colleges", params: { stream: "Arts & Humanities" } },
  { label: "Commerce Colleges", params: { stream: "Commerce" } },
  { label: "Design Colleges", params: { stream: "Design" } },
  { label: "Colleges in Delhi", params: { state: "Delhi" } },
  { label: "Colleges in Mumbai", params: { city: "Mumbai", state: "Maharashtra" } },
  { label: "Colleges in Bangalore", params: { city: "Bangalore", state: "Karnataka" } },
  { label: "Colleges in Chennai", params: { city: "Chennai", state: "Tamil Nadu" } },
  { label: "B.Tech Colleges", params: { group: "B.Tech" } },
  { label: "MBA Colleges", params: { group: "MBA" } },
  { label: "MBBS Colleges", params: { group: "MBBS" } },
  { label: "BBA Colleges", params: { group: "BBA" } },
  { label: "B.Com Colleges", params: { group: "B.Com" } },
  { label: "LLB Colleges", params: { group: "LLB" } },
  { label: "Engineering Colleges in Delhi", params: { stream: "Engineering", state: "Delhi" } },
  { label: "MBA Colleges in Mumbai", params: { group: "MBA", city: "Mumbai", state: "Maharashtra" } },
];

/** Common SEO sub-slug configurations for courses */
export const courseSeoRoutes = [
  { label: "Engineering Courses", params: { stream: "Engineering" } },
  { label: "Medical Courses", params: { stream: "Medical" } },
  { label: "Management Courses", params: { stream: "Management" } },
  { label: "B.Tech Courses", params: { group: "B.Tech" } },
  { label: "MBA Courses", params: { group: "MBA" } },
  { label: "MBBS Courses", params: { group: "MBBS" } },
  { label: "BCA Courses", params: { group: "BCA" } },
  { label: "MCA Courses", params: { group: "MCA" } },
  { label: "Online Courses", params: { mode: "Online" } },
  { label: "Distance Learning Courses", params: { mode: "Distance" } },
];

/** Common SEO sub-slug configurations for exams */
export const examSeoRoutes = [
  { label: "Engineering Entrance Exams", params: { stream: "Engineering" } },
  { label: "Medical Entrance Exams", params: { stream: "Medical" } },
  { label: "Management Entrance Exams", params: { stream: "Management" } },
  { label: "Law Entrance Exams", params: { stream: "Law" } },
  { label: "National Level Exams", params: { level: "National" } },
  { label: "State Level Exams", params: { level: "State" } },
  { label: "University Level Exams", params: { level: "University" } },
];
