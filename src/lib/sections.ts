export type SectionGroup = "Core Identity" | "Brand Elements" | "Communication";

export interface Section {
  slug: string;
  title: string;
  group: SectionGroup;
}

export const sections: Section[] = [
  { slug: "", title: "Brand Guidelines", group: "Core Identity" },
  { slug: "logo-marks", title: "Logo Marks", group: "Core Identity" },
  { slug: "colors", title: "Colors", group: "Core Identity" },
  { slug: "typography", title: "Typography", group: "Core Identity" },
  { slug: "assets", title: "Assets", group: "Brand Elements" },
  { slug: "application", title: "Application", group: "Brand Elements" },
  { slug: "video", title: "Video", group: "Brand Elements" },
  { slug: "overview", title: "Overview", group: "Communication" },
  { slug: "values", title: "Values", group: "Communication" },
  { slug: "pillars", title: "Pillars", group: "Communication" },
  { slug: "voice", title: "Voice", group: "Communication" },
  { slug: "audience", title: "Audience", group: "Communication" },
];

export const groupOrder: SectionGroup[] = [
  "Core Identity",
  "Brand Elements",
  "Communication",
];

export function sectionsByGroup(): Record<SectionGroup, Section[]> {
  return groupOrder.reduce(
    (acc, g) => {
      acc[g] = sections.filter((s) => s.group === g);
      return acc;
    },
    {} as Record<SectionGroup, Section[]>,
  );
}

export function getAdjacent(slug: string) {
  const i = sections.findIndex((s) => s.slug === slug);
  return {
    prev: i > 0 ? sections[i - 1] : null,
    next: i >= 0 && i < sections.length - 1 ? sections[i + 1] : null,
    current: i >= 0 ? sections[i] : null,
  };
}
