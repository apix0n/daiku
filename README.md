# daiku

icons are from google material symbols rounded
w: 400; 48px
or custom made from them

## configuration

| environment variable | description | default |
|---|---|---|
| DAIKU_API_CACHE_TIME | defines how long (in seconds) to keep API calls responses in memory before fetching new data | 1800 |
| DAIKU_ANILIST_CACHE_TIME | defines how long (in seconds) to keep AniList data (anime & manga) in memory before fetching new data | 300 |
| DAIKU_REGEX_MANGA_LANGUAGE | regular expression for the language extraction from user notes on AniList | `lang:([^\s]+)` |
| DAIKU_APP_ACCENT | defines the main accent color used in the app | `#e8794e` |
| DAIKU_APP_ACCENT_SECOND | defines the second accent color used in the app | `#62544e` |
| ANILIST_ID | your AniList user ID | `null` |
| MANGACOLLEC_USERNAME | your MangaCollec username | `null` |
| LETTERBOXD_USERNAME | your Letterboxd username | `null` |
| TMDBAPIKEY | your TMDB API key | `null` |