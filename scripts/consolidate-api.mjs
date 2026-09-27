import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const apiDir = path.join(rootDir, 'api');
const serverDir = path.join(rootDir, 'server');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(serverDir);

// 1. Move subdirectories to server/
const subdirs = ['ai', 'contracts', 'cron', 'erp', 'forensic', 'leads', 'partnerships', 'webhooks'];
for (const sub of subdirs) {
  const src = path.join(apiDir, sub);
  const dest = path.join(serverDir, sub);
  if (fs.existsSync(src)) {
    ensureDir(dest);
    const files = fs.readdirSync(src);
    for (const f of files) {
      fs.copyFileSync(path.join(src, f), path.join(dest, f));
      fs.unlinkSync(path.join(src, f));
    }
    fs.rmdirSync(src);
    console.log(`Moved api/${sub} -> server/${sub}`);
  }
}

// 2. Remove api/chat/route.js and api/chat dir
const apiChatSub = path.join(apiDir, 'chat');
if (fs.existsSync(apiChatSub)) {
  const routeFile = path.join(apiChatSub, 'route.js');
  if (fs.existsSync(routeFile)) fs.unlinkSync(routeFile);
  fs.rmdirSync(apiChatSub);
  console.log('Removed api/chat/route.js');
}

// 3. Remove api/send.js alias
const apiSend = path.join(apiDir, 'send.js');
if (fs.existsSync(apiSend)) {
  fs.unlinkSync(apiSend);
  console.log('Removed api/send.js alias');
}

// 4. Move video helper files to server/video/
const videoDir = path.join(serverDir, 'video');
ensureDir(videoDir);
const videoFiles = ['heygen-generate.js', 'heygen-webhook.js', 'video-generate.js', 'youtube-upload.js'];
for (const vf of videoFiles) {
  const src = path.join(apiDir, vf);
  const dest = path.join(videoDir, vf);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    fs.unlinkSync(src);
    console.log(`Moved api/${vf} -> server/video/${vf}`);
  }
}

console.log('API directory consolidation complete.');
