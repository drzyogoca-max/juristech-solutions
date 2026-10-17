import sharp from 'sharp';
import fs from 'fs';

async function test() {
  const bg = await sharp({
    create: { width: 720, height: 1280, channels: 4, background: { r: 2, g: 11, b: 26, alpha: 1 } }
  }).png().toBuffer();

  const avatar = await sharp('public/avatars/global_ceo.jpg')
    .resize(240, 240, { fit: 'cover' })
    .png()
    .toBuffer();

  const svgOverlay = Buffer.from(
    '<svg width="720" height="1280" xmlns="http://www.w3.org/2000/svg">' +
    '<text x="360" y="420" font-family="Arial" font-size="32" font-weight="bold" fill="#D4AF37" text-anchor="middle">David Vance (CEO)</text>' +
    '</svg>'
  );

  const result = await sharp(bg)
    .composite([
      { input: avatar, top: 120, left: 240 },
      { input: svgOverlay, top: 0, left: 0 }
    ])
    .png()
    .toBuffer();

  console.log('Successfully composited avatar slide, bytes:', result.length);
}

test().catch(console.error);
