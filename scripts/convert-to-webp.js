/**
 * WebP + responsive görsel dönüştürücü
 * img/*.jpg → img/*-400.webp, img/*-800.webp, img/*-1200.webp
 * Kullanım: node scripts/convert-to-webp.js
 */
import sharp from "sharp";
import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG_DIR = join(__dirname, "..", "img");
const SIZES = [400, 800, 1200];

async function convertAll() {
  const files = await readdir(IMG_DIR);
  const jpgs = files.filter((f) => f.endsWith(".jpg") && f.startsWith("proje"));

  for (const file of jpgs) {
    const base = file.replace(".jpg", "");
    const inputPath = join(IMG_DIR, file);

    for (const w of SIZES) {
      const outputPath = join(IMG_DIR, `${base}-${w}.webp`);
      await sharp(inputPath)
        .resize({ width: w, fit: "inside" })
        .webp({ quality: 85 })
        .toFile(outputPath);
      console.log(`✓ ${base}-${w}.webp`);
    }
  }
  console.log(`\nTamamlandı: ${jpgs.length} görsel × ${SIZES.length} boyut = ${jpgs.length * SIZES.length} WebP dosyası`);
}

convertAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
