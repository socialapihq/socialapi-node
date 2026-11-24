import { FetchError, ResponseError } from "./runtime.js";

/**
 * A request SocialAPI refused or could not answer. Refusals cost no credits.
 *
 * - `status`: the HTTP status (`404`, `403`, `402`, `429`, `502`…).
 * - `code`: what kind (`NOT_FOUND`, `PRIVATE`, `INVALID_REQUEST`, `INSUFFICIENT_CREDITS`,
 *   `RATE_LIMITED`, `UPSTREAM_UNAVAILABLE`…), stable to branch on.
 * - `param`: the parameter at fault, for `INVALID_REQUEST`.
 * - `requestId`: quote it to support.
 * - `retryAfter`: seconds to wait, for `RATE_LIMITED`.
 */
export class SocialAPIError extends Error {
  readonly status: number;
  readonly code: string;
  readonly param?: string;
  readonly requestId?: string;
  readonly retryAfter?: number;

  constructor(init: {
    message: string;
    status: number;
    code: string;
    param?: string;
    requestId?: string;
    retryAfter?: number;
  }) {
    super(init.message);
    this.name = "SocialAPIError";
    this.status = init.status;
    this.code = init.code;
    this.param = init.param;
    this.requestId = init.requestId;
    this.retryAfter = init.retryAfter;
  }
}

interface ErrorBody {
  error?: string;
  code?: string;
  param?: string;
}

/** Runs a generated call, turning a refusal into a `SocialAPIError`. */
export async function call<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (error instanceof ResponseError) {
      const response = error.response;
      let body: ErrorBody = {};
      try {
        body = (await response.json()) as ErrorBody;
      } catch {
        // Not JSON: the status says enough.
      }
      const retryAfter = Number(response.headers.get("retry-after"));
      throw new SocialAPIError({
        message: body.error ?? `SocialAPI answered ${response.status}.`,
        status: response.status,
        code: body.code ?? "ERROR",
        param: body.param,
        requestId: response.headers.get("x-request-id") ?? undefined,
        retryAfter: Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : undefined,
      });
    }
    if (error instanceof FetchError) {
      throw new SocialAPIError({
        message: `Could not reach SocialAPI: ${error.cause?.message ?? "the network failed"}.`,
        status: 0,
        code: "NETWORK_ERROR",
      });
    }
    throw error;
  }
}
