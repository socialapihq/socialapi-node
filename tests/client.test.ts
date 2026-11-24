// The client against a stubbed fetch: no network.
import { describe, expect, it } from "vitest";
import { SocialAPI, SocialAPIError } from "../src/index.js";

function stub(status: number, body: unknown, headers: Record<string, string> = {}) {
  const requests: Request[] = [];
  const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    requests.push(new Request(input as string, init));
    return new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json", ...headers },
    });
  };
  return { requests, fetch: fetch as typeof globalThis.fetch };
}

const PROFILE = {
  data: {
    id: "15948",
    username: "nike",
    displayName: "Nike",
    url: "https://www.tiktok.com/@nike",
    verified: true,
    private: false,
    followers: 9440721,
    ext: { secUid: "MS4wLjABAAAA", seller: false, likesPublic: false },
  },
};

describe("SocialAPI", () => {
  it("sends the query and the key, and answers the body", async () => {
    const { requests, fetch } = stub(200, PROFILE);
    const client = new SocialAPI({ apiKey: "sapi_test", fetch });
    const { data } = await client.tiktok.profile({ handle: "nike" });
    expect(data.username).toBe("nike");
    expect(data.private).toBe(false);
    expect(requests[0]!.url).toBe("https://api.socialapi.sh/v1/tiktok/profile?handle=nike");
    expect(requests[0]!.headers.get("authorization")).toBe("Bearer sapi_test");
  });

  it("takes another base URL", async () => {
    const { requests, fetch } = stub(200, { balance: 2500 });
    const client = new SocialAPI({ apiKey: "sapi_test", baseUrl: "http://localhost:8787/", fetch });
    expect((await client.account.getCredits()).balance).toBe(2500);
    expect(requests[0]!.url).toBe("http://localhost:8787/v1/credits");
  });

  it("turns a refusal into a SocialAPIError", async () => {
    const { fetch } = stub(
      404,
      { error: "No TikTok account matches this handle.", code: "NOT_FOUND" },
      { "x-request-id": "req_1" },
    );
    const client = new SocialAPI({ apiKey: "sapi_test", fetch });
    const error = await client.tiktok.profile({ handle: "nobody" }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(SocialAPIError);
    expect(error).toMatchObject({ status: 404, code: "NOT_FOUND", requestId: "req_1" });
    expect((error as SocialAPIError).message).toBe("No TikTok account matches this handle.");
  });

  it("says when to retry a rate-limited call", async () => {
    const { fetch } = stub(429, { error: "Too many requests.", code: "RATE_LIMITED" }, { "retry-after": "7" });
    const client = new SocialAPI({ apiKey: "sapi_test", fetch });
    const error = await client.account.getCredits().catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 429, code: "RATE_LIMITED", retryAfter: 7 });
  });

  it("reads the key from SOCIALAPI_API_KEY", async () => {
    const { requests, fetch } = stub(200, { balance: 1 });
    process.env.SOCIALAPI_API_KEY = "sapi_env";
    try {
      await new SocialAPI({ fetch }).account.getCredits();
    } finally {
      delete process.env.SOCIALAPI_API_KEY;
    }
    expect(requests[0]!.headers.get("authorization")).toBe("Bearer sapi_env");
  });

  it("refuses to start without a key", () => {
    expect(() => new SocialAPI()).toThrow(/API key/);
  });
});
