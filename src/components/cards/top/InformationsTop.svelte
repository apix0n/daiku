<script>
    export let catchUp = false;
</script>

<div class="informations top" class:toCatchUp={catchUp}>
    <slot></slot>
</div>

<style>
    .informations.top {
        display: flex;
        max-width: 100%;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        background: linear-gradient(180deg, rgb(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 65%, rgba(0, 0, 0, 0) 100%);
        padding: .5em;
        width: inherit;
        padding-bottom: 1em;
        flex-direction: row;
        justify-content: space-between;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
    }

    :global .informations.top:has(> :last-child:nth-child(1)) {
        justify-content: flex-end;
    }

    :global .informations.top>span:not(.rating) {
        width: 100%;
        text-align: center;
        text-shadow: 0 0 5px var(--black);
        overflow: unset;
        font-size: .8em;
    }

    .toCatchUp {
        font-weight: 500;
    }
</style>