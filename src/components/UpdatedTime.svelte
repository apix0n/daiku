<script>
    export let date, service, margin;

    import { _, locale as localeStore, date as dateI18N, time } from "svelte-i18n";
    import { get } from "svelte/store";
    let locale = get(localeStore)
</script>

<div class="updated-time" class:margin0={margin == 0}>
    <span>{$_("updatedFromServiceAt", { values: { service: service }})}</span>
    <span>{$dateI18N(new Date(date), { month: 'numeric', day: 'numeric', year: 'numeric' } )}, {$time(new Date(date), {format: 'medium'})}</span>
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
        margin-top: 1em;
        
        background: var(--background-2);
        border-radius: 10px;
    }

    .updated-time>span:first-of-type {
        font-weight: 500;
    }

    .margin0 {
        margin: 0;
    }
</style>