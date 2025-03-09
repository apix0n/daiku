<script>
    export let title, link;
</script>

<div class="informations">
    <div class="upper">
        <a class="media-title" href="{link}" target="_blank">{title}</a>
    </div>
    <slot />
</div>