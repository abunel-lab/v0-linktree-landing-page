import { createServer } from "http";
import { readFile, stat } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = join(__dirname, "dist/public");
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

const server = createServer(async (req, res) => {
  let urlPath = req.url.split("?")[0];

  const tryFile = async (filePath) => {
    try {
      const s = await stat(filePath);
      if (s.isFile()) {
        const ext = extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || "application/octet-stream";
        const data = await readFile(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
        return true;
      }
    } catch {}
    return false;
  };

  if (await tryFile(join(distDir, urlPath))) return;
  if (await tryFile(join(distDir, urlPath, "index.html"))) return;

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
