import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function copySite(fromDir, toDir) {
  mkdirSync(toDir, { recursive: true });
  cpSync(join(fromDir, "app"), join(toDir, "app"), { recursive: true });
  mkdirSync(join(toDir, "screenshots"), { recursive: true });
  if (existsSync(join(fromDir, "screenshots"))) {
    cpSync(join(fromDir, "screenshots"), join(toDir, "screenshots"), { recursive: true });
  }
}

function writeDossier(toDir) {
  const dossier = buildDossier(toDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  writeFileSync(join(toDir, "dossier.json"), dossier);
}

copySite(repoRoot, outDir);
writeDossier(outDir);
