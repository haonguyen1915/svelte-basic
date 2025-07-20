<script>
  let { children } = $props();
  
  import "../app.css";
  import { Toaster } from 'svelte-sonner';
</script>
<main class="bg-gray-400">
  {@render children()}
  <Toaster position="top-right" />
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

  main {
    min-height: 100vh;
    /* background-color: black; */
    /* width: 100vw;  */
    /* display: flex; */
    /* flex-direction: column; */
  }
</style>
