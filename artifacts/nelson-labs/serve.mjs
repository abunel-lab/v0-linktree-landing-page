import { createServer } from "http";
import { createReadStream, existsSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "dist/public");
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
};

const server = createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  let filePath = join(DIST, urlPath === "/" ? "index.html" : urlPath);

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(DIST, "index.html");
  }

  const mime = MIME[extname(filePath)] ?? "application/octet-stream";
  const isHtml = extname(filePath) === ".html";

  res.setHeader("Content-Type", mime);
  res.setHeader(
    "Cache-Control",
    isHtml ? "no-cache" : "public, max-age=31536000, immutable"
  );

  createReadStream(filePath)
    .on("error", () => {
      res.writeHead(404);
      res.end("Not found");
    })
    .pipe(res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Nelson Labs running on port ${PORT}`);
});
