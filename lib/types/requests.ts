import type { MediaElement, FavouritesGroup, BookGroup, BookElement } from "./media";

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

export type MovieRequest = {
    updatedAt: UpdatedAt | UpdatedAt[];
    watched: MediaElement[];
}

export type FavouritesRequest = {
    updatedAt: UpdatedAt;
    favourites: FavouritesGroup[];
}

export type BookRequest = {
    updatedAt: UpdatedAt;
    list: BookGroup[];
}

export type UpdatedAt = {
    service: string;
    timestamp: string; // ISO 8601 format
};