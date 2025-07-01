import { applyOverrides } from '$lib/server/overrides/mangacollec';
import type { MangacollecCollection } from '$lib/types/mangacollec';
import type { BookElement, BookGroup, NextBookElement } from '$lib/types/media';
import type { BookRequest } from '$lib/types/requests';

const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0";

async function getToken() {
    const tokenUrl = 'https://api.mangacollec.com/oauth/token';

    // extracted from the https://www.mangacollec.com/client.[auto].js file
    const tokenReqVariables = {
        client_id: "38fee110b53a75af6cc72f6fb66fa504fc6241e566788f4b2f5b21c25ba2fefb",
        client_secret: "060658630f7d199c19ab1cf34ed4e50935c748267e318a24e048d6ab45871da2",
        grant_type: "client_credentials",
    }

    const tokenReqHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": ua,
    };

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: tokenReqHeaders,
        body: JSON.stringify(tokenReqVariables)
    });

    const data = await response.json();
    return `${data.token_type} ${data.access_token}`;
}

async function getCollec(user: string): Promise<MangacollecCollection> {
    const url = `https://api.mangacollec.com/v2/user/${user}/collection`;

    const collecHeaders = {
        "User-Agent": ua,
        "authorization": await getToken(),
        "Origin": "https://www.mangacollec.com",
    };

    const response = await fetch(url, { headers: collecHeaders });
    return await response.json();
}

function getSeries(series: MangacollecCollection["series"], seriesId: string) {
    return series.find((s) => s.id === seriesId);
}

function getVolume(volumes: MangacollecCollection["volumes"], volumeId: string) {
    return volumes.find((v) => v.id === volumeId);
}

function getType(types: MangacollecCollection["types"], typeId: string): string | null {
    const type = types.find((t) => t.id === typeId);
    if (!type) {
        return null;
    }
    return type.title;
}

function getEditionTitle(editions: MangacollecCollection["editions"], editionId: string): string | null {
    const edition = editions.find((e) => e.id === editionId);
    if (!edition) {
        return null;
    }
    return edition.title || null;
}

function possessionsToBooks(
    possessions: MangacollecCollection["possessions"],
    volumes: MangacollecCollection["volumes"],
    edition: MangacollecCollection["editions"][number],
    editionTitleOverride?: string | null
): BookElement[] {
    return possessions
        .map((possession) => {
            const volume = getVolume(volumes, possession.volume_id);
            if (!volume) return null;
            let ean: number | null = null;
            if (volume.isbn && !isNaN(Number(volume.isbn))) {
                ean = Number(volume.isbn);
            }
            return {
                type: "book" as const,
                title: null,
                number: volume.number,
                cover: volume.image_url ? {
                    small: volume.image_url,
                    medium: volume.image_url,
                    large: volume.image_url,
                } : null,
                addedDate: possession.created_at,
                edition: editionTitleOverride ?? possession.edition_name ?? edition.title ?? null,
                id: {
                    mangacollec: volume.id,
                },
                ean: ean,
            };
        })
        .filter((b): b is Exclude<typeof b, null> => b !== null)
        .sort((a, b) => {
            return a.number - b.number || (a.title || '').localeCompare(b.title || '');
        });
}

function getNextVolumes(
    edition: MangacollecCollection["editions"][number],
    allVolumes: MangacollecCollection["volumes"],
    userPossessions: MangacollecCollection["possessions"]
): NextBookElement[] {
    // Get all volumes for this edition
    const editionVolumes = allVolumes.filter(v => v.edition_id === edition.id);
    // Get owned volume IDs
    const ownedVolumeIds = new Set(userPossessions.map(p => p.volume_id));
    // Filter volumes not owned or releasing in the future
    return editionVolumes
        .filter(v =>
            (!ownedVolumeIds.has(v.id) && v.release_date)
        )
        .map((volume) => ({
            type: "book" as const,
            title: null,
            number: volume.number,
            cover: volume.image_url ? {
                small: volume.image_url,
                medium: volume.image_url,
                large: volume.image_url,
            } : null,
            addedDate: null,
            releaseDate: volume.release_date ?? null,
            edition: edition.title ?? null,
            id: {
                mangacollec: volume.id,
            },
            ean: volume.isbn && !isNaN(Number(volume.isbn)) ? Number(volume.isbn) : null,
        }))
        .sort((a, b) => a.number - b.number);
}

