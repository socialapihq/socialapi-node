#!/usr/bin/env node
// Regenerates the low-level client (src/apis, src/models, src/runtime.ts) from the
// OpenAPI spec, then the `SocialAPI` client on top of it (src/client.ts), the README's
// method tables and the endpoint tests.
//
//   npm run generate                         # the live spec, https://api.socialapi.sh/openapi.json
//   SPEC=../socialapi/api/openapi/public.json npm run generate
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";

const spec = process.env.SPEC ?? "https://api.socialapi.sh/openapi.json";

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// Generated files only: a removed endpoint must not leave its class behind.
rmSync("src/apis", { recursive: true, force: true });
rmSync("src/models", { recursive: true, force: true });

run("npx", [
  "openapi-generator-cli",
  "generate",
  "-i",
  spec,
  "-g",
  "typescript-fetch",
  "-o",
  "src",
  "--additional-properties=supportsES6=true,importFileExtension=.js,modelPropertyNaming=original",
  // `private` is a field of ours, not a keyword to dodge: a property may be named so.
  "--reserved-words-mappings",
  "private=private",
]);
run("npx", ["tsx", "scripts/generate-client.ts", "--spec", spec]);
run("npx", ["tsx", "scripts/generate-api-reference.ts", "--spec", spec]);
run("npx", ["tsx", "scripts/generate-endpoint-tests.ts", "--spec", spec]);
