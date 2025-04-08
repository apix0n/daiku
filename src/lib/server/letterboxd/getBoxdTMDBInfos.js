import * as cheerio from 'cheerio';
import { replaceByTmdb } from '$lib/server/tmdb/replaceByTmdb.js';
import { extractBoxdId } from './utils';
import { ua } from './userLikes';

async function fetchMovieData(link) {
    const response = await fetch(link, {
        headers: { 'User-Agent': ua }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const body = $('body');
    const tmdbType = body.attr('data-tmdb-type');
    const tmdbId = body.attr('data-tmdb-id');

    if (tmdbId && tmdbType === "movie") {
        return {
            media: {
                title: {
                    english: body.find('h1:not(#header *)').text().trim()
                },
                type: 'movie',
                source: 'letterboxd',
                runtime: null,
                cover: { },
                id: {
                    letterboxd: extractBoxdId(link),
                    tmdb: tmdbId
                }
            }
        }
    }
    return null;
}

export async function getBoxdTMDBInfos(links) {
    const moviePromises = links.map(link => fetchMovieData(link));
    const movies = await Promise.all(moviePromises);

    const tmdbData = {
        watched: movies.filter(movie => movie !== null)
    };

    const updatedList = await replaceByTmdb(tmdbData);
    return updatedList;
}