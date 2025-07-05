<script>
  let { children } = $props();
  import "../app.css";
</script>
<main>
  {@render children()}
</main>


<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    /* background: #1a1a1a; */
    box-sizing: border-box;
  }

  main {
    min-height: 100vh; /* Đảm bảo chiếm toàn bộ chiều cao màn hình */
    width: 100vw;       /* Đảm bảo chiếm toàn bộ chiều rộng */
    display: flex;
    flex-direction: column;
  }
</style>