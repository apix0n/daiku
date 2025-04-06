<script>
    import { ratingStars } from "$lib/ratingStars";

    export let dates, review, progress, mediaType;
    
    // Calculate time between dates if both exist
    let timeSpan = '';
    if (dates?.started && dates?.finished) {
        const start = new Date(dates.started);
        const end = new Date(dates.finished);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        if (days < 1) timeSpan = 'less than a day';
        else if (days === 1) timeSpan = '1 day';
        else if (days < 30) timeSpan = `${days} days`;
        else if (days < 365) timeSpan = `${Math.floor(days/30)} months`;
        else timeSpan = `${Math.floor(days/365)} years`;
    }

    const watchWord = mediaType === 'MANGA' ? 'read' : 'watched';
    const watchingWord = mediaType === 'MANGA' ? 'reading' : 'watching';
</script>

<div class="userinfo">
    <div class="line-info">
        {#if dates?.started && dates?.finished}
            <div class="text">
                {watchWord} in {timeSpan} from
                <span class="date-range">
                    {new Date(dates.started).toLocaleDateString()} to {new Date(dates.finished).toLocaleDateString()}
                </span>
            </div>
        {:else if dates?.finished}
            <div class="text">
                {watchWord} on {new Date(dates.finished).toLocaleDateString()}
                {#if progress}
                    <span class="separator">•</span>
                    at {mediaType === 'MANGA' ? 'chapter' : 'episode'} {progress.episode}
                {/if}
            </div>            
        {:else if progress}
            <div class="text">
                at {mediaType === 'MANGA' ? 'chapter' : 'episode'} {progress.episode}
                {#if dates?.started}
                    <span class="separator">•</span>
                    started {watchingWord} on {new Date(dates.started).toLocaleDateString()}
                {/if}
            </div>
        {/if}
        {#if review?.rating}
            <div class="stars">{@html ratingStars(review.rating)}</div>
        {/if}
    </div>

    {#if review?.text && !review?.isHtml}
        <div class="review">{review.text}</div>
    {:else if review?.text && review?.isHtml}
        <div class="review">{@html review.text}</div>
    {/if}
</div>

<style>
    .userinfo {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 5px 10px;
        background: var(--transparent);
        border: 1px solid var(--transparent);
        backdrop-filter: blur(5px);
        border-radius: 10px;
    }
    
    .review {
        border-radius: 10px;
        margin: 0;
        margin-left: -5px;
        padding: 5px 10px;
        background: inherit;
        white-space: pre-wrap;
        position: relative;
        :global * {
            margin: 0;
        }
    }

    .review::before {
        content: "“";
        position: absolute;
        line-height: 1em;
        top: -.05em;
        font-size: 4em;
        right: .1em;
        font-family: serif;
        font-weight: bold;
        color: var(--transparent);
        float: right;
    }

    .line-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .stars {
        display: flex;
        gap: 1px;
    }
</style>