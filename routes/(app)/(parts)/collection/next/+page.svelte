<script lang="ts">
    import UpdatedTime from "$components/UpdatedTime.svelte";
    import { _ } from "svelte-i18n";
    import BookGroupDisplay from "../BookGroup.svelte";

    export let data;
    const { list, updatedAt } = data.mangaCollection;
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
    {#each list.filter((element) => element.next.length > 0) as bookGroup}
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
