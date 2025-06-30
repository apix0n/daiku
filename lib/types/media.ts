export type MediaElement = {
    media: MediaInformation;
} & UserMediaInformation;

type UserMediaInformation = {
    /**
     * Dates at which the user interacted with the entries (started/finished watching/reading).
     */
    dates?: UserDates;
    status: (typeof UserMediaStatus)[number];
    progress?: UserMediaProgress;
    review: UserReview | null; // null if no review
    repeat?: number | boolean;

    /**
     * A 2-character ISO 369-1 string referring to the language in which the media was watched, manga was read; `undefined` if default. 
     */
    lang?: string | undefined;
}

type MediaInformation = {
    title: MediaTitles;
    type: (typeof MediaType)[number];
    source: (typeof MediaSource)[number];
    status: (typeof MediaStatus)[number];

    /**
     * The movie or per episode runtime in minutes.
     */
    runtime?: number;

    /**
     * Hexadecimal color code.
     */
    accentColor?: string; // hex color code

    cover: ImageWithSizes;
    banner?: ImageWithSizes;
    episodes?: MediaEpisodesInfo;
    chapters?: MediaEpisodesInfo;
    volumes?: MediaEpisodesInfo;
    synopsis?: MediaSynopsis;

    /**
     * Dates when the media started or ended.
     */
    dates?: {
        /**
         * A date in ISO 8601 format, i.e. `YYYY-MM-DD`, referring to when the media started airing.
         */
        start?: string;

        /**
         * A date in ISO 8601 format, i.e. `YYYY-MM-DD`, referring to when the media released or finished airing.
         */
        end?: string;
    };

    /**
     * If the media is a special episode (OVA) or chapter.
     */
    special: boolean;

    /**
     * Identifiers linking this entry to other services.
     */
    id: MediaIdentifiers;
}

export type MediaIdentifiers = {
    // daiku: string;
    anilist?: number;
    myanimelist?: number;
    tmdb?: number;
    imdb?: string;
    mangacollec?: string;
    letterboxd?: string;
    boxdit?: string,
    isbn?: number;
}

export type MediaTitles = {
    locale?: string;
    english?: string;
    romaji?: string;
    native: string;
}

export const MediaType = ['anime', 'manga', 'movie', 'book'] as const
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

export type MediaSynopsis = {
    text: string;
    source?: string;
};

type UserDates = {
    started?: string;
    finished?: string;
}

export const UserMediaStatus = ['current', 'finished', 'paused', 'dropped', 'planned', 'repeating', 'favourite'] as const

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

export type FavouritesElement = {
    cover: ImageWithSizes;
    name: MediaTitles;
    id?: MediaIdentifiers;
    source: (typeof MediaSource)[number];
}

export type FavouritesGroup = {
    type: (typeof MediaType)[number];
    favourites: FavouritesElement[];
}