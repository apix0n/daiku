export function combineMoviesLists(watchedMovies, watchedAnimeMovies) {
    // Combine watched movies and watched anime movies, removing duplicates
    let newWatchedAnime = [];
    watchedAnimeMovies.watched.forEach(anime => {
        let isDuplicate = false;

        // Check for any common IDs between the two entries
        const movieIndex = watchedMovies.watched.findIndex((movie) => {
            // Check if any ID matches between both entries
            return Object.entries(anime.media.id).some(([source, animeId]) =>
                movie.media.id[source] === animeId && animeId !== null
            );
        });

        if (movieIndex !== -1) {
            const movie = watchedMovies.watched[movieIndex];
            // Combine IDs from both entries
            watchedMovies.watched[movieIndex].media.id = {
                ...movie.media.id,
                ...anime.media.id
            };

            if (anime.dates.finished && movie.dates.finished && anime.dates.finished !== movie.dates.finished) {
                // Add anime as separate entry if different watch dates
                newWatchedAnime.push(anime);
            }
            return;
        } else {
            for (let movie of watchedMovies.watched) {
                const animeFinishedDate = `${new Date(anime.dates.finished).getTime()}`;
                const movieFinishedDate = `${new Date(movie.dates.finished).getTime()}`;
                const runtimeDifference = Math.abs(anime.media.runtime - movie.media.runtime);
                if (animeFinishedDate === movieFinishedDate && -5 < runtimeDifference < 5) {
                    // Combine IDs for potential matches based on date and runtime
                    movie.media.id = {
                        ...movie.media.id,
                        ...anime.media.id
                    };
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                newWatchedAnime.push(anime);
            }
        }
    });

    const combinedWatchedMovies = watchedMovies.watched.concat(newWatchedAnime);
    combinedWatchedMovies.sort((a, b) => new Date(b.dates.finished) - new Date(a.dates.finished));

    console.log("[combined movie lists]")
    return {
        boxdUpdatedAt: watchedMovies.updatedAt,
        alUpdatedAt: watchedAnimeMovies.updatedAt,
        watched: combinedWatchedMovies
    }
}