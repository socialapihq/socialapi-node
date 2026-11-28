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

### Bluesky

| Method | Description |
| --- | --- |
| `bluesky.batchPosts()` | Up to 25 posts at once |
| `bluesky.batchProfiles()` | Up to 25 accounts at once |
| `bluesky.feed()` | A feed with its description and likes |
| `bluesky.feedPosts()` | A feed's posts |
| `bluesky.hashtagPosts()` | A hashtag's posts |
| `bluesky.list()` | A list with its purpose and member count |
| `bluesky.listMembers()` | A list's accounts |
| `bluesky.listPosts()` | The posts of a list's accounts |
| `bluesky.post()` | One post with its likes |
| `bluesky.postComments()` | A post's replies |
| `bluesky.postLikes()` | The accounts that liked a post |
| `bluesky.postQuotes()` | The posts quoting a post |
| `bluesky.postReposts()` | The accounts that reposted a post |
| `bluesky.profile()` | An account with its follower and post counts |
| `bluesky.profileFeeds()` | The feeds an account made |
| `bluesky.profileFollowers()` | The accounts following an account |
| `bluesky.profileFollowing()` | The accounts an account follows |
| `bluesky.profileLists()` | The lists an account made |
| `bluesky.profileMedia()` | An account's posts with images or video |
| `bluesky.profilePosts()` | An account's posts and reposts |
| `bluesky.profileReplies()` | An account's posts with its replies |
| `bluesky.profileStarterPacks()` | The starter packs an account made |
| `bluesky.profileVideos()` | An account's posts with video |
| `bluesky.search()` | Posts matching a query |
| `bluesky.searchFeeds()` | Feeds matching a query |
| `bluesky.searchStarterPacks()` | Starter packs matching a query |
| `bluesky.searchUsers()` | Accounts matching a query |
| `bluesky.starterPack()` | A starter pack with its accounts' list and feeds |
| `bluesky.trending()` | The posts of Bluesky's Discover feed |
| `bluesky.trendingTopics()` | The topics trending now |

### Douyin

| Method | Description |
| --- | --- |
| `douyin.hashtag()` | A hashtag with its views |
| `douyin.live()` | A live room |
| `douyin.playlistPosts()` | A series' posts |
| `douyin.post()` | One post with its likes |
| `douyin.postCommentReplies()` | A comment's replies |
| `douyin.postComments()` | A post's comments |
| `douyin.postRelated()` | Posts like a post |
| `douyin.profile()` | An account with its followers |
| `douyin.profilePlaylists()` | An account's series |
| `douyin.profilePosts()` | An account's latest posts |
| `douyin.searchSuggestions()` | What Douyin's search box suggests for a query |
| `douyin.sound()` | A sound with the number of posts using it |
| `douyin.soundPosts()` | Posts using a sound |
| `douyin.trending()` | Douyin's hot search list |
| `douyin.trendingPosts()` | Recommended posts |

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

### Kick

| Method | Description |
| --- | --- |
| `kick.category()` | A category with its viewers and followers |
| `kick.categoryClips()` | A category's clips |
| `kick.categoryLives()` | A category's live broadcasts |
| `kick.live()` | Whether a channel is live |
| `kick.post()` | One video or clip with its views and a link to play it |
| `kick.postComments()` | A video's chat replay |
| `kick.postTranscript()` | A video's or clip's captions as text |
| `kick.profile()` | A channel with its follower count and links |
| `kick.profileClips()` | A channel's clips |
| `kick.profilePosts()` | A channel's videos |
| `kick.searchCategories()` | Categories matching a search |
| `kick.searchLives()` | Live broadcasts matching a search |
| `kick.searchUsers()` | Channels matching a search |
| `kick.trending()` | The live broadcasts most watched now |
| `kick.trendingCategories()` | The categories most watched now |
| `kick.trendingClips()` | The site's most viewed clips |

### LinkedIn

| Method | Description |
| --- | --- |
| `linkedin.ad()` | One ad with who paid for it and its reach |
| `linkedin.adsSearch()` | Ads from LinkedIn's Ad Library |
| `linkedin.article()` | An article with its text |
| `linkedin.company()` | A company's page with its followers and employees |
| `linkedin.companyJobs()` | A company's open jobs |
| `linkedin.companyPosts()` | A company's posts |
| `linkedin.job()` | One job posting with its description |
| `linkedin.post()` | One post with its reactions and comments |
| `linkedin.postComments()` | A post's first comments |
| `linkedin.postTranscript()` | A post's video's captions as text |
| `linkedin.profile()` | A member's public profile with its followers |
| `linkedin.profileArticles()` | A member's articles |
| `linkedin.profilePosts()` | A member's latest posts |
| `linkedin.searchCompanies()` | Companies matching a name |
| `linkedin.searchJobs()` | Job postings for a search |
| `linkedin.searchLocations()` | Places matching a name |
| `linkedin.searchUsers()` | Members with a first and last name |

### Pinterest

| Method | Description |
| --- | --- |
| `pinterest.board()` | A board with its pin and follower counts |
| `pinterest.boardPosts()` | A board's pins |
| `pinterest.boardSectionPosts()` | A board section's pins |
| `pinterest.boardSections()` | A board's sections with their pin counts |
| `pinterest.post()` | One pin with its saves |
| `pinterest.postCommentReplies()` | A comment's replies |
| `pinterest.postComments()` | A pin's comments |
| `pinterest.profile()` | A profile with its follower and pin counts |
| `pinterest.profileBoards()` | An account's boards |
| `pinterest.profilePosts()` | The pins an account created |
| `pinterest.search()` | Pins matching a query |
| `pinterest.searchBoards()` | Boards matching a query |
| `pinterest.searchSuggestions()` | What the search box suggests for a few letters |
| `pinterest.searchUsers()` | Accounts matching a query |
| `pinterest.searchVideos()` | Video pins matching a query |
| `pinterest.topic()` | A topic's Ideas page with its followers and searches |
| `pinterest.topicPosts()` | A topic's top pins |
| `pinterest.trending()` | What a country searches for on Pinterest Trends |
| `pinterest.url()` | How many times a web page was saved to Pinterest |

