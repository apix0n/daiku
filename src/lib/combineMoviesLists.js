export function combineMoviesLists(watchedMovies, watchedAnimeMovies) {
    // Combine watched movies and watched anime movies, removing duplicates
    let newWatchedAnime = [];
    watchedAnimeMovies.watched.forEach(anime => {
        let isDuplicate = false;
        const movieIndex = watchedMovies.watched.findIndex((movie) => anime.tmdbId === movie.tmdbId);

        if (movieIndex !== -1) {
            const movie = watchedMovies.watched[movieIndex];
            if (anime.finishedDate && movie.finishedDate && anime.finishedDate !== movie.finishedDate) {
                // Add both movies to the list
                newWatchedAnime.push(anime);
            }
            return;
        } else {
            for (let movie of watchedMovies.watched) {
                const animeFinishedDate = `${new Date(anime.finishedDate).getTime()}`;
                const movieFinishedDate = `${new Date(movie.finishedDate).getTime()}`;
                const runtimeDifference = Math.abs(anime.movieRuntime - movie.movieRuntime);
                if (animeFinishedDate === movieFinishedDate && -5 < runtimeDifference < 5) {
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
    combinedWatchedMovies.sort((a, b) => new Date(b.finishedDate) - new Date(a.finishedDate));

    console.log("[combined movie lists]")
    return {
        boxdUpdatedAt: watchedMovies.updatedAt,
        alUpdatedAt: watchedAnimeMovies.updatedAt,
        watched: combinedWatchedMovies
    }
}