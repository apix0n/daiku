<script>
    import { version } from '$app/environment';
</script>

<footer>
    <a target="_blank">made by apix</a> · {version}
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
            margin-bottom: -16px;
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }
    }

    a[href]:hover {
        color: var(--app-accent)
    }
</style>