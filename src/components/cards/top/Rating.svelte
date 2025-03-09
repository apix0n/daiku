<script>
    import { ratingStars } from "$lib/ratingStars";

    export let value;
</script>

<div class="informations top">
    <span class="rating">{@html ratingStars(value)}</span>
</div>