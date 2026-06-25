import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

/**
 * Armazenamento local de arquivos (dev). Em produção, trocar por um bucket
 * (S3/Supabase). Os arquivos ficam em <projeto>/storage/<subdir>.
 */
const ROOT = () => path.join(process.cwd(), "storage");

export type SavedFile = { key: string; name: string; type: string; size: number };

export async function saveUpload(
  file: FormDataEntryValue | null,
  subdir: string,
  prefix: string
): Promise<SavedFile | null> {
  if (!file || typeof file === "string") return null;
  const f = file as File;
  if (!f.size) return null;

  try {
    const dir = path.join(ROOT(), subdir);
    await mkdir(dir, { recursive: true });
    const safe = f.name.replace(/[^\w.\-]/g, "_");
    const rel = `${subdir}/${prefix}-${Date.now()}-${safe}`;
    await writeFile(path.join(ROOT(), rel), Buffer.from(await f.arrayBuffer()));
    return { key: rel, name: f.name, type: f.type || "application/octet-stream", size: f.size };
  } catch {
    // Em hospedagem serverless o disco é somente-leitura. Falha de forma segura
    // até conectarmos um armazenamento em nuvem (ex.: Vercel Blob).
    return null;
  }
}

export async function readStoredFile(key: string): Promise<Buffer> {
  const full = path.join(ROOT(), key);
  const root = ROOT();
  if (!full.startsWith(root)) throw new Error("Caminho inválido.");
  return readFile(full);
}
