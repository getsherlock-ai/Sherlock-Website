import { describe, expect, it } from "vitest";
import { highlightDiff, languageForPath } from "./diffHighlight";
import { parseUnifiedDiff } from "./diffParser";

function file(path: string, patch: string) {
  return parseUnifiedDiff(`diff --git a/${path} b/${path}\n--- a/${path}\n+++ b/${path}\n${patch}`)[0];
}

describe("diff highlighting", () => {
  it.each([
    ["src/app.tsx", "tsx"], ["src/main.rs", "rust"], ["Main.cs", "csharp"],
    ["scripts/task.ps1", "powershell"], ["C:\\repo\\main.py", "py"],
    [".env.local", "dotenv"], ["Dockerfile.production", "dockerfile"],
    ["Makefile", "makefile"], ["lib/header.hpp", "cpp"],
  ])("resolves %s", (path, language) => {
    expect(languageForPath(path)).toBe(language);
  });

  it.each([
    ["server.js", 'const message = "hello";'],
    ["main.py", 'def greet(): return "hello"'],
    ["main.rs", 'fn main() { println!("hello"); }'],
    ["App.tsx", 'const App = () => <div title="hello" />;'],
    ["schema.sql", "SELECT name FROM users WHERE id = 1;"],
  ])("colors %s without changing its source", async (path, source) => {
    const parsed = file(path, `@@ -1 +1 @@\n-${source}\n+${source}`);
    const tokens = await highlightDiff(parsed);
    for (const [index, lineTokens] of tokens) {
      expect(lineTokens.map((token) => token.content).join("")).toBe(parsed.lines[index].code);
    }
    expect(tokens.size).toBe(2);
    expect(new Set([...tokens.values()].flat().map((token) => token.color)).size).toBeGreaterThan(1);
    expect([...tokens.keys()].every((index) => parsed.lines[index].type !== "metadata")).toBe(true);
  });

  it("keeps removed multiline comments out of the new code and resets between hunks", async () => {
    const parsed = file("server.js", "@@ -1,2 +1,2 @@\n-/* removed comment\n+const first = 1;\n const second = 2;\n@@ -20 +20 @@\n-const old = 1;\n+const fresh = 2;");
    const tokens = await highlightDiff(parsed);
    const colors = (source: string) => tokens.get(parsed.lines.findIndex((line) => line.code === source))!.map((token) => token.color);
    expect(new Set(colors("const second = 2;")).size).toBeGreaterThan(1);
    expect(new Set(colors("const old = 1;")).size).toBeGreaterThan(1);
    expect(new Set(colors("/* removed comment")).size).toBe(1);
  });

  it("preserves multiline strings within a hunk", async () => {
    const parsed = file("main.py", '@@ -1,3 +1,3 @@\n value = """hello\n-world\n+friend\n """');
    const tokens = await highlightDiff(parsed);
    const old = parsed.lines.findIndex((line) => line.code === "world");
    const added = parsed.lines.findIndex((line) => line.code === "friend");
    expect(tokens.get(old)?.[0].color).toBe(tokens.get(added)?.[0].color);
    expect(tokens.get(old)?.[0].color).toBeTruthy();
  });

  it("uses old paths for deleted files, and safely falls back for unknown or binary files", async () => {
    const deleted = file("main.py", "@@ -1 +0,0 @@\n-print(1)");
    deleted.newPath = null;
    expect((await highlightDiff(deleted)).size).toBe(1);
    expect((await highlightDiff(file("unknown.unrecognized", "@@ -1 +1 @@\n-old\n+new"))).size).toBe(0);
    const binary = file("main.py", "@@ -1 +1 @@\n-old\n+new");
    binary.isBinary = true;
    expect((await highlightDiff(binary)).size).toBe(0);
  });

  it("keeps unusually large patches readable without tokenizing them", async () => {
    expect((await highlightDiff(file("main.js", `@@ -0,0 +1 @@\n+${"x".repeat(200_001)}`))).size).toBe(0);
  });
});
