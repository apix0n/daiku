import { error } from '@sveltejs/kit';
import { XMLParser } from 'fast-xml-parser';

export async function fetchWatchedMovies(username) {
    const watchedMovies = [];
    const feed = `https://letterboxd.com/${username}/rss`;
    const response = await fetch(feed);
    const feedText = await response.text();

    let parsedFeed = new XMLParser().parse(feedText);

    for (const item of parsedFeed.rss.channel.item) {
        const tmdbId = parseInt(item['tmdb:movieId']); 
        let filmTitle, coverSrc, runtime;

        if (tmdbId) {
            filmTitle = item['letterboxd:filmTitle'];
            const summary = item['description'];
            const imgSrcRegex = /<img\s+src="([^"]+)"/;
            const match = imgSrcRegex.exec(summary);
            coverSrc = match ? match[1] : null;
            runtime = null;
        } else {
            continue
        }

        const finishedDate = item['letterboxd:watchedDate'];
        const mediaType = 'movie';
        const rating = Math.round(parseFloat(item['letterboxd:memberRating'] ?? 0) * 2);
        const isRewatch = item['letterboxd:rewatch'] === 'Yes';
        const reviewLink = item.link;

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