import type { ThemedToken } from "shiki";
import type { ParsedDiffFile } from "./diffParser";

export type HighlightedDiff = Map<number, ThemedToken[]>;

// Extensions which differ from Shiki's language IDs or aliases.
const extensions: Record<string, string> = {
  js: "javascript", mjs: "javascript", cjs: "javascript",
  ts: "typescript", mts: "typescript", cts: "typescript",
  pyw: "python", pyi: "python", rb: "ruby", rake: "ruby",
  rs: "rust", cs: "csharp", fs: "fsharp", fsx: "fsharp",
  h: "c", cc: "cpp", cxx: "cpp", hpp: "cpp", hxx: "cpp",
  m: "objective-c", mm: "objective-cpp", kt: "kotlin", kts: "kotlin",
  ex: "elixir", exs: "elixir", erl: "erlang", hrl: "erlang",
  hs: "haskell", lhs: "haskell", ml: "ocaml", mli: "ocaml",
  clj: "clojure", cljs: "clojure", cljc: "clojure", edn: "clojure",
  sh: "shellscript", bash: "shellscript", zsh: "shellscript", fish: "fish",
  ps1: "powershell", psm1: "powershell", psd1: "powershell",
  bat: "bat", cmd: "bat", yml: "yaml", jsonc: "jsonc", json5: "json5",
  htm: "html", xhtml: "html", svg: "xml", xsl: "xml", xsd: "xml",
  md: "markdown", mdx: "mdx", rst: "rst", tex: "latex",
  sc: "scala", pl: "perl", pm: "perl", r: "r", rmd: "r",
  tf: "terraform", tfvars: "terraform", proto: "proto",
  gql: "graphql", psql: "sql", sqlite: "sql",
  conf: "ini", cfg: "ini", properties: "properties", env: "dotenv",
  vb: "vb", vbs: "vb", asm: "asm", s: "asm", v: "verilog", sv: "system-verilog",
};

const filenames: Record<string, string> = {
  dockerfile: "dockerfile", containerfile: "dockerfile",
  makefile: "makefile", gnumakefile: "makefile", gemfile: "ruby",
  rakefile: "ruby", vagrantfile: "ruby", jenkinsfile: "groovy",
  ".bashrc": "shellscript", ".zshrc": "shellscript", ".profile": "shellscript",
  ".gitignore": "gitignore", ".gitattributes": "git-attributes",
  ".env": "dotenv", ".npmrc": "ini", ".editorconfig": "ini",
};

export function languageForPath(path: string): string | undefined {
  const name = path.replaceAll("\\", "/").split("/").pop()?.toLowerCase() ?? "";
  if (filenames[name]) return filenames[name];
  if (name.startsWith(".env.")) return "dotenv";
  if (name.startsWith("dockerfile.")) return "dockerfile";
  const extension = name.includes(".") ? name.split(".").pop()! : "";
  return extensions[extension] ?? (extension || undefined);
}

// Loaded only when a diff is displayed. Grammars are fetched on demand, and the
// shared instance retains them when moving between files or investigations.
let highlighterPromise: ReturnType<typeof createHighlighter> | undefined;
async function createHighlighter() {
  const [{ createHighlighterCore }, { createOnigurumaEngine }, { default: theme }] =
    await Promise.all([
      import("shiki/core"),
      import("shiki/engine/oniguruma"),
      import("@shikijs/themes/github-dark"),
    ]);
  return createHighlighterCore({
    themes: [theme], langs: [],
    engine: createOnigurumaEngine(import("shiki/wasm")),
  });
}

const cache = new WeakMap<ParsedDiffFile, Promise<HighlightedDiff>>();

export function highlightDiff(file: ParsedDiffFile): Promise<HighlightedDiff> {
  const cached = cache.get(file);
  if (cached) return cached;
  // A failed grammar download must never prevent reviewing the patch.
  const result = tokenizeDiff(file).catch(() => new Map<number, ThemedToken[]>());
  cache.set(file, result);
  return result;
}

async function tokenizeDiff(file: ParsedDiffFile): Promise<HighlightedDiff> {
  const result: HighlightedDiff = new Map();
  if (file.isBinary || file.lines.length > 5000 ||
      file.lines.reduce((length, line) => length + line.code.length, 0) > 200_000) return result;
  const language = languageForPath(file.newPath ?? file.oldPath ?? file.displayPath);
  if (!language) return result;
  const { bundledLanguages } = await import("shiki/langs");
  const loader = bundledLanguages[language as keyof typeof bundledLanguages];
  if (!loader) return result;
  const highlighter = await (highlighterPromise ??= createHighlighter().catch((error) => {
    highlighterPromise = undefined;
    throw error;
  }));
  await highlighter.loadLanguage(loader);

  let hunk: number[] = [];
  const flush = () => {
    // Each side needs its own multiline grammar state. Gaps between hunks have
    // unknown source, so state must not bleed from one hunk to the next.
    for (const side of ["old", "new"] as const) {
      const indexes = hunk.filter((index) => file.lines[index].type !==
        (side === "old" ? "add" : "delete"));
      if (!indexes.length) continue;
      const { tokens } = highlighter.codeToTokens(
        indexes.map((index) => file.lines[index].code).join("\n"),
        { lang: language, theme: "github-dark" },
      );
      indexes.forEach((index, offset) => {
        if (side === "new" || file.lines[index].type === "delete") {
          result.set(index, tokens[offset]);
        }
      });
    }
    hunk = [];
  };
  file.lines.forEach((line, index) => {
    if (line.type !== "metadata") hunk.push(index);
    else if (line.code.startsWith("@@")) flush();
  });
  flush();
  return result;
}
