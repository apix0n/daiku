<script lang="ts">
    import { version } from '$app/environment';
</script>

<footer>
    <a href="https://github.com/apix0n" target="_blank">made by apix</a> <span>·</span> {version}
</footer>

<style>
    footer {
        width: 95%;
        text-align: center;
        padding: 10px;
        font-size: .8em;
        color: var(--text-2);
        background: var(--background-2);
        border-radius: var(--border-radius);
        margin: 1.5em auto 0;
        box-sizing: border-box;
    }
    
    @media (min-width: 1000px) {
        footer {
            border-radius: var(--border-radius) var(--border-radius) 0 0;
            padding-bottom: max(env(safe-area-inset-bottom), 10px);
        }
    }

    a {
        transition: all .2s ease-in-out;
    }

    a[href]:hover, span {
        color: var(--app-accent);
    }
</style>