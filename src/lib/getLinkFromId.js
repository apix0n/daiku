export function getLinkFromId(id, platform, mediaType='') {
    switch (platform) {
        case 'anilist':
            if (mediaType === 'anime') {
                return `https://anilist.co/anime/${id}`
            } else if (mediaType === 'manga') {
                return `https://anilist.co/manga/${id}`
            }
        case 'myanimelist':
            if (mediaType === 'anime') {
                return `https://myanimelist.net/anime/${id}`
            } else if (mediaType === 'manga') {
                return `https://myanimelist.net/manga/${id}`
            }
        case 'letterboxd':
            return `https://letterboxd.com/film/${id}`
        case 'imdb':
            return `https://www.imdb.com/title/${id}`
        case 'tmdb':
            return `https://www.themoviedb.org/movie/${id}`
    }
}