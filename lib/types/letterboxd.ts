// from https://github.com/erunion/letterboxd-client/blob/main/src/definitions.ts
// edited to remove useless/unneeded information in this context

export interface LogEntriesResponse {
    items: LogEntry[];
    next?: string;
}


export interface FilmsResponse {
    /**
     * The list of films.
     */
    items: FilmSummary[];

    /**
     * The cursor to the next page of results.
     */
    next?: string;
  }

export interface Image {
    sizes: ImageSize[];
}

export interface ImageSize {
    height: number;
    url: string;
    width: number;
}

export interface LogEntry {
    backdrop: Image;
    diaryDetails: DiaryDetails;

    /**
     * The film being logged. Includes a `MemberFilmRelationship` for the member who created the log
     * entry.
     *
     * @see MemberFilmRelationship
     */
    film: FilmSummary;
    id: string;

    /**
     * Will be `true` if the member likes the film (via the 'heart' icon).
     */
    like: boolean;

    /**
     * A list of relevant URLs for this entity, on Letterboxd and external sites.
     */
    links: Link[];

    /**
     * A descriptive title for the log entry.
     */
    name: string;

    /**
     * The member who created the log entry.
     */
    owner: MemberSummary;

    /**
     * The member's rating for the film. Allowable values are between `0.5` and `5.0`, with
     * increments of `0.5`.
     */
    rating: number;

    /**
     * Review details for the log entry, if present.
     */
    review: Review;

    tags: string[];

    /**
     * The tags for the log entry.
     */
    tags2: Tag[];

    /**
     * The timestamp of when the log entry was created, in ISO 8601 format with UTC timezone, i.e.
     * `YYYY-MM-DDThh:mm:ssZ`
     *
     * @example 1997-08-29T07:14:00Z
     */
    whenCreated: string;

    /**
     * The timestamp of when the log entry was last updated, in ISO 8601 format with UTC timezone,
     * i.e. `YYYY-MM-DDThh:mm:ssZ`
     *
     * @example 1997-08-29T07:14:00Z
     */
    whenUpdated: string;
}

export interface DiaryDetails {
    /**
     * The date the film was watched, if specified, in ISO 8601 format, i.e. `YYYY-MM-DD`
     */
    diaryDate: string;

    /**
     * Will be `true` if the member has indicated (or it can be otherwise determined) that the member
     * has seen the film prior to this date.
     */
    rewatch: boolean;
}

export interface FilmSummary {
    /**
     * `true` if the film is in TMDb's 'Adult' category.
     */
    adult: boolean;

    /**
     * The film's unobfuscated poster image (2:3 aspect ratio in multiple sizes), only populated if
     * the `adult` flag is `true`, may contain adult content.
     */
    adultPoster: Image;

    /**
     * The other names by which the film is known (including alternative titles and/or foreign translations).
     */
    alternativeNames: string[];

    /**
     * The LID of the collection containing this film.
     */
    filmCollectionId: string;

    /**
     * The LID of the film.
     */
    id: string;

    /**
     * A list of relevant URLs for this entity, on Letterboxd and external sites.
     */
    links: Link[];

    /**
     * The title of the film.
     */
    name: string;

    /**
     * The original title of the film, if it was first released with a non-English title.
     */
    originalName: string;

    /**
     * The film's poster image (2:3 aspect ratio in multiple sizes). Will contain only a single
     * obfuscated image if the `adult` flag is `true`.
     */
    poster: Image;

    /**
     * The year in which the film was first released.
     */
    releaseYear: number;

    /**
     * The film's duration (in minutes).
     */
    runTime: number;
}

export interface Link {
    /**
     * The object ID for the linked entity on the destination site.
     */
    id: string;

    /**
     * Denotes which site the link is for.
     */
    type:
    | 'facebook'
    | 'gwi'
    | 'imdb'
    | 'instagram'
    | 'justwatch'
    | 'letterboxd'
    | 'ticket'
    | 'tmdb'
    | 'twitter'
    | 'youtube';

    /**
     * The fully qualified URL on the destination site.
     */
    url: string;
}


export interface MemberSummary {
    /**
     * The member's avatar image at multiple sizes. Avatar images to not have an enforced aspect
     * ratio, so should be center-cropped to a square if they are not 1:1.
     */
    avatar: Image;

    /**
     * A convenience method that returns the member's given name and family name concatenated with a
     * space, if both are set, or just their given name or family name, if one is set, or their
     * username, if neither is set. Will never be empty.
     */
    displayName: string;

    /**
     * The family name of the member.
     */
    familyName: string;

    /**
     * The given name of the member.
     */
    givenName: string;

    /**
     * The LID of the member.
     */
    id: string;

    /**
     * A convenience method that returns the member's given name, if set, or their username. Will
     * never be empty.
     */
    shortName: string;

    /**
     * The member's Letterboxd username. Usernames must be between 2 and 15 characters long and may
     * only contain upper or lowercase letters, numbers or the underscore (`_`) character.
     */
    username: string;
}

export interface Review {
    /**
     * Will be `true` if the member has indicated that the `review` field contains plot spoilers for
     * the film.
     */
    containsSpoilers: boolean;

    /**
     * The review text in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
     * `<i>` `<a href="">` `<blockquote>`.
     */
    lbml: string;

    /**
     * Will be `true` if the `review` has been removed by a moderator.
     */
    moderated: boolean;

    /**
     * Will be `true` if the spoilers flag has been locked by a moderator.
     */
    spoilersLocked: boolean;

    /**
     * The review text formatted as HTML.
     */
    text: string;

    /**
     * The timestamp when this log entry's review was first published, in ISO 8601 format with UTC
     * timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
     *
     * @example 1997-08-29T07:14:00Z
     */
    whenReviewed: string;
}

export interface Tag {
    /**
     * The tag code.
     */
    code: string;

    /**
     * The tag text as entered by the tagger.
     */
    displayTag: string;

    /**
     * @deprecated Use `displayTag` instead.
     * @see Tag.displayTag
     */
    tag: string;
}