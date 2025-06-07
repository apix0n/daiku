export type MediaElement = {
    media: MediaInformation;
} & UserMediaInformation;

type UserMediaInformation = {
    dates?: UserDates;
    status: (typeof UserMediaStatus)[number];
    progress?: UserMediaProgress;
    review: UserReview | null; // null if no review
    repeat?: number | boolean;
    lang?: string | undefined; // reading language for manga, undefined if default or for anime
}

type MediaInformation = {
    title: MediaTitles;
    type: (typeof MediaType)[number];
    source: (typeof MediaSource)[number];
    status: (typeof MediaStatus)[number];
    runtime?: number; // in minutes
    accentColor?: string; // hex color code
    cover: ImageWithSizes;
    banner?: ImageWithSizes;
    episodes?: MediaEpisodesInfo;
    chapters?: MediaEpisodesInfo;
    volumes?: MediaEpisodesInfo;
    synopsis?: MediaSynopsis;
    dates?: {
        start?: string; // ISO date string
        end?: string; // ISO date string
    }
    special: boolean; // true if the media is a special episode (ova) or chapter (oneshot, etc.)
    id: MediaIdentifiers;
}

type MediaIdentifiers = {
    // daiku: string;
    anilist?: number;
    myanimelist?: number;
    tmdb?: number;
    imdb?: string;
    mangacollec?: string;
    letterboxd?: string;
    isbn?: number;
}

export type MediaTitles = {
    locale?: string;
    english?: string;
    romaji?: string;
    native: string;
    nativeOrigin: string; // language code, e.g., 'ja' for Japanese
    localeLang?: string; // language code for the locale pulled title, e.g., 'en' for English
}

export const MediaType = ['anime', 'manga', 'movie', 'volume'] as const
const MediaSource = ['anilist', 'letterboxd', 'mangacollec'] as const
export const MediaStatus = ['airing', 'finished', 'notYetReleased', 'hiatus', 'cancelled'] as const

type ImageWithSizes = {
    small: string;
    medium: string;
    large: string;
}

export type SingleEpisodeInfo = {
    number: number;
    timestamp: number; // Unix timestamp in milliseconds
}

type MediaEpisodesInfo = {
    count: number;
    last?: SingleEpisodeInfo;
    next?: SingleEpisodeInfo;
}

type MediaSynopsis = {
    text: string;
    source?: string;
};

type UserDates = {
    started?: string;
    finished?: string;
}

export const UserMediaStatus = ['current', 'finished', 'paused', 'dropped', 'planned', 'repeating'] as const

export type UserMediaProgress = {
    episode?: number;
    chapter?: number;
    volume?: number;
}

type UserReview = {
    rating: number; // 1-10 scale
    text?: string;
    spoiler?: boolean;
    isHtml?: boolean;
}