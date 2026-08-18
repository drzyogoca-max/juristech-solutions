import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('./public');
const files = fs.readdirSync(publicDir);

async function optimize() {
  console.log('🚀 Starting sharp image compression & WebP generation...');
  let totalSaved = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(publicDir, file);
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const stats = fs.statSync(filePath);
    const initialSize = stats.size;

    const buffer = fs.readFileSync(filePath);
    
    // Create optimized WebP version
    const webpName = file.replace(ext, '.webp');
    const webpPath = path.join(publicDir, webpName);
    await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(webpPath);
    
    const webpStats = fs.statSync(webpPath);
    console.log(`✅ Created ${webpName}: ${(webpStats.size / 1024).toFixed(1)} KB (down from ${(initialSize / 1024).toFixed(1)} KB)`);

    // Also compress the original file in place
    if (ext === '.png') {
      const optimizedPng = await sharp(buffer)
        .resize({ width: 400, withoutEnlargement: true })
        .png({ compressionLevel: 9, quality: 75 })
        .toBuffer();
      fs.writeFileSync(filePath, optimizedPng);
      totalSaved += (initialSize - optimizedPng.length);
      console.log(`✅ Compressed ${file}: ${(optimizedPng.length / 1024).toFixed(1)} KB`);
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      const optimizedJpg = await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 75, mozjpeg: true })
        .toBuffer();
      fs.writeFileSync(filePath, optimizedJpg);
      totalSaved += (initialSize - optimizedJpg.length);
      console.log(`✅ Compressed ${file}: ${(optimizedJpg.length / 1024).toFixed(1)} KB`);
    }
  }

  console.log(`🎉 Total saved: ${(totalSaved / 1024).toFixed(1)} KB!`);
}

optimize().catch(console.error);
