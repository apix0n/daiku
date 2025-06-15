import { urls } from "$lib/server/config";
import type { SingleEpisodeInfo } from "$lib/types/media";

export async function getLastChapter(query: string): Promise<SingleEpisodeInfo | undefined> {
    if (!urls.lmc) return undefined;

    const response = await fetch(urls.lmc + '/' + query);
    if (!response.ok) return undefined;
    const data = await response.json() as SingleEpisodeInfo;
    if (!data) return undefined;

    console.log('lmc | last chapter found for', query);
    return data;
}