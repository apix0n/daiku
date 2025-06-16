<script lang="ts">
    import type { UpdatedAt } from "$lib/types/requests";
    export let info: UpdatedAt | UpdatedAt[];

    import { _, date as dateI18N, time } from "svelte-i18n";

    $: infos = Array.isArray(info) ? info : [info];
</script>

<div class="updated-times" class:single={!Array.isArray(info)}>
    {#each infos as info}
        <div class="updated-time">
            <span
                >{$_("updatedFromServiceAt", {
                    values: { service: info.service },
                })}</span
            >
            <span
                >{$dateI18N(new Date(info.timestamp), {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                })}, {$time(new Date(info.timestamp), {
                    format: "medium",
                })}</span
            >
        </div>
    {/each}
</div>

<style>
    .updated-time {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 17px;
        gap: 4px;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
        background: var(--background-2);
        border-radius: 10px;
    }

    .updated-time > span:first-of-type {
        font-weight: 500;
    }

    .updated-times {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 1em;
    }

    .updated-times:not(.single) .updated-time {
        margin: 0;
    }
</style>