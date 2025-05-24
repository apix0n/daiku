export async function getSynopsis(id, mediaType) {
    mediaType = mediaType === "movie" ? "anime" : mediaType;
    const response = await fetch(`https://api.jikan.moe/v4/${mediaType}/${id}/full`);
    const data = await response.json();
    console.log('jikan | got synopsis for', id);

    let synopsis = data.data.synopsis || '';
    let source = null;

    // Check for and extract (Source: ...) or [Written by MAL Rewrite]
    const sourceMatch = synopsis.match(/\(Source:\s*([^)]+)\)$/);
    const malRewriteMatch = synopsis.match(/\[Written by MAL Rewrite\]/);

    if (sourceMatch) {
        source = sourceMatch[1].trim() + (sourceMatch[1].includes('MAL') ? '' : ' · MAL');
        synopsis = synopsis.replace(/\s*\(Source:\s*[^)]+\)$/, '').trim();
    } else if (malRewriteMatch) {
        source = 'MAL Rewrite';
        synopsis = synopsis.replace(/\s*\[Written by MAL Rewrite\]/, '').trim();
    }

    console.log(synopsis, source);

    return { synopsis, source };
}