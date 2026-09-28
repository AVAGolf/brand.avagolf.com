// Intrinsic sizes of files in public/, read at build time, so every <img> can
// carry width and height and the page doesn't move as images arrive.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

export interface Size {
  width: number;
  height: number;
}

const file = (publicPath: string) => join(process.cwd(), "public", publicPath);

/** An SVG's size from its viewBox (or its width/height attributes). */
export function svgSize(publicPath: string): Size {
  const svg = readFileSync(file(publicPath), "utf8");
  const tag = svg.match(/<svg\b[^>]*>/i)?.[0] ?? "";
  const viewBox = tag.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/i);
  if (viewBox) return { width: Math.round(Number(viewBox[1])), height: Math.round(Number(viewBox[2])) };
  const width = tag.match(/\bwidth="([\d.]+)(px)?"/i);
  const height = tag.match(/\bheight="([\d.]+)(px)?"/i);
  if (width && height) return { width: Math.round(Number(width[1])), height: Math.round(Number(height[1])) };
  throw new Error(`${publicPath} has no viewBox or width/height`);
}

const rasters = new Map<string, Promise<Size>>();

/** A JPEG, PNG or WebP's size. For an animated WebP, one frame's. */
export function rasterSize(publicPath: string): Promise<Size> {
  let size = rasters.get(publicPath);
  if (!size) {
    size = sharp(file(publicPath))
      .metadata()
      .then((m) => {
        if (!m.width || !m.height) throw new Error(`${publicPath}: no dimensions`);
        return { width: m.width, height: m.pageHeight ?? m.height };
      });
    rasters.set(publicPath, size);
  }
  return size;
}
