import type { MediaElement } from "$lib/types/media";
import type { MovieRequest, UpdatedAt } from "$lib/types/requests";

export function combineMoviesLists(...movieLists: MovieRequest[]): MovieRequest {
    const combinedMovies: MediaElement[] = [];
    const idMap: Record<string, MediaElement> = {}; // Maps IDs to media elements
    const updatedAtList: UpdatedAt[] = [];

    // Helper function to merge two media objects
    const mergeMediaObjects = (target: MediaElement, source: MediaElement) => {
        // Merge IDs
        target.media.id = { ...target.media.id, ...source.media.id };

        // Merge other media properties if they're missing in target
        if (!target.media.title && source.media.title) target.media.title = source.media.title;
        if (!target.media.synopsis && source.media.synopsis) target.media.synopsis = source.media.synopsis;
        if (!target.media.banner && source.media.banner) target.media.banner = source.media.banner;
        if (!target.media.runtime && source.media.runtime) target.media.runtime = source.media.runtime;
        // Add more properties as needed

        // Merge dates carefully
        if (source.dates?.finished) {
            if (!target.dates) target.dates = {};
            if (!target.dates.finished) {
                target.dates.finished = source.dates.finished;
            } else if (target.dates.finished !== source.dates.finished) {
                return false; // Indicate dates conflict
            }
        }
        return true; // Indicate successful merge
    };

    // Process each movie list
    for (const movieList of movieLists) {
        // Add update timestamp for this service
        if (Array.isArray(movieList.updatedAt)) {
            updatedAtList.push(...movieList.updatedAt);
        } else {
            updatedAtList.push(movieList.updatedAt);
        }

        // Process each movie in the list
        for (const movie of movieList.watched) {
            let foundMatch = false;

            // Check all IDs of the current movie to see if we've encountered any before
            for (const [source, id] of Object.entries(movie.media.id)) {
                if (!id) continue; // Skip null/undefined IDs

                const key = `${source}:${id}`;
                if (idMap[key]) {
                    // Found a match by ID - attempt to merge
                    const mergeSuccess = mergeMediaObjects(idMap[key], movie);

                    if (mergeSuccess) {
                        foundMatch = true;
                        break;
                    }
                    // If merge failed (due to date conflict), continue looking for other matches
                }
            }

            if (!foundMatch) {
                // Add as new entry
                const newMovie = { ...movie };
                combinedMovies.push(newMovie);

                // Add all its IDs to the map
                for (const [source, id] of Object.entries(newMovie.media.id)) {
                    if (id) {
                        const key = `${source}:${id}`;
                        idMap[key] = newMovie;
                    }
                }
            }
        }
    }

    // Sort by watch date (newest first)
    combinedMovies.sort(
        (a, b) => new Date(b.dates?.finished || 0).getTime() - new Date(a.dates?.finished || 0).getTime()
    );

    return {
        updatedAt: updatedAtList,
        watched: combinedMovies,
    };
}

export function mergeMovieIds(movies: MediaElement[]): MediaElement[] {
    // Map from ID to set of all IDs it connects to
    const idGraph = new Map<string, Set<string>>();

    // Build the ID graph
    for (const movie of movies) {
        const ids = Object.entries(movie.media.id)
            .filter(([, val]) => val)
            .map(([source, id]) => `${source}:${id}`);

        for (const id1 of ids) {
            if (!idGraph.has(id1)) idGraph.set(id1, new Set());
            for (const id2 of ids) {
                if (id1 !== id2) {
                    idGraph.get(id1)!.add(id2);
                }
            }
        }
    }

    // Traverse the graph to find connected components
    const idToComponent = new Map<string, Set<string>>();
    const visited = new Set<string>();

    function dfs(start: string, component: Set<string>) {
        const stack = [start];
        while (stack.length) {
            const id = stack.pop()!;
            if (visited.has(id)) continue;
            visited.add(id);
            component.add(id);
            for (const neighbor of idGraph.get(id) ?? []) {
                if (!visited.has(neighbor)) stack.push(neighbor);
            }
        }
    }

    for (const id of idGraph.keys()) {
        if (!visited.has(id)) {
            const component = new Set<string>();
            dfs(id, component);
            for (const idInGroup of component) {
                idToComponent.set(idInGroup, component);
            }
        }
    }

    // Second pass: apply all connected IDs to each movie
    return movies.map(movie => {
        const originalIds = Object.entries(movie.media.id)
            .filter(([, val]) => val)
            .map(([source, id]) => `${source}:${id}`);

        const fullIdSet = new Set<string>();
        for (const idKey of originalIds) {
            const component = idToComponent.get(idKey);
            if (component) {
                for (const id of component) fullIdSet.add(id);
            } else {
                fullIdSet.add(idKey);
            }
        }

        const newIds: Record<string, string> = {};
        for (const [source, id] of Object.entries(movie.media.id)) {
            if (id !== undefined && id !== null) {
                newIds[source] = String(id);
            }
        }
        for (const idKey of fullIdSet) {
            const [source, id] = idKey.split(':');
            if (!newIds[source]) {
                newIds[source] = id;
            }
        }

        return {
            ...movie,
            media: {
                ...movie.media,
                id: newIds
            }
        };
    });
}
