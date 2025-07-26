<script>
    let {children} = $props();

    import "../app.css";
    import {Toaster} from 'svelte-sonner';
    import {ModeWatcher} from "mode-watcher";
    import ThemeToggle from "$common/ThemeToggle.svelte";
</script>
<main>
    <ModeWatcher/>
    <ThemeToggle/>
    {@render children()}
    <Toaster position="top-right"/>
</main>


<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box;
    }
</style>
