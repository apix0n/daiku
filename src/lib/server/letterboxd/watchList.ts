import * as cheerio from 'cheerio';
import { getBoxdTMDBInfos } from './getBoxdTMDBInfos';

import { ua } from './userLikes';

async function fetchWatchlistPage(username: string, page = 1) {
    const response = await fetch(`https://letterboxd.com/${username}/watchlist/page/${page}/`, {
        headers: { 'User-Agent': ua }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
}

async function fetchUserWatchlist(username: string) {
    try {
        // Fetch first page to get total pages
        const firstPageHtml = await fetchWatchlistPage(username);
        const $ = cheerio.load(firstPageHtml);

        // Get max page number
        const lastPageElement = $('.paginate-pages ul li.paginate-page').last();
        let maxPages = 1;
        if (lastPageElement.length) {
            const href = lastPageElement.find('a').attr('href');
            const match = href ? href.match(/page\/(\d+)/) : null;
            if (match && match[1]) {
                maxPages = parseInt(match[1]);
            }
        }

        const watchlistMovies: string[] = [];
        const pagePromises = [];

        // Process first page immediately since we already have it
        const $firstPage = $;
        $firstPage('ul.poster-list > li').each((_, li) => {
            const filmPoster = $firstPage(li).find('.film-poster');
            watchlistMovies.push(
                "https://letterboxd.com/" +
                $firstPage(filmPoster).attr("data-type") + "/" +
                $firstPage(filmPoster).attr('data-film-slug') + "/"
            );
        });

        // Fetch remaining pages (2 to maxPages)
        for (let page = 2; page <= maxPages; page++) {
            pagePromises.push(fetchWatchlistPage(username, page));
        }

        const pages = await Promise.all(pagePromises);

        // Process each page
        pages.forEach(html => {
            const $page = cheerio.load(html);
            $page('ul.poster-list > li').each((_, li) => {
                const filmPoster = $page(li).find('.film-poster');
                watchlistMovies.push(
                    "https://letterboxd.com/" +
                    $page(filmPoster).attr("data-type") + "/" +
                    $page(filmPoster).attr('data-film-slug') + "/"
                );
            });
        });

        return watchlistMovies;
    } catch (error) {
        console.error(`Error fetching user watchlist: ${error}`);
        throw error;
    }
}

export async function makeBoxdWatchList(letterboxdUsername: string) {
    try {
        const userWl = await fetchUserWatchlist(letterboxdUsername);
        const movieInfos = await getBoxdTMDBInfos(userWl);
        return movieInfos;
    } catch (error) {
        console.error(error)
        return []
    }
}