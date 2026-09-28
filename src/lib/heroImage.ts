// The page header's backdrop (src/assets/hero-noise-green.jpg): a 2400px,
// 545 KB grain-on-gradient JPEG that is the LCP element on every guideline
// page. The build writes WebP copies at five widths (1 KB at 640px, 60 KB at
// 2400px); quality 70 is the lowest that keeps the grain from turning into
// blotches. BrandHeader renders it and BrandLayout preloads the same srcset,
// so the browser fetches exactly one candidate, once, at high priority.
import { getImage } from "astro:assets";
import heroNoise from "../assets/hero-noise-green.jpg";

/** The header spans the content column: the viewport minus the 260px
 *  sidebar from the `sidebar` breakpoint (901px) up, the full width below. */
export const HERO_SIZES = "(min-width: 56.3125rem) calc(100vw - 260px), 100vw";

export async function heroImage() {
  const image = await getImage({
    src: heroNoise,
    widths: [640, 960, 1280, 1920, 2400],
    format: "webp",
    quality: 70,
  });
  return {
    src: image.src,
    srcset: image.srcSet.attribute,
    sizes: HERO_SIZES,
    width: heroNoise.width,
    height: heroNoise.height,
  };
}
