import { parseString } from 'xml2js';
import { getTmdbInfos } from '../tmdb/getTmdbInfos';
import { error } from '@sveltejs/kit';

export async function fetchWatchedMovies(username) {
    const watchedMovies = [];
    const feed = `https://letterboxd.com/${username}/rss`;
    const response = await fetch(feed);
    const feedText = await response.text();

    let parsedFeed;

    parseString(feedText, (err, result) => {
        if (err) {
            throw new Error('Failed to parse XML');
        }
        parsedFeed = JSON.parse(JSON.stringify(result));
    });

    for (const item of parsedFeed['rss'].channel[0].item) {
        const tmdbId = parseInt(item['tmdb:movieId']?.[0]); 
        let filmTitle, coverSrc, runtime;

        if (tmdbId) {
            filmTitle = item['letterboxd:filmTitle']?.[0];
            const summary = item['description']?.[0];
            const imgSrcRegex = /<img\s+src="([^"]+)"/;
            const match = imgSrcRegex.exec(summary);
            coverSrc = match ? match[1] : null;
            runtime = null;
        } else {
            continue
        }

        const finishedDate = item['letterboxd:watchedDate']?.[0];
        const mediaType = 'movie';
        const rating = Math.round(parseFloat(item['letterboxd:memberRating']?.[0] ?? 0) * 2);
        const isRewatch = item['letterboxd:rewatch']?.[0] === 'Yes';
        const reviewLink = item.link?.[0];

        watchedMovies.push({
            title: filmTitle,
            mediaType: mediaType,
            sourceList: "letterboxd",
            movieRuntime: runtime,
            coverLink: coverSrc,
            finishedDate: finishedDate,
            rating: rating,
            rewatch: isRewatch,
            link: reviewLink,
            tmdbId: tmdbId,
        });
    }

    return {
        updatedAt: new Date().toISOString(),
        watched: watchedMovies,
    };
}