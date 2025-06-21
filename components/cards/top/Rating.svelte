<script>
    import { ratingStars } from "$lib/utils/ratingStars";
    import InformationsTop from "./InformationsTop.svelte";

    export let value, hasReview = false;
</script>

<InformationsTop>
    {#if hasReview}
        <span class="review-marker rating">💬</span>
    {/if}
    <span class="rating" title={value + '/10'}>{@html ratingStars(value)}</span>
</InformationsTop>