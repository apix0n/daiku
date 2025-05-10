export function getLinkFromId(id, platform, mediaType='') {
    switch (platform) {
        case 'anilist':
            if (mediaType === 'manga') {
                return `https://anilist.co/manga/${id}`
            } else {
                return `https://anilist.co/anime/${id}`
            }
        case 'myanimelist':
            if (mediaType === 'manga') {
                return `https://myanimelist.net/manga/${id}`
            } else {
                return `https://myanimelist.net/anime/${id}`
            }
        case 'letterboxd':
            return `https://letterboxd.com/film/${id}`
        case 'imdb':
            return `https://www.imdb.com/title/${id}`
        case 'tmdb':
            return `https://www.themoviedb.org/movie/${id}`
    }
}