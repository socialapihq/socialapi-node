// The package's entry. `SocialAPI` is the client most code needs; the generated API
// classes, models and runtime are exported too, for full control.
export { SocialAPI } from "./client.js";
export type { Init, SocialAPIOptions } from "./client.js";
export { SocialAPIError } from "./errors.js";
export * from "./runtime.js";
export * from "./apis/index.js";
export * from "./models/index.js";
