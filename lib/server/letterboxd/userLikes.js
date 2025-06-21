import * as cheerio from 'cheerio';
import { getBoxdTMDBInfos } from './getBoxdTMDBInfos';
import { getLinkFromId } from '$lib/utils/getLinkFromId';

export const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0";

export async function fetchUserFavourites(username) {
    try {
        const response = await fetch(`https://letterboxd.com/${username}`, {
            headers: { 'User-Agent': ua }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
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

export async function makeBoxdFavouritesList(letterboxdUsername) {
    try {
        const userFav = await fetchUserFavourites(letterboxdUsername);
        const movieInfos = await getBoxdTMDBInfos(userFav);

        const movieFavourites = movieInfos.watched.map(movie => ({
            cover: movie.media.cover.medium,
            name: movie.media.title.locale || movie.media.title.english,
            link: getLinkFromId(movie.media.id.letterboxd, 'letterboxd')
        }));

        return {
            updatedAt: new Date().toISOString(),
            favourites: [{
                type: "movies",
                favourites: movieFavourites
            }],
        };
    } catch (error) {
        console.error(error.message)
        return []
    }
}