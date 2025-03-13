<script>
    export let data;
    import { _ } from "svelte-i18n"
</script>

<div class="statistics">
    <h2>{$_("stats")}</h2>
    <div class="parent">
        <!-- 1 2 3 -->
        <!-- 4 5 6 -->
        <div>
            <span class="highlight">{data.animeData.watched.length}</span>
            <span>{$_('watchedAnime')}</span>
        </div>
        <div>
            <span class="highlight">{data.watchedMovies.watched.length}</span>
            <span>{$_('watchedMovies')}</span>
        </div>
        <div>
            <span class="highlight">{data.mangaData.read.length}</span>
            <span>{$_('readManga')}</span>
        </div>
        <div>
            <span class="highlight">
                {[data.animeData.current, data.animeData.watched, data.animeData.dropped].reduce((total, section) => {
                    return total + section.reduce((sectionTotal, anime) => {
                        return sectionTotal + (anime.episodesProgress || anime.episodesNumber * (1 + anime.rewatch) || 0);
                    }, 0);
                }, 0)}
            </span>
            <span>{$_('watchedEpisodes')}</span>
        </div>
        <div>
            <span class="highlight">
                {data.mangaCollection['collection'].reduce((total, manga) => {
                    return total + manga.editions.reduce((editionTotal, edition) => {
                        return editionTotal + edition.possessions.length;
                    }, 0);
                }, 0)}
            </span>
            <span>{$_('ownedVolumes')}</span>
        </div>
        <div>
            <span class="highlight">
                {[data.mangaData.current, data.mangaData.read, data.mangaData.dropped].reduce((total, section) => {
                    return total + section.reduce((sectionTotal, manga) => {
                        return sectionTotal + (manga.chaptersProgress || manga.chapterCount || 0);
                    }, 0);
                }, 0)}
            </span>
            <span>{$_('chaptersRead')}</span>
        </div>
    </div>
</div>

<style>
    .statistics {
        background: var(--background-2);

        display: flex;
        flex-direction: column;
        padding: 0px 16px 16px 16px;
        /* gap: 18px; */

        /* width: 353px; */
        height: 292px;

        border-radius: 17px;
        overflow-y: auto;
    }

    .parent {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        height: 100%;
    }

    .parent div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
    }

    .parent div span {
        font-size: 1.5em;
    }
    
    .parent div span.highlight {
        font-weight: 500;
        color: var(--app-accent);
    }
    
    .parent div span:not(.highlight) {
        line-height: 100%;
    }
</style>