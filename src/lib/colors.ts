// Single source of truth for brand color values — mirrors the Figma paint
// styles and the CSS custom properties defined in src/styles/global.css.
// colors.astro and tokens.astro both read from this instead of hardcoding hex.

export interface ColorToken {
  name: string;
  hex: string;
  cmyk?: string;
  text: string;
}

export interface GradientToken {
  name: string;
  from: string;
  to: string;
  text: string;
}

export const greens: ColorToken[] = [
  { name: "green-300", hex: "#95CBC1", cmyk: "41 4 27 0", text: "text-dark-green-900" },
  { name: "green-500", hex: "#349683", cmyk: "77 21 56 3", text: "text-white" },
  { name: "green-700", hex: "#225142", cmyk: "83 45 72 40", text: "text-white" },
  { name: "green-900", hex: "#16382E", cmyk: "84 52 72 59", text: "text-white" },
];

export const yellows: ColorToken[] = [
  { name: "yellow-300", hex: "#FFFF4A", cmyk: "5 0 80 0", text: "text-dark-green-900" },
  { name: "yellow-500", hex: "#FFE708", cmyk: "2 4 100 0", text: "text-dark-green-900" },
];

export const neutrals: ColorToken[] = [
  { name: "white", hex: "#FFFFFF", cmyk: "0 0 0 0", text: "text-dark-green-900" },
  { name: "grey-300", hex: "#F4F4F2", cmyk: "3 2 3 0", text: "text-dark-green-900" },
];

export const brightGreen: ColorToken[] = [
  { name: "bright-green-500", hex: "#17DEB7", cmyk: "60 0 40 0", text: "text-dark-green-900" },
];

export const darkGreens: ColorToken[] = [
  { name: "dark-green-300", hex: "#132A23", cmyk: "80 60 70 70", text: "text-white" },
  { name: "dark-green-500", hex: "#10211C", cmyk: "80 60 70 75", text: "text-white" },
  { name: "dark-green-700", hex: "#0B1C16", cmyk: "80 60 70 80", text: "text-white" },
  { name: "dark-green-900", hex: "#070E0C", cmyk: "75 65 70 85", text: "text-white" },
];

export const reds: ColorToken[] = [
  { name: "red-50", hex: "#FCF4F5", text: "text-dark-green-900" },
  { name: "red-100", hex: "#F9EAEB", text: "text-dark-green-900" },
  { name: "red-200", hex: "#EFCACC", text: "text-dark-green-900" },
  { name: "red-300", hex: "#E5ABAE", text: "text-dark-green-900" },
  { name: "red-400", hex: "#D26B71", text: "text-white" },
  { name: "red-500", hex: "#BF2C34", text: "text-white" },
  { name: "red-600", hex: "#AC282F", text: "text-white" },
  { name: "red-700", hex: "#731A1F", text: "text-white" },
  { name: "red-800", hex: "#561417", text: "text-white" },
  { name: "red-900", hex: "#390D10", text: "text-white" },
];

export const gradients: GradientToken[] = [
  { name: "green-fade", from: "#349683", to: "#16382E", text: "text-white" },
  { name: "dark-green-fade", from: "#16382E", to: "#070E0C", text: "text-white" },
  { name: "yellow-fade", from: "#FFFF4A", to: "#FFE708", text: "text-dark-green-900" },
];

export const allColors: ColorToken[] = [
  ...greens,
  ...darkGreens,
  ...yellows,
  ...brightGreen,
  ...neutrals,
];
