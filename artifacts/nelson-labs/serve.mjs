import { createServer } from "http";
import { readFile, stat } from "fs/promises";
import { join, extname, resolve, normalize } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = resolve(join(__dirname, "dist/public"));
const port = process.env.PORT || 3000;

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".json": "application/json",
};

const safeJoin = (base, urlPath) => {
  const safe = normalize("/" + urlPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const resolved = resolve(join(base, safe));
  if (!resolved.startsWith(base + "/") && resolved !== base) return null;
  return resolved;
};

const server = createServer(async (req, res) => {
  const urlPath = req.url.split("?")[0];

  const tryFile = async (filePath) => {
    if (!filePath) return false;
    try {
      const s = await stat(filePath);
      if (s.isFile()) {
        const ext = extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || "application/octet-stream";
        const data = await readFile(filePath);
        res.writeHead(200, {
          "Content-Type": contentType,
          "X-Content-Type-Options": "nosniff",
        });
        res.end(data);
        return true;
      }
    } catch {}
    return false;
  };

  if (await tryFile(safeJoin(distDir, urlPath))) return;
  if (await tryFile(safeJoin(distDir, urlPath + "/index.html"))) return;

  // SPA fallback
  try {
    const data = await readFile(join(distDir, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
