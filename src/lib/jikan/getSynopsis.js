export async function getSynopsis(id, mediaType) {
    mediaType = mediaType === "movie" ? "anime" : mediaType
    const response = await fetch(`https://api.jikan.moe/v4/${mediaType}/${id}/full`);
    const data = await response.json();
    console.log('jikan | got synopsis for', id)
    return data.data.synopsis;
}