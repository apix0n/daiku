import { error } from '@sveltejs/kit';
import { XMLParser } from 'fast-xml-parser';
import he from 'he'; // to decode html entities (film title)

export async function fetchWatchedMovies(username) {
    const watchedMovies = [];
    const feed = `https://letterboxd.com/${username}/rss`;
    const response = await fetch(feed);
    const feedText = await response.text();

    let parsedFeed = new XMLParser().parse(feedText);

    if (parsedFeed?.rss?.channel?.item) {
        for (const item of parsedFeed.rss.channel.item) {
            const tmdbId = parseInt(item['tmdb:movieId']);
            let filmTitle, coverSrc, runtime, review, reviewIsSpoiler;

            const finishedDate = item['letterboxd:watchedDate'];
            const mediaType = 'movie';
            const rating = Math.round(parseFloat(item['letterboxd:memberRating'] ?? 0) * 2);
            const isRewatch = item['letterboxd:rewatch'] === 'Yes';
            const reviewLink = item.link;

            if (tmdbId) {
                filmTitle = he.decode(item['letterboxd:filmTitle']); // decode title to replace html entities
                const summary = item['description'];
                const imgSrcRegex = /<img\s+src="([^"]+)"/;
                const match = imgSrcRegex.exec(summary);

                review = summary.match(/<\/p>\s(.*<\/p>)\s/)[1];
                if (review.includes('<p><em>This review may contain spoilers.</em></p> ')) {
                    review = review.replace('<p><em>This review may contain spoilers.</em></p> ', "")
                    reviewIsSpoiler = true
                }
                const formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                    .formatToParts(new Date(finishedDate))
                    .reduce((str, part) => {
                        if (part.type === 'year') return str.trim() + ', ' + part.value; // Add a comma before the year
                        return part.type !== 'literal' ? str + part.value + ' ' : str;
                    }, '')
                    .trim();
                if (review === (`<p>Watched on ${formattedDate}.</p>`)) {
                    review = undefined
                }
                coverSrc = match ? match[1] : null;
                runtime = null;
            } else {
                continue
            }

            watchedMovies.push({
                title: filmTitle,
                mediaType: mediaType,
                sourceList: "letterboxd",
                movieRuntime: runtime,
                coverLink: coverSrc,
                finishedDate: finishedDate,
                rating: rating,
                review: review,
                reviewIsSpoiler: reviewIsSpoiler,
                rewatch: isRewatch,
                link: reviewLink,
                tmdbId: tmdbId,
            });
        }
    }

    return {
        updatedAt: new Date().toISOString(),
        watched: watchedMovies,
    };
}