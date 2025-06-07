import type { MediaElement } from "./media";

export type AnimeRequest = {
    updatedAt: UpdatedAt;
    current: MediaElement[];
    watched: MediaElement[];
    dropped: MediaElement[];
}

export type MangaRequest = {
    updatedAt: UpdatedAt;
    current: MediaElement[];
    read: MediaElement[];
    dropped: MediaElement[];
}

export type PlannedRequest = {
    updatedAt: UpdatedAt;
    anime: MediaElement[];
    manga: MediaElement[];
    movies: MediaElement[];
}

export type UpdatedAt = {
    service: string;
    timestamp: string; // ISO 8601 format
};