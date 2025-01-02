import { formatDateLocale } from "$lib/formatDateLocale";

export function allRecentActivity(anilistData, mangaCollection, watchedMovies, recentActivityThreshold) {
    let recentActivity = [...anilistData];
    let recentlyAddedToCollection = [];

    mangaCollection.collection.forEach(serie => {
        if (serie.dateDernierAjout >= recentActivityThreshold) {
            serie.editions.forEach(edition => {
                if (edition.dateDernierAjout >= recentActivityThreshold) {
                    edition.possessions.forEach(volume => {
                        if (Math.floor(new Date(volume.dateAjout).getTime() / 1000) >= recentActivityThreshold) {
                            let activity = {
                                date: volume.dateAjout,
                                mediaTitle: serie.titre,
                                mediaType: "volume",
                                messagePrefix: "Added volume",
                                activityProgress: volume.numeroTome,
                                messageRoot: "of",
                                messageSuffix: ` (${edition.titreEdition}) to manga collection`,
                                coverSrc: volume.coverLink
                            }
                            recentlyAddedToCollection.push(activity)
                        }
                    })
                }
            })
        }
    })

    let recentlyWatchedMovies = []

    watchedMovies.watched.forEach(movie => {
        const messagePrefix = movie.rewatch ? "Rewatched" : "Watched";
        if (Math.floor(formatDateLocale(movie.finishedDate).getTime() / 1000) >= recentActivityThreshold) {
            let activity = {
                date: formatDateLocale(movie.finishedDate),
                mediaTitle: movie.title,
                mediaType: "movie",
                messagePrefix: messagePrefix,
                messageRoot: "movie",
                mediaLink: movie.link,
                coverSrc: movie.coverLink
            }
            recentlyWatchedMovies.push(activity)
        }
    })

    // Ajouter le contenu de recentlyAddedToCollection et recentlyWatchedMovies à recentActivity
    recentActivity = recentActivity.concat(recentlyAddedToCollection, recentlyWatchedMovies);
    // Trier par date, les plus récents en premier
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log("[recentAct] --- created recent activity list -----")

    return recentActivity;
}