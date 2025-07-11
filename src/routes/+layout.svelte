<script>
  let { children } = $props();
  
  import "../app.css";
</script>
<main class="bg-primary">
  {@render children()}
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
