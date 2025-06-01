export function totalVolumes(collection) {
    return collection.reduce((total, manga) => {
        return total + manga.editions.reduce((editionTotal, edition) => {
            return editionTotal + edition.possessions.length;
        }, 0);
    }, 0);
}

export function seriesWithPossessions(collection) {
    return collection.filter(manga =>
        manga.editions.some(edition => edition.possessions.length > 0)
    );
}