### Reddit

| Method | Description |
| --- | --- |
| `reddit.post()` | One post with its score |
| `reddit.postCommentReplies()` | A comment's replies |
| `reddit.postComments()` | A post's comments with their replies |
| `reddit.postTranscript()` | A video post's captions as text |
| `reddit.profile()` | A profile with its karma and trophies |
| `reddit.profileComments()` | An account's comments |
| `reddit.profilePosts()` | An account's posts |
| `reddit.search()` | Posts matching a query across Reddit |
| `reddit.searchComments()` | Comments matching a query across Reddit |
| `reddit.searchMedia()` | Image and video posts matching a query |
| `reddit.searchSubreddits()` | Communities matching a query |
| `reddit.searchUsers()` | Accounts matching a name |
| `reddit.subreddit()` | A community with its members |
| `reddit.subredditPosts()` | A community's posts |
| `reddit.subredditSearch()` | Posts in one community matching a query |
| `reddit.trending()` | What is hot on Reddit now |
| `reddit.trendingSearches()` | The searches Reddit shows as trending now |

### Telegram

| Method | Description |
| --- | --- |
| `telegram.invite()` | What an invite link opens |
| `telegram.post()` | One channel post or group message |
| `telegram.postComments()` | A post's comments |
| `telegram.profile()` | A channel |
| `telegram.profilePosts()` | A channel's posts |
| `telegram.profileSearch()` | A search inside a channel |

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

### Twitch

| Method | Description |
| --- | --- |
| `twitch.batchLive()` | Up to 100 channels' live status at once |
| `twitch.batchProfiles()` | Up to 50 channels at once |
| `twitch.category()` | A category with its viewers |
| `twitch.categoryClips()` | A category's clips |
| `twitch.categoryLives()` | A category's live channels |
| `twitch.categoryPosts()` | A category's videos |
| `twitch.live()` | Whether a channel is live |
| `twitch.post()` | One video or clip with its views and a link to play it |
| `twitch.postComments()` | A video's chat replay |
| `twitch.profile()` | A channel with its follower count and links |
| `twitch.profileClips()` | A channel's clips |
| `twitch.profilePosts()` | A channel's videos |
| `twitch.profileSchedule()` | A channel's coming broadcasts |
| `twitch.search()` | Videos matching a query |
| `twitch.searchCategories()` | Categories matching a query |
| `twitch.searchLives()` | Live channels matching a query |
| `twitch.searchSuggestions()` | What the search box suggests for a few letters |
| `twitch.searchUsers()` | Channels matching a query |
| `twitch.trending()` | The live channels most watched now |
| `twitch.trendingCategories()` | The categories most watched now |

### X

| Method | Description |
| --- | --- |
| `x.community()` | A community with its members |
| `x.communityPosts()` | A community's top posts |
| `x.live()` | A live video broadcast |
| `x.post()` | One post with its views |
| `x.postComments()` | The top replies to a post |
| `x.postTranscript()` | A video post's captions as text |
| `x.profile()` | An account with its follower and post counts |
| `x.profileHighlights()` | The posts an account highlighted |
| `x.profilePosts()` | An account's posts and reposts |
| `x.profileSimilar()` | Accounts like one |
| `x.space()` | A Space with its hosts |
| `x.trending()` | The topics trending in a country |
| `x.trendingPosts()` | The posts trending on X today |

### YouTube

| Method | Description |
| --- | --- |
| `youtube.batchPosts()` | Up to 50 videos at once |
| `youtube.batchProfiles()` | Up to 20 channels at once |
| `youtube.batchTranscripts()` | Up to 20 videos' captions at once |
| `youtube.community()` | One community post with its likes and images |
| `youtube.hashtag()` | A hashtag with its video and channel counts |
| `youtube.hashtagPosts()` | A hashtag's videos or Shorts |
| `youtube.playlist()` | A playlist with its owner and video count |
| `youtube.playlistPosts()` | A playlist's videos in order |
| `youtube.post()` | One video or Short with its views |
| `youtube.postCommentReplies()` | A comment's replies |
| `youtube.postComments()` | A video's comments |
| `youtube.postRelated()` | The videos YouTube suggests beside one |
| `youtube.postTranscript()` | A video's captions as text |
| `youtube.profile()` | A channel with its subscribers |
| `youtube.profileCommunity()` | A channel's community posts |
| `youtube.profileLives()` | A channel's live streams |
| `youtube.profilePlaylists()` | A channel's playlists |
| `youtube.profilePodcasts()` | A channel's podcasts |
| `youtube.profilePosts()` | A channel's videos |
| `youtube.profileSearch()` | A search within one channel's videos |
| `youtube.profileShorts()` | A channel's Shorts |
| `youtube.search()` | Videos matching a query |
| `youtube.searchChannels()` | Channels matching a query |
| `youtube.searchPlaylists()` | Playlists matching a query |
| `youtube.searchSuggestions()` | What the search box suggests for a few letters |
| `youtube.trending()` | What is trending in a country |

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
