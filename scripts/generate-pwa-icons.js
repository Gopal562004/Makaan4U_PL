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
  const halfBadge = badgeSize / 2;

  return createPNG(size, size, (x, y) => {
    // Background canvas
    const distToBorder = dSquircle(x, y, cx, cy, halfBadge, halfBadge, cornerRadius);

    if (distToBorder > 1) {
      if (isMaskable) {
        // Safe maskable full background
        return [250, 241, 228, 255]; // Warm pearl ivory
      }
      return [0, 0, 0, 0]; // Transparent outer
    }

    // Anti-aliased outer edge
    const edgeAlpha = distToBorder > 0 ? 1 - distToBorder : 1;

    // Outer border (Gold/Bronze gradient)
    const borderWidth = size * 0.035;
    if (distToBorder > -borderWidth) {
      const t = (x + y) / (size * 2);
      // Gold to Terracotta border
      const r = 245 * (1 - t) + 212 * t;
      const g = 158 * (1 - t) + 83 * t;
      const b = 11 * (1 - t) + 39 * t;
      return [r, g, b, 255 * edgeAlpha];
    }

    // Inside badge: Pearl ivory radiant gradient
    const ny = (y - (cy - halfBadge)) / badgeSize;
    const nx = (x - (cx - halfBadge)) / badgeSize;
    const bgR = 255 - ny * 8;
    const bgG = 253 - ny * 15;
    const bgB = 248 - ny * 24;

    // Architectural Monogram Rendering (M + Vault + Gold Star)
    // Normalized coords relative to center (-1 to +1)
    const px = (x - cx) / (halfBadge * 0.75);
    const py = (y - cy) / (halfBadge * 0.75);

    // 1. Crown Polaris Compass Star at top (center at px=0, py=-0.62)
    const starDist = Math.hypot(px, py + 0.62);
    if (starDist < 0.28) {
      const angle = Math.atan2(py + 0.62, px);
      const modAngle = Math.abs(Math.cos(angle * 4));
      const starRay = 0.06 + 0.22 * Math.pow(modAngle, 6);
      if (starDist < starRay) {
        // Bright gold star
        const core = starDist < 0.06;
        if (core) return [255, 255, 255, 255];
        return [245, 158, 11, 255];
      }
    }

    // 2. Terracotta Monogram Columns (Left: px=-0.6 to -0.3, Right: px=0.3 to 0.6)
    const leftCol = px >= -0.62 && px <= -0.32 && py >= -0.35 && py <= 0.65;
    const rightCol = px >= 0.32 && px <= 0.62 && py >= -0.35 && py <= 0.65;
    
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
      // Terracotta columns with subtle vertical lighting
      const grad = 0.5 + 0.5 * ny;
      return [170 * grad, 72 * grad, 36 * grad, 255];
    }

    if (leftDiag || rightDiag || inArch || pedestal) {
      // 24K Champagne Gold
      return [245, 158, 11, 255];
    }

    if (centerVault) {
      return [212, 83, 39, 255];
    }

    // Default badge surface
    return [bgR, bgG, bgB, 255];
  });
}

const publicDir = path.join(__dirname, '..', 'client-side', 'public');

console.log('Generating PWA icons in:', publicDir);

const icon192 = generateIcon(192, false);
fs.writeFileSync(path.join(publicDir, 'favicon-192.png'), icon192);
console.log('✓ favicon-192.png created (192x192)');

const icon512 = generateIcon(512, false);
fs.writeFileSync(path.join(publicDir, 'favicon-512.png'), icon512);
console.log('✓ favicon-512.png created (512x512)');

const iconMaskable = generateIcon(512, true);
fs.writeFileSync(path.join(publicDir, 'maskable-icon-512.png'), iconMaskable);
console.log('✓ maskable-icon-512.png created (512x512 maskable)');

const appleTouch = generateIcon(180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);
console.log('✓ apple-touch-icon.png created (180x180)');