function buildBookGroup(
    edition: MangacollecCollection["editions"][number],
    series: MangacollecCollection["series"][number],
    types: MangacollecCollection["types"],
    editionVolumes: MangacollecCollection["volumes"],
    books: ReturnType<typeof possessionsToBooks>,
    nextBooks: NextBookElement[],
): BookGroup & { next: BookElement[] } {
    return {
        type: 'book-group',
        title: series.title,
        bookType: getType(types, series.type_id) || 'Unknown',
        source: 'mangacollec',
        count: {
            totalVolumes: edition.last_volume_number,
            lastVolume: editionVolumes.filter(a => a.release_date && new Date(a.release_date) < new Date()).length,
        },
        books,
        next: nextBooks.sort((a, b) => (a.number ?? 0) - (b.number ?? 0)),
    };
}

export async function fetchMangaCollection(username: string): Promise<BookRequest> {
    let collectionJson = await getCollec(username);
    const types = collectionJson.types;
    collectionJson = applyOverrides(collectionJson);

    // Track processed edition IDs
    const processedEditionIds = new Set<string>();

    // Only use followed editions with following: true
    const followedEditionIds = new Set(
        (collectionJson.follow_editions ?? [])
            .filter((fe: { edition_id: string; following: boolean }) => fe.following)
            .map((fe: { edition_id: string }) => fe.edition_id)
    );

    const mainGroups = collectionJson.editions.filter(e => !e.parent_edition_id).map((edition) => {
        const series = getSeries(collectionJson.series, edition.series_id);
        if (!series) return null;

        // Mark this edition as processed
        processedEditionIds.add(edition.id);

        // Find all volumes belonging to child editions
        const childEditions = collectionJson.editions.filter(
            (e) => e.parent_edition_id === edition.id
        );
        const otherEditionsVolumes = childEditions.flatMap(e => collectionJson.volumes.filter(v => v.edition_id === e.id));
        childEditions.forEach(e => processedEditionIds.add(e.id));

        const editionVolumes = collectionJson.volumes.filter(
            (v) => v.edition_id === edition.id
        );

        // Filter possessions for this edition
        let possessions = collectionJson.possessions.filter(
            (p) => getVolume(collectionJson["volumes"], p.volume_id)?.edition_id === edition.id
        );

        // Add possessions for volumes in child editions
        const otherEditionsPossessions = collectionJson.possessions.filter(
            (p) => otherEditionsVolumes.some(v => v.id === p.volume_id)
        ).map((possession) => {
            const editionId = otherEditionsVolumes.find(v => v.id === possession.volume_id)?.edition_id;
            possession.edition_name = editionId ? getEditionTitle(collectionJson.editions, editionId) : null;
            return possession;
        }) as MangacollecCollection["possessions"];
        possessions = possessions.concat(otherEditionsPossessions);

        const books = possessionsToBooks(possessions, collectionJson.volumes, edition);

        // Only show nextBooks if this edition is followed
        const nextBooks = followedEditionIds.has(edition.id)
            ? getNextVolumes(edition, collectionJson.volumes, collectionJson.possessions)
            : [];

        return buildBookGroup(edition, series, types, editionVolumes, books, nextBooks);
    }).filter(Boolean) as (BookGroup & { next: BookElement[] })[];

    // Find editions that have possessions but were not processed
    const overlookedEditions = collectionJson.editions.filter(edition => {
        if (processedEditionIds.has(edition.id)) return false;
        // Has at least one possession
        return collectionJson.possessions.some(p => {
            const volume = getVolume(collectionJson.volumes, p.volume_id);
            return volume && volume.edition_id === edition.id;
        });
    });

    const overlookedGroups = overlookedEditions.map((edition) => {
        const series = getSeries(collectionJson.series, edition.series_id);
        if (!series) return null;

        const editionVolumes = collectionJson.volumes.filter(
            (v) => v.edition_id === edition.id
        );

        const possessions = collectionJson.possessions.filter(
            (p) => getVolume(collectionJson["volumes"], p.volume_id)?.edition_id === edition.id
        );

        const books = possessionsToBooks(possessions, collectionJson.volumes, edition, edition.title || null);

        const nextBooks = followedEditionIds.has(edition.id)
            ? getNextVolumes(edition, collectionJson.volumes, collectionJson.possessions)
            : [];

        return buildBookGroup(edition, series, types, editionVolumes, books, nextBooks);
    }).filter(Boolean) as (BookGroup & { next: BookElement[] })[];

    const result = [...mainGroups, ...overlookedGroups];

    return {
        updatedAt: {
            service: 'Mangacollec',
            timestamp: new Date().toISOString(),
        },
        list: result.sort((a, b) => {
            const aLastBook = a.books[a.books.length - 1];
            const bLastBook = b.books[b.books.length - 1];
            if (!aLastBook || !bLastBook) return 0;
            return new Date(bLastBook.addedDate ?? 0).getTime() - new Date(aLastBook.addedDate ?? 0).getTime();
        })
    };
}