<script>
    import { formatDateLocale } from "$lib/formatDateLocale";
    import { getRelativeTime } from "$lib/getRelativeTime";

    export let data;
    import { _, locale as localeStore } from "svelte-i18n"
    import { get } from "svelte/store";

    const locale = get(localeStore)

    function concatenateWithSpace(...values) {
        return values.filter(value => value !== null && value !== undefined).join(' ');
    }

    function groupByDay(activities) {
        const grouped = {};
        activities.forEach(activity => {
            const date = `${new Date(activity.date).toLocaleDateString("sv")}`; // swedish uses format close to iso, so it gets grouped per the ua timezone; https://stackoverflow.com/a/65758103
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(activity);
        });
        return grouped;
    }
    
    $: groupedActivities = groupByDay(data.recentActivity);
</script>

<div class="recent-activity">
    <h2>{$_("recentActivity")}</h2>
    {#each Object.keys(groupedActivities) as date}
        <div class="day-group">
            <span title={new Date(date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}>{getRelativeTime(locale, date)}</span>
            {#each groupedActivities[date] as activity}
                <div>
                    <img src={activity.coverSrc} alt="">
                    <span class="message">{concatenateWithSpace(activity.messagePrefix, activity.activityProgress, activity.messageRoot)} <a href={activity.mediaLink} target="_blank">{activity.mediaTitle}</a>{activity.messageSuffix}.</span>
                    {#if activity.mediaType !== "movie"}
                        <span class="hour" title={new Date(activity.date).toLocaleString(locale)}>{new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {/if}
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    h2 {
        all: unset;
        font-size: 2rem;
        font-weight: 500;
        position: sticky;
        top: 0;
        background: var(--background-2);
        margin-bottom: -8px;
    }

    .recent-activity {
        background: var(--background-2);

        display: flex;
        flex-direction: column;
        padding: 0px 16px 16px 16px;
        gap: 18px;

        /* width: 359px; */
        height: 558px;

        border-radius: 17px;
        overflow-y: auto;

        grid-area: 3 / 5 / 3 / 7;
    }

    a {
        font-weight: 500;
    }

    a[href] {
        color: var(--app-accent);
    }

    a[href]:hover {
        text-decoration: underline;
    }

    .recent-activity .day-group div {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px;
        gap: 8px;

        height: fit-content;

        background: var(--background-3);
        border-radius: 10px;
    }

    .recent-activity .day-group div img {
        --max-width: 2.5em;
        min-width: var(--max-width);
        height: calc(var(--max-width) * 1.5);       
        border-radius: 5px;
        object-fit: cover;
    }

    .recent-activity .day-group div .message {
        width: 100%;
    }

    .recent-activity .day-group div .hour {
        color: var(--text-3);
        font-size: .8rem;
    }

    .day-group {
        gap: 6px;
        display: flex;
        flex-direction: column;
    }

    .day-group>span {
        padding: 2px 9px;
        width: fit-content;
        background: var(--background-4);
        border-radius: 16px;
    }
</style>