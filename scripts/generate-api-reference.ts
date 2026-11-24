#!/usr/bin/env npx tsx
/**
 * Rewrites the README's method tables (between the GENERATED markers) from the OpenAPI
 * spec, so they cannot drift from the client. Run by `npm run generate`.
 *
 *   npx tsx scripts/generate-api-reference.ts --spec <file or URL>
 */
import { readFile, writeFile } from "node:fs/promises";

interface Operation {
  operationId?: string;
  summary?: string;
  tags?: string[];
}

const BEGIN = "<!-- BEGIN GENERATED API REFERENCE -->";
const END = "<!-- END GENERATED API REFERENCE -->";

let source = process.env.SPEC ?? "https://api.socialapi.sh/openapi.json";
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i] === "--spec") source = process.argv[(i += 1)]!;
  else throw new Error(`Unknown argument: ${process.argv[i]}`);
}

const spec = (
  /^https?:\/\//.test(source)
    ? await (await fetch(source)).json()
    : JSON.parse(await readFile(source, "utf8"))
) as { paths?: Record<string, Record<string, Operation>> };

const property = (tag: string) => tag.toLowerCase().replace(/[^a-z0-9]/g, "");
const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

/**
 * What an endpoint returns, in a few words: its summary's first sentence, up to its first
 * colon or comma ("A profile: name, bio…" is "A profile").
 */
function short(summary: string): string {
  const sentence = summary.replace(/\s+/g, " ").trim().split(/\.(\s|$)/)[0] ?? "";
  const head = sentence.split(/: |, | \(/)[0] ?? sentence;
  return (head.charAt(0).toUpperCase() + head.slice(1)).replace(/\|/g, "\\|");
}

const groups = new Map<string, string[]>();
for (const item of Object.values(spec.paths ?? {})) {
  const operation = item.get;
  const tag = operation?.tags?.[0];
  if (!operation?.operationId || !tag) continue;
  const prefix = property(tag);
  const id = operation.operationId;
  const name = id.toLowerCase().startsWith(prefix) && id.length > prefix.length ? lowerFirst(id.slice(prefix.length)) : id;
  groups.set(tag, [...(groups.get(tag) ?? []), `| \`${prefix}.${name}()\` | ${short(operation.summary ?? "")} |`]);
}

const tags = [...groups.keys()].sort((a, b) => (a === "Account" ? 1 : b === "Account" ? -1 : a.localeCompare(b)));
const reference = tags
  .map((tag) => [`### ${tag}`, "", "| Method | Description |", "| --- | --- |", ...groups.get(tag)!].join("\n"))
  .join("\n\n");

const readme = await readFile("README.md", "utf8");
const begin = readme.indexOf(BEGIN);
const end = readme.indexOf(END);
if (begin === -1 || end < begin) throw new Error(`README.md is missing the ${BEGIN} / ${END} markers.`);
await writeFile("README.md", `${readme.slice(0, begin + BEGIN.length)}\n\n${reference}\n\n${readme.slice(end)}`);
console.log("README method tables regenerated.");
