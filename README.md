# daiku

another media dashboard

## requirements

* a Redis-type database to store the data,
  > thus avoiding getting 429'd or banned from using the services
* a hosting provider
  > i recommend Vercel because the functions can make a lot of outside calls which is needed for TMDB querying

## data sources

* [AniList](https://anilist.co/) for anime (series, movies), manga and favourites (anime, manga & characters),
* [MAL-Sync](https://malsync.moe/) API for getting the last released chapter of a manga,
    >  queried client-side, private API
* [Letterboxd](https://letterboxd.com/) for movies (+ liked),
    > movies: through the user diary RSS feed and limited to 50 entries (counts movies, series & lists)
    > 
    > likes: parses the Letterboxd user page & respective movie pages
* [The Movie Database (TMDB)](https://www.themoviedb.org/) for localised movie titles, runtimes & clean movie posters,
* [Mangacollec](https://www.mangacollec.com/) for the manga library,
    > private API
* [@apix0n/daiku-alternatives](https://github.com/apix0n/daiku-alternatives) for alternative titles, covers and additional information to override on the media

## configuration

| environment variable | description | default |
|---|---|---|
| ANILIST_ID | your AniList user ID | `null` |
| MANGACOLLEC_USERNAME | your Mangacollec username | `null` |
| LETTERBOXD_USERNAME | your Letterboxd username | `null` |
| TMDBAPIKEY | your TMDB API key | `null` |
| DAIKU_API_CACHE_TIME | defines how long (in seconds) to keep API calls responses in memory before fetching new data | 1800 |
| DAIKU_ANILIST_CACHE_TIME | defines how long (in seconds) to keep AniList data (anime & manga) in memory before fetching new data | 300 |
| DAIKU_DEFAULT_MANGA_LANG | defines the default language fallback for MALsync last chapter querying | `en` |
| DAIKU_REGEX_MANGA_LANGUAGE | regular expression for the language extraction from user notes on AniList | `lang:([^\s]+)` |
| DAIKU_APP_ACCENT | defines the main accent color used in the app | `#e8794e` |
| DAIKU_APP_ACCENT_SECOND | defines the second accent color used in the app | `#62544e` |
| DAIKU_API_AUTH_KEY_VARIABLE | defines from which environment variable the api authorization key will be set | `undefined` |

## other credits

* loading/progress bar inspiration: [@scosman/sveltekit-navigation-loader](https://github.com/scosman/sveltekit-navigation-loader),
* watch time circular chart inspiration: [@sergiopedercini](https://codepen.io/sergiopedercini/pen/jmKdbj),
* Letterboxd RSS feed parser: [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser),
* HTML characters decoder for the Letterboxd RSS feed: [he](https://www.npmjs.com/package/he),
* HTML parser for Letterboxd liked movies: [cheerio](https://cheerio.js.org/),
* iCalendar generator: [ical-generator](https://www.npmjs.com/package/ical-generator),
* icons: [Google Material Symbols Rounded](https://fonts.google.com/icons?icon.style=Rounded) or custom-made
<!-- w: 400; 48px -->

### made by apix with ❤️