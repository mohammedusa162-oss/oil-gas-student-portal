'use strict';

/*
 * يولّد أيقونات Android (تقليدية + تكيفية) وشاشات البداية وأصول المتجر
 * بهوية التطبيق: خلفية داكنة #0d1117 + قطرة نفط ذهبية #f5b301 وعلامة تحقّق.
 *
 * التشغيل: node scripts/make-android-icons.cjs
 */

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const ROOT = path.join(__dirname, '..');
const RES = path.join(ROOT, 'android', 'app', 'src', 'main', 'res');
const STORE = path.join(ROOT, 'store-assets');

const NAVY = [13, 17, 23, 255]; // #0d1117 خلفية التطبيق
const AMBER = [245, 179, 1, 255]; // #f5b301 اللون الأساسي
const CYAN = [56, 189, 248, 255]; // #38bdf8 اللون الثانوي
const WHITE = [255, 255, 255, 255];
const PAPER = [13, 17, 23, 255]; // خلفية شاشة البداية الداكنة

/* ---------- لوحة رسم بسيطة ---------- */

function makeCanvas(width, height) {
  return { width, height, data: new Uint8ClampedArray(width * height * 4) };
}

function setPixel(canvas, x, y, color) {
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
  const i = (y * canvas.width + x) * 4;
  const a = color[3] === undefined ? 255 : color[3];
  if (a === 0) return;
  if (a === 255) {
    canvas.data[i] = color[0];
    canvas.data[i + 1] = color[1];
    canvas.data[i + 2] = color[2];
    canvas.data[i + 3] = 255;
    return;
  }
  const sr = a / 255;
  const dr = canvas.data[i + 3] / 255;
  const outA = sr + dr * (1 - sr);
  if (outA === 0) return;
  canvas.data[i] = Math.round((color[0] * sr + canvas.data[i] * dr * (1 - sr)) / outA);
  canvas.data[i + 1] = Math.round((color[1] * sr + canvas.data[i + 1] * dr * (1 - sr)) / outA);
  canvas.data[i + 2] = Math.round((color[2] * sr + canvas.data[i + 2] * dr * (1 - sr)) / outA);
  canvas.data[i + 3] = Math.round(outA * 255);
}

function fillRect(canvas, x, y, w, h, color) {
  for (let yy = Math.max(0, Math.floor(y)); yy < Math.min(canvas.height, Math.ceil(y + h)); yy++) {
    for (let xx = Math.max(0, Math.floor(x)); xx < Math.min(canvas.width, Math.ceil(x + w)); xx++) {
      setPixel(canvas, xx, yy, color);
    }
  }
}

function fillCircle(canvas, cx, cy, radius, color) {
  const r2 = radius * radius;
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) setPixel(canvas, x, y, color);
    }
  }
}

function fillRoundedRect(canvas, x, y, w, h, radius, color) {
  for (let yy = Math.floor(y); yy < Math.ceil(y + h); yy++) {
    for (let xx = Math.floor(x); xx < Math.ceil(x + w); xx++) {
      const dx = Math.max(x + radius - xx, 0, xx - (x + w - radius));
      const dy = Math.max(y + radius - yy, 0, yy - (y + h - radius));
      if (dx * dx + dy * dy <= radius * radius) setPixel(canvas, xx, yy, color);
    }
  }
}

function drawLine(canvas, x1, y1, x2, y2, thickness, color) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    fillCircle(canvas, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, thickness / 2, color);
  }
}

function drawTriangle(canvas, ax, ay, bx, by, cx, cy, color) {
  const minX = Math.floor(Math.min(ax, bx, cx));
  const maxX = Math.ceil(Math.max(ax, bx, cx));
  const minY = Math.floor(Math.min(ay, by, cy));
  const maxY = Math.ceil(Math.max(ay, by, cy));
  const sign = (px, py, qx, qy, rx, ry) => (px - rx) * (qy - ry) - (qx - rx) * (py - ry);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const d1 = sign(x, y, ax, ay, bx, by);
      const d2 = sign(x, y, bx, by, cx, cy);
      const d3 = sign(x, y, cx, cy, ax, ay);
      const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
      const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
      if (!(hasNeg && hasPos)) setPixel(canvas, x, y, color);
    }
  }
}

