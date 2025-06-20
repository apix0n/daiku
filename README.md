# daiku

![Made in Svelte(Kit)](https://img.shields.io/badge/Made%20in%20Svelte(Kit)-grey?logo=svelte&labelColor=FF3E00&logoColor=white) ![GitHub last commit](https://img.shields.io/github/last-commit/apix0n/daiku)

another media dashboard

> this is in active development and mostly a personal project, but feel free to contribute if you want—help is always appreciated! 

## features / pages

- dashboard view
  - favourite movies, anime, manga & characters,
  - next chapter/episode to read/watch,
  - stats,
  - watch time,
  - recent activity,
- watching, watched, paused & dropped anime
- reading, read, paused & dropped manga
- manga collection / library
- watched movies
- planned anime, manga & movies
  - released
  - special season view for not yet released

## requirements

* a Redis-type database to store the data,
  > thus avoiding getting 429'd or banned from using the services
* a hosting provider
  > i recommend Vercel because the functions can make a lot of outside calls which is needed for TMDB querying

## data sources

* [AniList](https://anilist.co/) for anime (series, movies), manga and favourites (anime, manga & characters),
* [AnimeSchedule](https://animeschedule.net/) for correct (international) releasing anime airing time, 
* [MAL-Sync](https://malsync.moe/) API for getting the last released chapter of a manga,
    > queried client-side, private API
* [Jikan](https://jikan.moe/) for anime and manga synopsis,
    > queried client side;
    > unofficial, free and auth-less API for MyAnimeList
* [Letterboxd](https://letterboxd.com/) for movies (+ liked),
    > official API using guest authentication from the iOS app
* [The Movie Database (TMDB) API](https://www.themoviedb.org/) for localised movie titles, runtimes & clean movie posters,
* [Mangacollec](https://www.mangacollec.com/) for the manga library,
    > private API
* [@Kometa-Team/Anime-IDs](https://github.com/Kometa-Team/Anime-IDs) for linking anime to other platforms (anime to TMDB conversion), 
* [@apix0n/daiku-alternatives](https://github.com/apix0n/daiku-alternatives) for alternative titles, covers and additional information to override on the media

## configuration

| environment variable | description | default |
|---|---|---|
| ANILIST_ID | your AniList user ID | `null` |
| MANGACOLLEC_USERNAME | your Mangacollec username | `null` |
| LETTERBOXD_USERNAME | your Letterboxd username | `null` |
| TMDBAPIKEY | your TMDB API key | `null` |
| DAIKU_API_CACHE_TIME | defines how long (in seconds) to keep API calls responses in memory before fetching new data | 1800 |
| DAIKU_ANILIST_CACHE_TIME | defines how long (in seconds) to keep AniList anime & manga data in memory before fetching new data | 300 |
| DAIKU__DEFAULT_MANGA_LANG | defines the default language fallback for MALsync last chapter querying | `en` |
| DAIKU_DEFAULT_TMDB_LANG | defines the default language fallback for TMDB info querying ([more info on TMDB's API docs](https://developer.themoviedb.org/docs/languages)) | `en-US` |
| DAIKU_ANILIST_LANG_REGEX | regular expression for the language extraction from user notes on AniList | `lang:([^\s]+)` |
| DAIKU__APP_ACCENT | defines the main accent color used in the app | `#e8794e` |
| DAIKU__APP_ACCENT_SECOND | defines the second accent color used in the app | `#62544e` |
| DAIKU_API_AUTH_KEY_VARIABLE | defines from which environment variable the api authorization key will be set | `undefined` |
| DAIKU__ALTERNATIVES_BASE_URL | defines the base URL for the daiku-alternatives API | `undefined` |
| DAIKU_LMC_URL | defines the URL for the [last-manga-chapter](https://github.com/apix0n/last-manga-chapter) API | `undefined` |

## other credits

* loading/progress bar inspiration: [@scosman/sveltekit-navigation-loader](https://github.com/scosman/sveltekit-navigation-loader),
* watch time circular chart inspiration: [@sergiopedercini](https://codepen.io/sergiopedercini/pen/jmKdbj),
* iOS notch sticker: [@imputnet/cobalt](https://github.com/imputnet/cobalt),
* HTML parser for Letterboxd liked movies: [cheerio](https://cheerio.js.org/),
* iCalendar generator: [ical-generator](https://www.npmjs.com/package/ical-generator),
* icons: [Google Material Symbols Rounded](https://fonts.google.com/icons?icon.style=Rounded) or custom-made
<!-- w: 400; 48px -->

### made by apix with ❤️