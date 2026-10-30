const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc ^ byte) & 1 ? 0xedb88320 : 0);
      byte >>>= 1;
    }
  }
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const body = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crcBuf]);
}

function createPNG(w, h, getPixel) {
  const raw = Buffer.alloc(h * (1 + w * 4));
  let off = 0;
  for (let y = 0; y < h; y++) {
    raw[off++] = 0; // Filter 0
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = getPixel(x, y);
      raw[off++] = Math.min(255, Math.max(0, Math.round(r)));
      raw[off++] = Math.min(255, Math.max(0, Math.round(g)));
      raw[off++] = Math.min(255, Math.max(0, Math.round(b)));
      raw[off++] = Math.min(255, Math.max(0, Math.round(a)));
    }
  }
  const def = zlib.deflateSync(raw);
  const hdr = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  return Buffer.concat([hdr, chunk('IHDR', ihdr), chunk('IDAT', def), chunk('IEND', Buffer.alloc(0))]);
}

// Distance to rounded rectangle (squircle)
function dSquircle(x, y, cx, cy, rx, ry, r) {
  const dx = Math.max(Math.abs(x - cx) - rx + r, 0);
  const dy = Math.max(Math.abs(y - cy) - ry + r, 0);
  return Math.sqrt(dx * dx + dy * dy) - r;
}

function generateIcon(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.12 : size * 0.05;
  const badgeSize = size - padding * 2;
  const cornerRadius = badgeSize * 0.26;
  const cx = size / 2;
  const cy = size / 2;
  const rx = badgeSize / 2;
  const ry = badgeSize / 2;

  return createPNG(size, size, (x, y) => {
    // Check if inside squircle
    const dist = dSquircle(x, y, cx, cy, rx, ry, cornerRadius);
    if (dist > 0.5) {
      // Outside badge: transparent or maskable background
      return isMaskable ? [250, 248, 245, 255] : [0, 0, 0, 0];
    }

    // Inside badge background: Luxury Warm Ivory (#FAF8F5) with subtle vignette
    const nx = (x - cx) / rx;
    const ny = (y - cy) / ry;
    const vignette = 1 - 0.08 * (nx * nx + ny * ny);
    const bgR = 250 * vignette;
    const bgG = 248 * vignette;
    const bgB = 245 * vignette;

    // Architectural "M" Monogram & Classical Arch
    const scale = badgeSize * 0.72;
    const px = (x - cx) / (scale / 2);
    const py = (y - (cy + badgeSize * 0.04)) / (scale / 2);

    // Left and Right Vertical Columns
    const leftCol = px >= -0.75 && px <= -0.45 && py >= -0.75 && py <= 0.75;
    const rightCol = px >= 0.45 && px <= 0.75 && py >= -0.75 && py <= 0.75;
    
    // Diagonal Chevron beams to center
    const leftDiag = px >= -0.45 && px <= 0.05 && Math.abs(py - (px * 0.9 - 0.05)) < 0.16 && py <= 0.15;
    const rightDiag = px >= -0.05 && px <= 0.45 && Math.abs(py - (-px * 0.9 - 0.05)) < 0.16 && py <= 0.15;

    // Center Vault Pillar
    const centerVault = Math.abs(px) <= 0.12 && py >= 0.05 && py <= 0.65;

    // Vault Arch curve
    const archDist = Math.hypot(px, py - 0.25);
    const inArch = archDist >= 0.24 && archDist <= 0.38 && py <= 0.25;

    // Horizontal Pedestal Base
    const pedestal = Math.abs(px) <= 0.75 && py >= 0.68 && py <= 0.8;

    if (leftCol || rightCol) {
      // Terracotta columns with subtle vertical lighting (#AA4824)
      const grad = 0.5 + 0.5 * ny;
      return [170 * grad, 72 * grad, 36 * grad, 255];
    }

    if (leftDiag || rightDiag || inArch || pedestal) {
      // 24K Champagne Gold (#F59E0B)
      return [245, 158, 11, 255];
    }

    if (centerVault) {
      return [212, 83, 39, 255];
    }

    // Default badge surface
    return [bgR, bgG, bgB, 255];
  });
}

// Builds a multi-resolution Windows .ico file containing PNG data
function buildIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const dirEntries = [];
  for (let i = 0; i < count; i++) {
    const s = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(s >= 256 ? 0 : s, 0); // Width
    entry.writeUInt8(s >= 256 ? 0 : s, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buf.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset to image data
    dirEntries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

const publicDir = path.join(__dirname, '..', 'client-side', 'public');
console.log('Generating PWA and Favicon icons in:', publicDir);

const icon16 = generateIcon(16, false);
fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), icon16);
console.log('✓ favicon-16x16.png created');

const icon32 = generateIcon(32, false);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), icon32);
console.log('✓ favicon-32x32.png created');

const icon48 = generateIcon(48, false);
fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), icon48);
console.log('✓ favicon-48x48.png created');

const icon192 = generateIcon(192, false);
fs.writeFileSync(path.join(publicDir, 'favicon-192.png'), icon192);
console.log('✓ favicon-192.png created');

const icon512 = generateIcon(512, false);
fs.writeFileSync(path.join(publicDir, 'favicon-512.png'), icon512);
console.log('✓ favicon-512.png created');

const iconMaskable = generateIcon(512, true);
fs.writeFileSync(path.join(publicDir, 'maskable-icon-512.png'), iconMaskable);
console.log('✓ maskable-icon-512.png created');

const appleTouch = generateIcon(180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);
console.log('✓ apple-touch-icon.png created');

// Multi-resolution ICO file
const icoBuffer = buildIco([icon16, icon32, icon48], [16, 32, 48]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
console.log('✓ favicon.ico created (multi-resolution 16x16, 32x32, 48x48)');
