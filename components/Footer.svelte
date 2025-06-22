<script lang="ts">
    import { version } from '$app/environment';
</script>

<footer>
    <a href="https://github.com/apix0n" target="_blank">made by apix</a> <span>·</span> {version}
</footer>

<style>
    footer {
        width: 95%;
        /* max-width: 95vw; */
        text-align: center;
        padding: 10px;
        font-size: .8em;
        color: var(--text-2);
        background: var(--background-2);
        /* border-top: 1px solid var(--background-3); */
        border-radius: var(--border-radius);
        margin: 1.5em auto 0;
        box-sizing: border-box;
    }
    
    @media (min-width: 1000px) {
        footer {
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }
    }

    a {
        transition: all .2s ease-in-out;
    }

    a[href]:hover, span {
        color: var(--app-accent);
    }
</style>