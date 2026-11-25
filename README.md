<p align="center">
  <a href="https://socialapi.sh">
    <img src="https://socialapi.sh/og.png" alt="SocialAPI: public social media data in one schema" width="640">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@socialapihq/sdk"><img src="https://img.shields.io/npm/v/@socialapihq/sdk.svg" alt="npm version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="License"></a>
</p>

<p align="center">
  Official TypeScript SDK for the <a href="https://socialapi.sh">SocialAPI</a>: profiles, posts, comments, transcripts,<br>
  searches and trends from TikTok, Instagram, Threads and Facebook, in one schema. See the <a href="https://socialapi.sh/docs">docs</a> for every endpoint.
</p>

<p align="center">
  Zero dependencies. Node 18+, Bun, Deno and edge runtimes.
</p>

## Installation

```sh
npm install @socialapihq/sdk
```

## Usage

Each platform is a property of the client and each endpoint a method on it. Create an API key in the [dashboard](https://app.socialapi.sh); it is sent as `Authorization: Bearer sapi_…`, and every account starts with 100 free credits.

```ts
import { SocialAPI } from "@socialapihq/sdk";

const client = new SocialAPI({ apiKey: process.env.SOCIALAPI_API_KEY });

const { data: profile } = await client.tiktok.profile({ handle: "nike" });
console.log(profile.displayName, profile.followers); // "Nike" 9440793

const { data: posts } = await client.instagram.profilePosts({ handle: "natgeo" });
for (const post of posts) {
  console.log(post.url, post.stats.likes);
}
```

Methods return the typed body: `{ data }` for one item, `{ data, pagination }` for a list. Every platform answers with the same field names, and what only one platform has sits under `ext`. `apiKey` defaults to the `SOCIALAPI_API_KEY` environment variable.

### Pagination

A list answers `pagination.nextCursor` while `pagination.hasMore` is true. Pass it back as `cursor` for the next page:

```ts
let cursor: string | undefined;
do {
  const page = await client.tiktok.profilePosts({ handle: "nike", cursor });
  for (const post of page.data) console.log(post.id, post.stats.views);
  cursor = page.pagination.hasMore ? (page.pagination.nextCursor ?? undefined) : undefined;
} while (cursor);
```

Each page costs credits like any call. A cached answer is free.

### Transcripts

```ts
const { data: transcript } = await client.tiktok.postTranscript({
  url: "https://www.tiktok.com/@nike/video/7711414040114892045",
});

console.log(transcript.language, transcript.text);
for (const cue of transcript.cues) {
  console.log(cue.startSeconds, cue.text); // 0.02 "Pole or podium?"
}
```

A transcript costs 5 credits and is cached for 30 days.

### Error handling

A refused call throws a `SocialAPIError`. Its `code` is stable to build logic on, and refused calls cost no credits:

```ts
import { SocialAPIError } from "@socialapihq/sdk";

try {
  await client.instagram.profile({ handle: "no-such-account" });
} catch (error) {
  if (error instanceof SocialAPIError) {
    console.log(error.status, error.code, error.message, error.requestId);
    // 404 "NOT_FOUND" "No Instagram account matches this handle." "req_…"
  }
}
```

`RATE_LIMITED` errors carry `retryAfter` in seconds. See [Errors](https://socialapi.sh/docs/errors) for every code.

### Configuration

```ts
const client = new SocialAPI({
  apiKey: "sapi_…",
  baseUrl: "https://api.socialapi.sh", // the default
  fetch: customFetch, // instead of the global fetch
  headers: { "x-team": "growth" }, // sent with every request
});

const controller = new AbortController();
await client.tiktok.profile({ handle: "nike" }, { signal: controller.signal });
```

The generated classes (`TikTokApi`, `InstagramApi`…) are exported too. Their `…Raw` methods give the `Response` itself, with the `X-Credits-Charged` and `X-Credits-Remaining` headers.

## API reference

<!-- BEGIN GENERATED API REFERENCE -->

### Facebook

| Method | Description |
| --- | --- |
| `facebook.event()` | One event |
| `facebook.events()` | A city's upcoming events |
| `facebook.eventsSearch()` | Events matching a query |
| `facebook.marketplaceItem()` | One Marketplace listing |
| `facebook.marketplaceSearch()` | Marketplace listings for a query near a point |
| `facebook.post()` | One post |
| `facebook.postCommentReplies()` | The replies to one comment |
| `facebook.postComments()` | A post's comments |
| `facebook.postTranscript()` | A video's captions as text with their times |
| `facebook.profile()` | A Page or a public person |
| `facebook.profilePhotos()` | A Page's or person's photos |
| `facebook.profilePosts()` | A Page's or person's posts |
| `facebook.profileVideos()` | A Page's videos with their plays |

### Instagram

| Method | Description |
| --- | --- |
| `instagram.highlight()` | A story highlight's stories |
| `instagram.location()` | A place |
| `instagram.locationPosts()` | A place's top posts with their likes and comments |
| `instagram.post()` | One post or reel with its counts |
| `instagram.postComments()` | A post's comments with their likes |
| `instagram.profile()` | A profile with its follower and following counts |
| `instagram.profileHighlights()` | An account's story highlights |
| `instagram.profilePosts()` | An account's posts |
| `instagram.profileReels()` | An account's reels with their plays |
| `instagram.profileSimilar()` | Accounts like this one |
| `instagram.search()` | Popular posts for a word or hashtag |
| `instagram.sound()` | A sound |
| `instagram.soundPosts()` | The reels that use a sound |
| `instagram.trending()` | The reels feed Instagram gives a visitor |
| `instagram.trendingTopics()` | The explore page's trending keywords and accounts |

### Threads

| Method | Description |
| --- | --- |
| `threads.post()` | One thread with its counts |
| `threads.postComments()` | A thread's replies |
| `threads.profile()` | A profile with its follower count |
| `threads.profileMedia()` | An account's threads with photos or videos |
| `threads.profilePosts()` | An account's threads |
| `threads.profileReplies()` | An account's replies to other threads |
| `threads.profileReposts()` | Other people's threads an account reposted |
| `threads.search()` | Threads matching a query |
| `threads.searchUsers()` | Accounts matching a name |
| `threads.trending()` | The feed Threads gives a visitor now |

### TikTok

| Method | Description |
| --- | --- |
| `tiktok.collectionPosts()` | The posts of a public saved collection |
| `tiktok.hashtag()` | A hashtag with its post and view counts |
| `tiktok.hashtagPosts()` | Posts under a hashtag |
| `tiktok.live()` | Whether an account is live |
| `tiktok.playlistPosts()` | The posts of a playlist |
| `tiktok.post()` | One post with its counts |
| `tiktok.postCommentReplies()` | The replies to one comment |
| `tiktok.postComments()` | A post's top-level comments |
| `tiktok.postRelated()` | Posts TikTok recommends beside one post |
| `tiktok.postTranscript()` | A post's captions as text with their times |
| `tiktok.profile()` | A profile with its exact follower and like counts |
| `tiktok.profileFollowers()` | An account's followers |
| `tiktok.profileFollowing()` | The accounts an account follows |
| `tiktok.profileLiked()` | Posts an account liked |
| `tiktok.profilePlaylists()` | The playlists an account made |
| `tiktok.profilePosts()` | An account's posts |
| `tiktok.profileReposts()` | Other people's posts an account reposted |
| `tiktok.search()` | Posts matching a query |
| `tiktok.searchUsers()` | Accounts matching a query |
| `tiktok.sound()` | A sound |
| `tiktok.soundPosts()` | Posts that use a sound |
| `tiktok.trending()` | What the explore page shows now |

### Account

| Method | Description |
| --- | --- |
| `account.getCredits()` | The credits left in your workspace |

<!-- END GENERATED API REFERENCE -->

Query parameters are fields of the method's object, such as `{ handle: "nike", cursor }`. Every endpoint, with its parameters and a real answer, is in the [API Reference](https://socialapi.sh/docs/api-reference).

## Links

- [Documentation](https://socialapi.sh/docs)
- [API Reference](https://socialapi.sh/docs/api-reference)
- [Dashboard](https://app.socialapi.sh)
- [OpenAPI spec](https://api.socialapi.sh/openapi.json)

## License

Apache-2.0
