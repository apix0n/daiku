export interface AniListTitle {
    romaji: string | null;
    english: string | null;
    native: string | null;
}

export interface AniListCoverImage {
    color: string | null;
    extraLarge: string;
    large: string;
    medium: string;
}

export interface AniListNextAiringEpisode {
    airingAt: number;
    episode: number;
}

export interface AniListMedia {
    title: AniListTitle;
    format: 'TV' | 'MOVIE' | 'OVA' | 'ONA' | 'SPECIAL' | 'MUSIC';
    episodes: number | null;
    chapters: number | null;
    volumes: number | null;
    duration: number | null;
    id: number;
    idMal: number | null;
    status: typeof AniListMediaStatus[number];
    coverImage: AniListCoverImage;
    bannerImage: string | null;
    countryOfOrigin: string | null;
    nextAiringEpisode: AniListNextAiringEpisode | null;
    startDate: AniListDate | null;
    relations: {
        edges: AniListRelationEdge[],
        nodes: AniListMedia[],
    },

    // custom fields
    lastEpisode?: any,
}

type AniListRelationEdge = {
    relationType: typeof AniListRelationType[number];
}

export const AniListRelationType = ['ADAPTATION',
    'PREQUEL',
    'SEQUEL',
    'PARENT',
    'SIDE_STORY',
    'CHARACTER',
    'SUMMARY',
    'ALTERNATIVE',
    'SPIN_OFF',
    'OTHER',
    'SOURCE',
    'COMPILATION',
    'CONTAINS',
] as const;

export const AniListMediaStatus = ['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS'] as const;

export interface AniListDate {
    year: number | null;
    month: number | null;
    day: number | null;
}

export interface MediaListEntry {
    media: AniListMedia;
    score: number | null;
    progress: number;
    progressVolumes: number | null;
    notes: string | null;
    status: (typeof AniListUserMediaStatus)[number];
    repeat: number;
    startedAt: AniListDate;
    completedAt: AniListDate;
    updatedAt: number;

    // custom fields
    daikuReadingLang: string | undefined;
    daikuLastChapterSource: string | undefined;
}

export const AniListUserMediaStatus = ['CURRENT', 'PLANNING', 'COMPLETED', 'DROPPED', 'PAUSED', 'REPEATING'] as const;

export interface MediaListGroup {
    entries: MediaListEntry[];
}

export interface MediaListCollection {
    lists: MediaListGroup[];
}

export interface AniListResponse {
    data: {
        MediaListCollection: MediaListCollection;
    };
}