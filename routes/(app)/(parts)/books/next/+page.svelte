<script lang="ts">
    import UpdatedTime from "$components/UpdatedTime.svelte";
    import { _ } from "svelte-i18n";
    import BookGroupDisplay from "../BookGroup.svelte";
    import type { BookGroup } from "$lib/types/media";

    export let data;
    const { list, updatedAt } = data.mangaCollection;

    const copiedList = JSON.parse(JSON.stringify(list)) as BookGroup[];

    // Helper: returns true if group has a volume released in the last month
    function hasRecentRelease(group: BookGroup) {
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return group.next.some(volume => {
            if (!volume.releaseDate) return false;
            const date = new Date(volume.releaseDate);
            return date >= oneMonthAgo && date <= now;
        });
    }

    // Helper: returns true if all volumes are unreleased (future)
    function onlyUnreleased(group: BookGroup) {
        const now = new Date();
        return group.next.every(volume => {
            if (!volume.releaseDate) return true;
            return new Date(volume.releaseDate) > now;
        });
    }

    copiedList.sort((a, b) => {
        const aRecent = hasRecentRelease(a);
        const bRecent = hasRecentRelease(b);
        if (aRecent && !bRecent) return -1;
        if (!aRecent && bRecent) return 1;

        const aOnlyUnreleased = onlyUnreleased(a);
        const bOnlyUnreleased = onlyUnreleased(b);
        if (aOnlyUnreleased && !bOnlyUnreleased) return 1;
        if (!aOnlyUnreleased && bOnlyUnreleased) return -1;

        // fallback: alphabetical
        return (a.title || "").localeCompare(b.title || "");
    });
</script>

<h2>
    {$_("navigation.wished")}
    <span>
        · {$_("Nseries", {
            values: {
                n: list.filter((element) => element.next.length > 0).length,
            },
        })}
    </span>
</h2>

<div class="bookshelf">
    {#each copiedList.filter((element) => element.next.length > 0) as bookGroup}
        <BookGroupDisplay {bookGroup} bookType="next" />
    {/each}
</div>

<UpdatedTime info={updatedAt} />

<style>
    @media screen and (max-width: 1000px) {
        .bookshelf {
            width: 100%;
            height: 100%;
            padding: 0 10px;
            box-sizing: border-box;
        }
    }
</style>