function downsample(canvas, targetW, targetH) {
  const tw = targetW || targetH;
  const th = targetH || targetW;
  const out = makeCanvas(tw, th);
  const rx = canvas.width / tw;
  const ry = canvas.height / th;
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      const startX = Math.floor(x * rx);
      const startY = Math.floor(y * ry);
      const endX = Math.min(canvas.width, Math.ceil((x + 1) * rx));
      const endY = Math.min(canvas.height, Math.ceil((y + 1) * ry));
      for (let yy = startY; yy < endY; yy++) {
        for (let xx = startX; xx < endX; xx++) {
          const i = (yy * canvas.width + xx) * 4;
          r += canvas.data[i];
          g += canvas.data[i + 1];
          b += canvas.data[i + 2];
          a += canvas.data[i + 3];
          count++;
        }
      }
      const i = (y * tw + x) * 4;
      out.data[i] = Math.round(r / count);
      out.data[i + 1] = Math.round(g / count);
      out.data[i + 2] = Math.round(b / count);
      out.data[i + 3] = Math.round(a / count);
    }
  }
  return out;
}

/* ---------- ترميز PNG (بلا مكتبات خارجية) ---------- */

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePng(canvas) {
  const raw = Buffer.alloc((canvas.width * 4 + 1) * canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    const rowStart = y * (canvas.width * 4 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < canvas.width; x++) {
      const src = (y * canvas.width + x) * 4;
      const dst = rowStart + 1 + x * 4;
      raw[dst] = canvas.data[src];
      raw[dst + 1] = canvas.data[src + 1];
      raw[dst + 2] = canvas.data[src + 2];
      raw[dst + 3] = canvas.data[src + 3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(canvas.width, 0);
  ihdr.writeUInt32BE(canvas.height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------- رسم الهوية ---------- */

const MASTER = 1024;

// يرسم الطبقات الجيولوجية + السهم داخل مربع [x0,y0,w,h] على لوحة رئيسية 1024.
function drawMark(canvas, box) {
  const { x, y, w, h } = box;
  const sx = (v) => x + (v / MASTER) * w;
  const sy = (v) => y + (v / MASTER) * h;
  const sw = (v) => (v / MASTER) * w;
  const sh = (v) => (v / MASTER) * h;

  // قطرة نفط ذهبية + علامة تحقّق بخلفية التطبيق (إنجاز الطالب).
  fillCircle(canvas, sx(512), sy(600), sw(200), AMBER);
  drawTriangle(canvas, sx(512), sy(262), sx(410), sy(540), sx(614), sy(540), AMBER);
  drawLine(canvas, sx(436), sy(600), sx(492), sy(664), sw(54), NAVY);
  drawLine(canvas, sx(492), sy(664), sx(594), sy(520), sw(54), NAVY);
}

function iconCanvas(mask) {
  const canvas = makeCanvas(MASTER, MASTER);
  const radius = mask === 'square' ? 0 : mask === 'round' ? MASTER / 2 : MASTER * 0.2;
  if (mask === 'round') {
    fillCircle(canvas, MASTER / 2, MASTER / 2, MASTER / 2, NAVY);
  } else if (radius > 0) {
    fillRoundedRect(canvas, 0, 0, MASTER, MASTER, radius, NAVY);
  } else {
    fillRect(canvas, 0, 0, MASTER, MASTER, NAVY);
  }
  drawMark(canvas, { x: 0, y: 0, w: MASTER, h: MASTER });
  if (mask === 'round') {
    // قصّ الزوايا: ارسم خارج الدائرة شفافاً
    for (let y = 0; y < MASTER; y++) {
      for (let x = 0; x < MASTER; x++) {
        const dx = x - MASTER / 2;
        const dy = y - MASTER / 2;
        if (dx * dx + dy * dy > (MASTER / 2) * (MASTER / 2)) {
          const i = (y * MASTER + x) * 4;
          canvas.data[i] = 0;
          canvas.data[i + 1] = 0;
          canvas.data[i + 2] = 0;
          canvas.data[i + 3] = 0;
        }
      }
    }
  }
  return canvas;
}

// الطبقة الأمامية للأيقونة التكيفية: شفافة، والرسم داخل 66% الوسطى (المنطقة الآمنة).
function adaptiveForeground() {
  const canvas = makeCanvas(MASTER, MASTER);
  const inset = MASTER * 0.17;
  drawMark(canvas, { x: inset, y: inset, w: MASTER - inset * 2, h: MASTER - inset * 2 });
  return canvas;
}

function splashCanvas(w, h) {
  const canvas = makeCanvas(w, h);
  fillRect(canvas, 0, 0, w, h, PAPER);
  const size = Math.round(Math.min(w, h) * 0.3);
  const logo = downsample(iconCanvas('square-round'), size, size);
  const ox = Math.round((w - size) / 2);
  const oy = Math.round((h - size) / 2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const a = logo.data[i + 3];
      if (!a) continue;
      setPixel(canvas, ox + x, oy + y, [logo.data[i], logo.data[i + 1], logo.data[i + 2], a]);
    }
  }
  return canvas;
}

function featureGraphic(w, h) {
  const canvas = makeCanvas(w, h);
  // تدرّج كحلي خفيف
  for (let y = 0; y < h; y++) {
    const t = y / h;
    const c = [
      Math.round(13 + 18 * t),
      Math.round(17 + 26 * t),
      Math.round(23 + 34 * t),
      255,
    ];
    fillRect(canvas, 0, y, w, 1, c);
  }
  const size = Math.round(h * 0.78);
  const logo = downsample(iconCanvas('square-round'), size, size);
  const ox = Math.round(w / 2 - size / 2);
  const oy = Math.round(h / 2 - size / 2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const a = logo.data[i + 3];
      if (!a) continue;
      setPixel(canvas, ox + x, oy + y, [logo.data[i], logo.data[i + 1], logo.data[i + 2], a]);
    }
  }
  return canvas;
}

/* ---------- الكتابة إلى مشروع Android ---------- */

const DENSITIES = [
  { dir: 'mipmap-mdpi', legacy: 48, adaptive: 108 },
  { dir: 'mipmap-hdpi', legacy: 72, adaptive: 162 },
  { dir: 'mipmap-xhdpi', legacy: 96, adaptive: 216 },
  { dir: 'mipmap-xxhdpi', legacy: 144, adaptive: 324 },
  { dir: 'mipmap-xxxhdpi', legacy: 192, adaptive: 432 },
];

const SPLASHES = [
  { dir: 'drawable-port-mdpi', w: 320, h: 480 },
  { dir: 'drawable-port-hdpi', w: 480, h: 800 },
  { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
  { dir: 'drawable-port-xxhdpi', w: 960, h: 1600 },
  { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
  { dir: 'drawable-land-mdpi', w: 480, h: 320 },
  { dir: 'drawable-land-hdpi', w: 800, h: 480 },
  { dir: 'drawable-land-xhdpi', w: 1280, h: 720 },
  { dir: 'drawable-land-xxhdpi', w: 1600, h: 960 },
  { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
  { dir: 'drawable', w: 1024, h: 1024 },
];

function write(filePath, buffer) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  return buffer.length;
}

const rounded = iconCanvas('square');
const round = iconCanvas('round');
const foreground = adaptiveForeground();

let written = 0;
for (const d of DENSITIES) {
  written += write(
    path.join(RES, d.dir, 'ic_launcher.png'),
    encodePng(downsample(rounded, d.legacy)),
  );
  written += write(
    path.join(RES, d.dir, 'ic_launcher_round.png'),
    encodePng(downsample(round, d.legacy)),
  );
  written += write(
    path.join(RES, d.dir, 'ic_launcher_foreground.png'),
    encodePng(downsample(foreground, d.adaptive)),
  );
}

for (const s of SPLASHES) {
  written += write(path.join(RES, s.dir, 'splash.png'), encodePng(splashCanvas(s.w, s.h)));
}

// أصول المتجر: أيقونة 512 مربعة كاملة بلا زوايا شفافة (شرط Google Play)
const storeIcon = downsample(iconCanvas('square'), 512);
written += write(path.join(STORE, 'icon-512.png'), encodePng(storeIcon));
written += write(
  path.join(STORE, 'feature-graphic-1024x500.png'),
  encodePng(featureGraphic(1024, 500)),
);

// أيقونات PWA لملف manifest — تثبيت التطبيق من المتصفح على الهاتف دون حساب Google
const PWA_DIR = path.join(ROOT, 'client', 'public');
written += write(path.join(PWA_DIR, 'icon-192.png'), encodePng(downsample(rounded, 192)));
written += write(path.join(PWA_DIR, 'icon-512.png'), encodePng(downsample(rounded, 512)));
// أيقونة قناع: خلفية ملء المربع والرسم داخل المنطقة الآمنة.
written += write(path.join(PWA_DIR, 'icon-maskable-512.png'), encodePng(downsample(iconCanvas('square'), 512)));

console.log('كُتبت ' + written + ' بايت من الأصول إلى ' + RES + ' و' + STORE + ' و' + PWA_DIR);
