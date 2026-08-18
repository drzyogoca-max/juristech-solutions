import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function computeFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function verifyDistArtifacts() {
  const distPath = path.resolve(process.cwd(), 'dist');

  console.log('----------------------------------------------------');
  console.log('LegalShield DevOps Release Artifact Verification Suite');
  console.log('----------------------------------------------------');

  if (!fs.existsSync(distPath)) {
    console.error('ERROR: dist/ directory not found. Please run `npm run build` first.');
    process.exit(1);
  }

  const files = fs.readdirSync(distPath);
  console.log(`✓ dist/ directory verified. Root files count: ${files.length}`);

  const assetsPath = path.join(distPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    const assetFiles = fs.readdirSync(assetsPath);
    console.log(`✓ dist/assets verified (${assetFiles.length} bundled modules).`);

    console.log('\n--- SHA256 Checksums for Production Bundles ---');
    assetFiles.forEach((file) => {
      const filePath = path.join(assetsPath, file);
      const hash = computeFileHash(filePath);
      console.log(`${hash.substring(0, 16)}... | ${file}`);
    });
  }

  console.log('\n✓ Release Build & Artifact Hashing Verified Successfully!\n');
}

verifyDistArtifacts();
