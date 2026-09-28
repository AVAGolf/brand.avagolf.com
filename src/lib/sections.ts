export type SectionGroup = "Core Identity" | "Brand Elements" | "Communication";

export interface Section {
  slug: string;
  title: string;
  group: SectionGroup;
  /** One line on what the page covers. /llms.txt lists it after the link. */
  description: string;
}

export const sections: Section[] = [
  {
    slug: "",
    title: "Brand Guidelines",
    group: "Core Identity",
    description: "what the guidelines cover and how to use them",
  },
  {
    slug: "logo-marks",
    title: "Logo Marks",
    group: "Core Identity",
    description: "the six-lockup logo family, color and background variants, clearspace, and logo don'ts",
  },
  {
    slug: "colors",
    title: "Colors",
    group: "Core Identity",
    description: "primary and secondary palettes with HEX and CMYK values",
  },
  {
    slug: "typography",
    title: "Typography",
    group: "Core Identity",
    description: "the three typefaces, where each is used, and the weights available",
  },
  {
    slug: "assets",
    title: "Assets",
    group: "Brand Elements",
    description: "background imagery, the green overlay texture, and halftones, with usage guidance and downloads",
  },
  {
    slug: "application",
    title: "Application",
    group: "Brand Elements",
    description: "approved product screenshots (Ghost Mode, hole-by-hole outcomes, dispersion and putting charts, coach voice notes) with embed code and downloads",
  },
  {
    slug: "video",
    title: "Video",
    group: "Brand Elements",
    description: "the AVA Golf explainer video and its embed code",
  },
  {
    slug: "overview",
    title: "Overview",
    group: "Communication",
    description: "tagline, short and full descriptions and when to use each, what/how/why, and name use",
  },
  {
    slug: "values",
    title: "Values",
    group: "Communication",
    description: "precision, discipline, and calibration",
  },
  {
    slug: "pillars",
    title: "Pillars",
    group: "Communication",
    description: "data with direction, personalized progression, and mastery without guesswork",
  },
  {
    slug: "voice",
    title: "Voice",
    group: "Communication",
    description: "intelligent, confident, and grounded",
  },
  {
    slug: "audience",
    title: "Audience",
    group: "Communication",
    description: "the three golfer profiles AVA Golf is built for, and who it is not for",
  },
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

/** The page's path, with the trailing slash every internal link carries. */
export function sectionHref(s: Pick<Section, "slug">): string {
  return s.slug ? `/${s.slug}/` : "/";
}
