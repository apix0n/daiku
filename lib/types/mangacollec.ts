export type MangacollecCollection = {
    editions: MangacollecEdition[];
    series: MangacollecSeries[];
    types: MangacollecType[];
    volumes: MangacollecVolume[];
    possessions: MangacollecPossession[];
    follow_editions: MangacollecFollowEdition[];
}

export type MangacollecTypesRequest = MangacollecType[];

type MangacollecEdition = {
    id: string;
    title: string | null;
    series_id: string;
    publisher_id: string;
    parent_edition_id: string | null;
    volumes_count: number | null;
    last_volume_number: number | null;
    commercial_stop: boolean;
    not_finished: boolean;
    follow_editions_count: number;
}

export type MangacollecSeries = {
    id: string;
    title: string | null;
    type_id: string;
    adult_content: boolean;
    editions_count: number;
    tasks_count: number;
    kinds_ids: string[];
}

export type MangacollecType = {
    id: string;
    title: string;
    to_display: boolean;
}

export type MangacollecVolume = {
    id: string;
    title: string | null;
    number: number;
    release_date: string | null; // ISO date format
    isbn: string | null; // ISBN number
    asin: string | null; // ISBN number
    edition_id: string;
    possessions_count: number;
    not_sold: boolean;
    image_url: string | null; // URL to the cover image
}

type MangacollecPossession = {
    id: string;
    volume_id: string;
    user_id: string;
    created_at: string; // ISO date format

    /**
     * Non-standard, this field is added to indicate the edition name for the volume.
     * It is not part of the original Mangacollec API response.
     */
    edition_name: string | null;
}

type MangacollecFollowEdition = {
    id: string;
    edition_id: string;
    user_id: string;
    following: boolean; // true if the user is following this edition
    created_at: string; // ISO date format
    updated_at: string; // ISO date format
}
