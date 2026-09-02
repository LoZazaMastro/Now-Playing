import { readFile, writeFile } from "node:fs/promises";

const bundlePath = new URL("../dist/index.js", import.meta.url);
const source = await readFile(bundlePath, "utf8");
const cleaned = source.replace(/\r?\n\/\/# sourceMappingURL=index\.js\.map\s*$/, "\n");

if (cleaned !== source) {
  await writeFile(bundlePath, cleaned, "utf8");
}
