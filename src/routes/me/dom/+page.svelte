<script>
    function handleClick() {
        const input = document.getElementById("my-input");
        const output = document.getElementById("result");

        const value = input?.value;
        input?.focus();

        output.textContent = `Bạn đã nhập: ${value}`;
    }
</script>

<input id="my-input" placeholder="Gõ gì đó" />
<button on:click={handleClick}>Gọi DOM function</button>
<p id="result"></p>