import * as anilistGlobal from '$lib/server/anilist/global.js'

export async function getPrecedingEpisode(animeId, episode, offset=0) {
    if (episode === 1 || !episode) return undefined;
    const query = `
    query Media($mediaId: Int, $page: Int) {
  Media(id: $mediaId) {
    airingSchedule(page: $page, perPage: 1) {
      nodes {
        episode
        airingAt
      }
    }
  }
}`;
    let response = await anilistGlobal.fetchGraphQL(query, { mediaId: animeId, page: episode - 1 })
    return {
        number: response.data.Media.airingSchedule.nodes[0].episode + offset,
        timestamp: response.data.Media.airingSchedule.nodes[0].airingAt
    };
}