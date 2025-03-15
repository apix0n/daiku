import * as cheerio from 'cheerio';
import { getTmdbInfos } from '../tmdb/getTmdbInfos';
import { replaceByTmdb } from '../tmdb/replaceByTmdb';


const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0";

export async function fetchUserFavourites(username) {
    try {
        const response = await fetch(`https://letterboxd.com/${username}`, {
            headers: { 'User-Agent': ua }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        // return html;
        const $ = cheerio.load(html); // Load HTML into Cheerio

        console.log(`letterboxd likes | fetched profile for user ${username}`);

        const favMovies = [];

        // Select the <ul> inside #favourites and get all <li> elements
        $('section#favourites > ul > li').each((_, li) => {
            const filmPoster = $(li).find('.film-poster'); // Select .film-poster inside each <li>
            favMovies.push("https://letterboxd.com/" + $(filmPoster).attr("data-type") + "/" + $(filmPoster).attr('data-film-slug') + "/");
        });

        return favMovies;
    } catch (error) {
        console.error(`Error fetching user profile: ${error.message}`);
        throw error;
    }
}

export async function getBoxdTMDBInfos(links) {
    const tmdbData = { watched: [] };

    for (const link of links) {
        const response = await fetch(link, {
            headers: { 'User-Agent': ua }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        const body = $('body');
        const tmdbType = body.attr('data-tmdb-type');
        const tmdbId = body.attr('data-tmdb-id');

        if (tmdbId && tmdbType === "movie") {
            tmdbData.watched.push({
                title: body.find('h1.filmtitle').text().trim(),
                mediaType: "movie",
                sourceList: "letterboxd",
                movieRuntime: null,
                coverLink: null,
                link: link,
                tmdbId: tmdbId,
            });
        }
    }

    const updatedList = await replaceByTmdb(tmdbData);

    return updatedList;
}

export async function makeBoxdFavouritesList(letterboxdUsername) {
    try {
        const userFav = await fetchUserFavourites(letterboxdUsername);
        const movieInfos = await getBoxdTMDBInfos(userFav);

        const movieFavourites = movieInfos.watched.map(movie => ({
            cover: movie.coverLink,
            name: movie.title,
            link: movie.link
        }));

        return {
            updatedAt: new Date().toISOString(),
            favourites: [{
                icon: "ph:movies",
                favourites: movieFavourites
            }],
        };
    } catch (error) {
        console.error(error.message)
        return []
    }
}