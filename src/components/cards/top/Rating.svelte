<script>
    import { ratingStars } from "$lib/ratingStars";
    import InformationsTop from "./InformationsTop.svelte";

    export let value;
</script>

<InformationsTop>
    <span class="rating">{@html ratingStars(value)}</span>
</InformationsTop>