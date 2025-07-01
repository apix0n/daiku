<script lang="ts">
    import type { BookGroup } from "$lib/types/media";

    import { settings } from "$lib/client/stores/settings.js";
    import { getRelativeTime } from "$lib/utils/getRelativeTime";
    export let bookGroup: BookGroup;
    export let bookType: "books" | "next" = "books";
    const books = bookGroup[bookType];
    import { _ } from "svelte-i18n";

    import { locale, date } from "svelte-i18n";

    const independentBooksCount = new Set(books.map((a) => a.number)).size;
    const toReleaseCount = bookGroup.next.filter(
        (e) => !e.releaseDate || new Date(e.releaseDate) > new Date(),
    ).length;
    const firstNext =
        bookGroup.next.length > 0
            ? bookGroup.next.find(
                  (e) => e.releaseDate && new Date(e.releaseDate) > new Date(),
              )
            : null;
    const firstNextDate = firstNext?.releaseDate
        ? new Date(firstNext.releaseDate)
        : null;
</script>

<div class="book-group" data-book-type={bookType}>
    <h3 class:wrap={$settings.multiLineBooks}>
        {bookGroup.title}
        {#if bookType === "books"}
            <span
                class="series-number-info"
                class:alt={independentBooksCount ===
                    bookGroup.count.totalVolumes}
            >
                {#if independentBooksCount === books.length}
                    {books.length}
                {:else}
                    {independentBooksCount} + {books.length -
                        independentBooksCount}
                {/if}/{bookGroup.count.lastVolume}
            </span>
        {/if}
        {#if bookType === "next"}
            {#if books[0] !== firstNext}
                <span class="series-number-info alt">
                    {books[0].number}
                </span>
            {/if}
            {#if $settings.showNextBooksCount && bookGroup.next.length > 0}
                <span class="series-number-info grey">
                    <span style="color: var(--app-accent)">{bookGroup.next.length - toReleaseCount}</span>
                    {#if toReleaseCount > 0}
                        {toReleaseCount}
                    {/if}
                </span>
            {/if}
        {/if}
        {#if firstNextDate && firstNextDate > new Date()}
            <span
                class="series-number-info"
                class:grey={bookType === "books"}
                title={$date(firstNextDate, { dateStyle: "full" })}
            >
                {firstNext?.number}
                {#if firstNextDate?.getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000}
                    {getRelativeTime(
                        $locale ?? "en",
                        firstNextDate.toDateString(),
                    )}
                {:else}
                    {getRelativeTime(
                        $locale ?? "en",
                        firstNextDate.toDateString(),
                        "month",
                    )}
                {/if}
            </span>
        {/if}
        <div class="series-info">
            {#if $settings.showBookType}
                {bookGroup.bookType}
            {/if}
            {#if bookGroup.count.totalVolumes}
                {#if $settings.showBookType}
                    ·
                {/if}
                {$_("seriesOfNVol", {
                    values: { n: bookGroup.count.totalVolumes },
                })}
            {/if}
        </div>
    </h3>
    <div class="manga-list">
        {#each books as book}
            <div
                class="book-cover"
                data-nocover={!book.cover}
                data-number={book.number}
                data-date={"releaseDate" in book &&
                book.releaseDate &&
                new Date(book.releaseDate) > new Date()
                    ? $date(new Date(book.releaseDate), {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                      })
                    : undefined}
                title={[bookGroup.title, book.number, book.edition]
                    .filter((e) => e)
                    .join(", ")}
            >
                <img
                    src={book.cover?.medium ||
                        books[0].cover?.medium ||
                        bookGroup.books[0].cover?.medium}
                    alt=""
                    class:notYetReleased={"releaseDate" in book &&
                    book.releaseDate
                        ? new Date(book.releaseDate) > new Date()
                        : 0}
                />
            </div>
        {/each}
    </div>
</div>

<style>
    h3,
    img {
        user-select: none;
        -webkit-user-drag: none;
        user-drag: none;
    }
    h3 {
        margin-bottom: 0.5em;
    }
    h3.wrap + .manga-list {
        flex-wrap: wrap;
    }
    .manga-list {
        display: flex;
        width: 100%;
        padding: 2px;
        overflow: hidden;
        overflow-x: scroll;
        box-sizing: border-box;
        gap: 10px;
        position: relative;
        &::-webkit-scrollbar {
            background-color: var(--background-3);
        }
        &:hover::-webkit-scrollbar-thumb {
            background-color: var(--background-3-hover);
        }
        &::-webkit-scrollbar-thumb {
            border-color: var(--background-3);
        }
        &::-webkit-scrollbar-thumb:hover {
            background-color: var(--background-4);
        }
        @media screen and (max-width: 600px), screen and (max-height: 500px) {
            gap: 5px;
            .book-cover {
                height: 120px;
            }
        }
    }

    /* non-chromium only */
    @supports not (interpolate-size: numeric-only) {
        .manga-list {
            overflow: hidden;
            border-bottom: 15px solid var(--background-3);
            border-bottom-left-radius: var(--scrollbar-radius);
            border-bottom-right-radius: var(--scrollbar-radius);
            /* always enable overflow for touch devices */
            @media not (hover: hover) {
                overflow-x: auto;
            }
            &:hover {
                overflow-x: auto;
            }
        }
    }

    h3 {
        font-weight: 600;
        font-size: 1.3em;
        line-height: 120%;
        overflow-wrap: anywhere;
    }

    @media screen and (max-width: 1200px) {
        h3 {
            font-size: 1.2em;
        }
    }

    .book-cover {
        position: relative;
        height: 150px;
        border-radius: 2px;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    }

    [data-book-type="next"] .book-cover[data-date] img {
        opacity: 0.5;
    }

    [data-book-type="next"] .book-cover[data-date]::after {
        content: attr(data-date);
        height: 100%;
        width: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        backdrop-filter: blur(5px);
        filter: grayscale(40%);
    }

    [data-book-type="next"] .book-cover[data-nocover="true"]::after {
        background-color: var(--background-2);
    }

    img {
        max-height: 100%;
    }

    .series-info {
        font-weight: 400;
        color: var(--text-2);
        font-size: 0.9em;
    }

    .series-number-info {
        font-weight: 400;
        background: var(--app-accent);
        padding: 0 0.3em;
        border-radius: 3px;
        color: var(--app-accent-contrast);
        font-size: 0.8em;
    }

    .series-number-info.alt {
        background: var(--app-accent-dark);
        color: var(--app-accent-dark-contrast);
    }

    .series-number-info.grey {
        background: var(--background-2);
        color: var(--text);
    }
</style>
